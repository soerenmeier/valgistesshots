# Legacy project migration

Like Schwab's top-level `migrations/` folder, this keeps one-off data migration scripts separate from Craft's schema migrations. Unlike Schwab, the source is a public Adobe Portfolio site, not a local MySQL database, and this project does not use Feed Me. These scripts use Node's built-in APIs and Craft GraphQL; no `npm install` or server deployment is required.

## Export

From the project root, run `npm --prefix migrations run export` to refresh [legacy-projects.json](legacy-projects.json), or `npm --prefix migrations run export -- filename.json` to choose an output file. From inside this directory, `npm run export` works too. This reads the six public projects linked from `https://valgistesshots.com/work`; it does not access the new CMS. It overwrites the chosen output file only after every project has been fetched successfully.

Each project records its original URL and slug, title, suggested `firstWord`/`secondWord`, preview image URL, and ordered `images` and `videos` arrays. `position` is the shared zero-based order across both arrays. Image `url` uses the original Adobe Portfolio lightbox file when exposed, otherwise the largest image URL on the page. Video entries are Adobe embed URLs, **not** downloadable video assets. The JSON contains external URLs, not image files; keep the old site/CDN available until the files have been downloaded and imported.

## Import into Craft

In `https://admin.valgistesshots.meierlabs.dev/admin`, create a **separate private GraphQL schema** with site read access and read and create access for the `topics` section and `assets` volume. Create a token for it under GraphQL → Tokens; do not extend the frontend's `Endpoint` schema or commit the token. Schema changes require `allowAdminChanges` (otherwise create the schema locally and deploy project config); tokens must be created in the destination environment. Find the numeric user ID of the Craft account that should author the new topics.

From the project root, run these commands in your **host Bash shell** (not through `ddev npm`). They prompt for the token without adding it to shell history, and for a real numeric Craft user ID so you don't accidentally pass a placeholder:

```bash
read -rsp 'Migration token: ' MIGRATION_TOKEN; printf '\n'
export MIGRATION_TOKEN
npm --prefix migrations run import
# Only after the check succeeds and you have backed up Craft's database and assets:
read -rp 'Numeric Craft author ID: ' CRAFT_AUTHOR_ID
npm --prefix migrations run import -- --apply --images-only --author-id "$CRAFT_AUTHOR_ID"
```

`ddev npm` is a project-specific wrapper that always runs npm in `svelte/`, so `ddev npm run import` will not find this script. If you need to use Node inside DDEV, `ddev exec --dir /var/www/html/migrations npm run import` uses the correct directory, but DDEV does **not** automatically forward `MIGRATION_TOKEN` from your host shell into the container. Using host npm as shown above is simpler for a private token.

The first command checks access and mutation availability without writing. `--apply` imports preview and gallery images from their Adobe URLs via Craft's GraphQL file mutations, then creates the six topic entries. Existing topic slugs are **skipped, never overwritten**; partially uploaded assets are reused by their `legacy-...` filenames on retry. The script uses `https://admin.valgistesshots.meierlabs.dev/actions/graphql/api` (Craft's headless-mode endpoint); set `CRAFT_GRAPHQL_URL` to override it for another environment. Use `--input path/to/export.json` to use another export.

**Videos are not imported.** The export has 14 Adobe embed URLs but no video files; `--images-only` is required to acknowledge that limitation. In particular, the `Above & Beyond` topic will have a preview but an empty gallery, since the current topic query only fetches images. Obtain original videos and add frontend video handling before expecting a complete migration. Review the suggested word split and missing image alt text before publishing. Revoke the migration token when finished.

Run `npm --prefix migrations test` from the project root (or `npm test` here) to test the importer's read-only check, import, and retry behavior against a local mock GraphQL server. It does not contact production.
