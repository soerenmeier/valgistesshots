import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const source = new URL("https://valgistesshots.com/");
const defaultOutput = fileURLToPath(
	new URL("../legacy-projects.json", import.meta.url),
);

function decodeHtml(value) {
	return value.replace(
		/&(#(?:x[\da-f]+|\d+)|amp|quot|apos|lt|gt|nbsp);/gi,
		(entity, name) => {
			if (name.startsWith("#")) {
				return String.fromCodePoint(
					name[1].toLowerCase() === "x"
						? parseInt(name.slice(2), 16)
						: parseInt(name.slice(1), 10),
				);
			}

			return {
				amp: "&",
				quot: '"',
				apos: "'",
				lt: "<",
				gt: ">",
				nbsp: " ",
			}[name.toLowerCase()];
		},
	);
}

function attributes(tag) {
	return Object.fromEntries(
		[...tag.matchAll(/([\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map((match) => [
			match[1],
			decodeHtml(match[3]),
		]),
	);
}

async function load(url) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`${url}: HTTP ${response.status}`);
	}

	return response.text();
}

function projectsFromIndex(html) {
	const projects = [];

	for (const match of html.matchAll(
		/<a\b[^>]*class="[^"]*\bproject-cover\b[^"]*"[^>]*>[\s\S]*?<\/a>/g,
	)) {
		const link = match[0];
		const href = attributes(link.match(/^<a\b[^>]*>/)[0]).href;
		const url = new URL(href, source);
		const titleMatch = link.match(
			/<div class="title preserve-whitespace">([\s\S]*?)<\/div>/,
		);
		const cover = link.match(
			/<div class="cover cover-normal[^"]*"[^>]*>[\s\S]*?<img\b[^>]*>/,
		);

		if (
			url.origin !== source.origin ||
			!/^\/[a-z0-9-]+$/.test(url.pathname) ||
			!titleMatch ||
			!cover
		) {
			throw new Error(`Unexpected project cover: ${href}`);
		}

		const title = decodeHtml(titleMatch[1]).trim().replace(/\s+/g, " ");
		const previewImageUrl = attributes(cover[0].match(/<img\b[^>]*>/)[0])[
			"data-src"
		];
		if (!previewImageUrl) {
			throw new Error(`Missing preview image for ${url}`);
		}

		const [firstWord, ...rest] = title.split(" ");
		projects.push({
			sourceUrl: url.href,
			slug: url.pathname.slice(1),
			title,
			firstWord,
			secondWord: rest.join(" "),
			previewImageUrl,
		});
	}

	if (
		!projects.length ||
		new Set(projects.map((project) => project.slug)).size !==
			projects.length
	) {
		throw new Error("No unique projects found on /work");
	}

	return projects;
}

function mediaFromProject(html, url) {
	const start = html.indexOf('<div id="project-modules">');
	const end = html.indexOf("</section>", start);
	if (start === -1 || end === -1) {
		throw new Error(`Missing project modules: ${url}`);
	}

	// Adobe Portfolio includes duplicate images inside HTML templates for its lightbox.
	const content = html
		.slice(start, end)
		.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
	const images = [];
	const videos = [];
	let lightboxUrl = null;
	let position = 0;

	for (const match of content.matchAll(/<(?:div|img|iframe)\b[^>]*>/g)) {
		const tag = match[0];
		const attrs = attributes(tag);

		if (
			tag.startsWith("<div") &&
			attrs.class?.split(" ").includes("js-lightbox")
		) {
			lightboxUrl = attrs["data-src"];
		} else if (tag.startsWith("<img")) {
			const classes = attrs.class?.split(" ") ?? [];
			if (
				!classes.includes("e2e-site-project-module-image") &&
				!classes.includes("js-grid__item-image")
			) {
				continue;
			}

			const imageUrl =
				(classes.includes("e2e-site-project-module-image") &&
					lightboxUrl) ||
				attrs["data-src"];
			if (!imageUrl) {
				throw new Error(`Missing image URL in ${url}`);
			}

			images.push({
				position: position++,
				url: imageUrl,
				alt: attrs.alt || null,
			});
			lightboxUrl = null;
		} else if (tag.startsWith("<iframe") && attrs.src) {
			videos.push({ position: position++, embedUrl: attrs.src });
		}
	}

	if (!images.length && !videos.length) {
		throw new Error(`No images or videos found in ${url}`);
	}

	return { images, videos };
}

async function main() {
	const output = resolve(process.argv[2] ?? defaultOutput);
	const projects = projectsFromIndex(await load(new URL("work", source)));

	for (const project of projects) {
		Object.assign(
			project,
			mediaFromProject(await load(project.sourceUrl), project.sourceUrl),
		);
		console.log(
			`${project.title}: ${project.images.length} images, ${project.videos.length} videos`,
		);
	}

	await mkdir(dirname(output), { recursive: true });
	await writeFile(
		output,
		JSON.stringify(
			{
				source: source.href,
				exportedAt: new Date().toISOString(),
				projects,
			},
			null,
			2,
		) + "\n",
	);
	console.log(`Saved ${output}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
