import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const exec = promisify(execFile);
const script = fileURLToPath(
	new URL("./import-legacy-projects.mjs", import.meta.url),
);
const scalar = (name) => ({ kind: "SCALAR", name });
const list = (name) => ({ kind: "LIST", name: null, ofType: scalar(name) });
const arg = (name, type) => ({ name, type });

const mutationFields = [
	{
		name: "save_assets_Asset",
		args: [arg("_file", { kind: "INPUT_OBJECT", name: "FileInput" })],
	},
	{
		name: "save_topics_topic_Entry",
		args: [
			arg("title", scalar("String")),
			arg("slug", scalar("String")),
			arg("authorId", scalar("ID")),
			arg("firstWord", scalar("String")),
			arg("secondWord", scalar("String")),
			arg("previewImage", list("Int")),
			arg("assets", list("Int")),
		],
	},
];

test("checks permissions, imports images, and skips existing topics on retry", async () => {
	const directory = await mkdtemp(join(tmpdir(), "legacy-projects-"));
	const input = join(directory, "projects.json");
	const files = new Map();
	const entries = new Map();
	let writes = 0;
	let failFirstEntry = true;
	const server = createServer(async (request, response) => {
		const chunks = [];
		for await (const chunk of request) chunks.push(chunk);
		const { query, variables } = JSON.parse(
			Buffer.concat(chunks).toString(),
		);
		assert.equal(request.headers.authorization, "Bearer test-token");
		let data;

		if (query.includes("__schema")) {
			data = { __schema: { mutationType: { fields: mutationFields } } };
		} else if (query.includes("save_assets_Asset(")) {
			assert.match(
				variables._file.url,
				/^https:\/\/cdn\.myportfolio\.com\//,
			);
			const saved = {
				id: String(files.size + 1),
				filename: variables._file.filename,
			};
			files.set(saved.filename, saved);
			writes++;
			data = { save_assets_Asset: saved };
		} else if (query.includes("save_topics_topic_Entry(")) {
			if (failFirstEntry) {
				failFirstEntry = false;
				response.setHeader("Content-Type", "application/json");
				response.end(
					JSON.stringify({
						errors: [{ message: "Simulated entry failure" }],
					}),
				);
				return;
			}

			assert.deepEqual(variables.previewImage, [1]);
			assert.deepEqual(variables.assets, [2]);
			assert.equal(variables.authorId, 7);
			const saved = { id: "3", slug: variables.slug };
			entries.set(saved.slug, saved);
			writes++;
			data = { save_topics_topic_Entry: saved };
		} else if (query.includes("filename: $filename")) {
			data = {
				assets: [files.get(variables.filename[0])].filter(Boolean),
			};
		} else if (query.includes("slug: $slug")) {
			data = { entry: entries.get(variables.slug[0]) ?? null };
		} else {
			data = { assets: [], entries: [] };
		}

		response.setHeader("Content-Type", "application/json");
		response.end(JSON.stringify({ data }));
	});

	try {
		await writeFile(
			input,
			JSON.stringify({
				projects: [
					{
						slug: "test-topic",
						title: "Test Topic",
						firstWord: "Test",
						secondWord: "Topic",
						previewImageUrl:
							"https://cdn.myportfolio.com/preview.jpg",
						images: [
							{
								position: 0,
								url: "https://cdn.myportfolio.com/image.jpg",
							},
						],
						videos: [
							{
								position: 1,
								embedUrl: "https://www-ccv.adobe.io/embed",
							},
						],
					},
				],
			}),
		);
		await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
		const env = {
			...process.env,
			MIGRATION_TOKEN: "test-token",
			CRAFT_GRAPHQL_URL: `http://127.0.0.1:${server.address().port}/actions/graphql/api`,
		};
		const run = (...args) =>
			exec(process.execPath, [script, "--input", input, ...args], {
				env,
				timeout: 10000,
			});

		assert.match((await run()).stdout, /Dry run: nothing was written/);
		assert.equal(writes, 0);
		await assert.rejects(
			run("--apply", "--author-id", "7"),
			/--images-only/,
		);
		assert.equal(writes, 0);
		await assert.rejects(
			run("--apply", "--images-only", "--author-id", "7"),
			/Simulated entry failure/,
		);
		assert.equal(writes, 2);
		const retried = await run(
			"--apply",
			"--images-only",
			"--author-id",
			"7",
		);
		assert.match(retried.stdout, /Reusing legacy-test-topic-preview.jpg/);
		assert.match(retried.stdout, /Created topic test-topic/);
		assert.equal(writes, 3);
		assert.match(
			(await run("--apply", "--images-only", "--author-id", "7")).stdout,
			/Skipping existing topic test-topic/,
		);
		assert.equal(writes, 3);
	} finally {
		server.close();
		await rm(directory, { recursive: true, force: true });
	}
});
