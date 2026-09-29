import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const defaultInput = fileURLToPath(
	new URL("../legacy-projects.json", import.meta.url),
);
const endpoint =
	process.env.CRAFT_GRAPHQL_URL ??
	"https://admin.valgistesshots.meierlabs.dev/actions/graphql/api";
const token = process.env.MIGRATION_TOKEN;

function options(args) {
	const result = {
		apply: false,
		imagesOnly: false,
		input: defaultInput,
		authorId: null,
	};

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case "--apply":
				result.apply = true;
				break;
			case "--images-only":
				result.imagesOnly = true;
				break;
			case "--input":
				result.input = args[++i];
				break;
			case "--author-id":
				result.authorId = Number(args[++i]);
				break;
			default:
				throw new Error(`Unknown option: ${args[i]}`);
		}
	}

	if (
		!result.input ||
		(result.authorId !== null &&
			(!Number.isSafeInteger(result.authorId) || result.authorId < 1))
	) {
		throw new Error(
			"Provide a JSON input path and a positive numeric --author-id when specified.",
		);
	}

	return result;
}

async function graphql(query, variables = {}) {
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query, variables }),
		signal: AbortSignal.timeout(120_000),
	});
	const result = await response.json();
	if (!response.ok || result.errors?.length) {
		throw new Error(
			`GraphQL HTTP ${response.status}: ${JSON.stringify(result.errors ?? result)}`,
		);
	}

	return result.data;
}

function typeName(type) {
	if (type.kind === "NON_NULL") return `${typeName(type.ofType)}!`;
	if (type.kind === "LIST") return `[${typeName(type.ofType)}]`;
	return type.name;
}

function requireArgs(field, names) {
	if (!field)
		throw new Error(
			"Migration mutation is not available to this token; check the private schema permissions.",
		);

	for (const name of names) {
		if (!field.args.some((arg) => arg.name === name)) {
			throw new Error(
				`${field.name} is missing the ${name} argument; check the CMS field layout and schema.`,
			);
		}
	}
}

function mutation(field, names, selection) {
	const args = names.map((name) =>
		field.args.find((arg) => arg.name === name),
	);
	return `mutation Import(${args.map((arg) => `$${arg.name}: ${typeName(arg.type)}`).join(", ")}) {
		${field.name}(${args.map((arg) => `${arg.name}: $${arg.name}`).join(", ")}) { ${selection} }
	}`;
}

async function mutations() {
	const { __schema } = await graphql(`
		{
			__schema {
				mutationType {
					fields {
						name
						args {
							name
							type {
								kind
								name
								ofType {
									kind
									name
									ofType {
										kind
										name
										ofType {
											kind
											name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	`);
	const fields = __schema.mutationType?.fields ?? [];
	const asset = fields.find((field) => field.name === "save_assets_Asset");
	const entry = fields.find(
		(field) => field.name === "save_topics_topic_Entry",
	);
	requireArgs(asset, ["_file"]);
	requireArgs(entry, [
		"title",
		"slug",
		"authorId",
		"firstWord",
		"secondWord",
		"previewImage",
		"assets",
	]);

	return {
		asset: mutation(asset, ["_file"], "id filename"),
		entry: mutation(
			entry,
			[
				"title",
				"slug",
				"authorId",
				"firstWord",
				"secondWord",
				"previewImage",
				"assets",
			],
			"id slug",
		),
	};
}

function filename(project, position, url) {
	const ext = new URL(url).pathname
		.match(/\.(jpe?g|png|webp)$/i)?.[1]
		.toLowerCase();
	if (!ext) throw new Error(`Unsupported image URL: ${url}`);

	return `legacy-${project.slug}-${position === null ? "preview" : String(position + 1).padStart(3, "0")}.${ext}`;
}

async function assetId(project, position, url, saveAsset) {
	const name = filename(project, position, url);
	const { assets } = await graphql(
		'query ($filename: [String]) { assets(volume: "assets", filename: $filename) { id filename } }',
		{ filename: [name] },
	);
	if (assets.length > 1)
		throw new Error(
			`Multiple assets named ${name}; cannot choose one safely.`,
		);
	if (assets.length === 1) {
		console.log(`  Reusing ${name}`);
		return assets[0].id;
	}

	const { save_assets_Asset: saved } = await graphql(saveAsset, {
		_file: { url, filename: name },
	});
	if (!saved?.id) throw new Error(`Could not save ${name}`);
	console.log(`  Uploaded ${name}`);
	return saved.id;
}

async function main() {
	const settings = options(process.argv.slice(2));
	const { projects } = JSON.parse(await readFile(settings.input, "utf8"));
	if (!Array.isArray(projects) || !projects.length)
		throw new Error("No projects found in the export.");

	for (const project of projects) {
		filename(project, null, project.previewImageUrl);
		for (const image of project.images)
			filename(project, image.position, image.url);
	}

	const videoCount = projects.reduce(
		(count, project) => count + project.videos.length,
		0,
	);
	console.log(
		`${projects.length} projects, ${projects.reduce((count, project) => count + project.images.length, 0)} images, ${videoCount} Adobe video embeds`,
	);
	if (videoCount)
		console.log(
			"Adobe embed URLs are not video files and cannot be saved in the current Craft assets field.",
		);
	if (settings.apply && videoCount && !settings.imagesOnly) {
		throw new Error(
			"This import cannot migrate video embeds. Pass --images-only to explicitly import without them.",
		);
	}
	if (settings.apply && !settings.authorId)
		throw new Error(
			"Pass --author-id with the ID of a Craft user to author the new topic entries.",
		);
	if (!token)
		throw new Error(
			"Set MIGRATION_TOKEN to a token for a private GraphQL schema with Topics and Assets read/write access.",
		);

	const { asset, entry } = await mutations();
	await graphql(
		'{ assets(volume: "assets", limit: 1) { id } entries(section: "topics", limit: 1) { id } }',
	);
	if (!settings.apply) {
		console.log(
			"GraphQL mutations are available. Dry run: nothing was written. Pass --apply --images-only --author-id <id> to import.",
		);
		return;
	}

	for (const project of projects) {
		const { entry: existing } = await graphql(
			'query ($slug: [String]) { entry(section: "topics", slug: $slug) { id slug } }',
			{ slug: [project.slug] },
		);
		if (existing) {
			console.log(
				`Skipping existing topic ${project.slug} (ID ${existing.id}); no content overwritten.`,
			);
			continue;
		}

		console.log(`Importing ${project.title}`);
		const previewImage = Number(
			await assetId(project, null, project.previewImageUrl, asset),
		);
		const imageIds = [];
		for (const image of project.images) {
			imageIds.push(
				Number(
					await assetId(project, image.position, image.url, asset),
				),
			);
		}

		const { save_topics_topic_Entry: saved } = await graphql(entry, {
			title: project.title,
			slug: project.slug,
			authorId: settings.authorId,
			firstWord: project.firstWord,
			secondWord: project.secondWord,
			previewImage: [previewImage],
			assets: imageIds,
		});
		if (!saved?.id) throw new Error(`Could not save topic ${project.slug}`);
		console.log(`  Created topic ${saved.slug} (ID ${saved.id})`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
