# Legacy project migration

Like Schwab's top-level `migrations/` folder, this keeps one-off data migration scripts separate from Craft's schema migrations. Unlike Schwab, the source is a public Adobe Portfolio site, not a local MySQL database, and this project does not use Feed Me. These scripts use Node's built-in APIs and Craft GraphQL; no `npm install` or server deployment is required.

## Export

From this directory, run `npm run export` to refresh [legacy-projects.json](legacy-projects.json), or `npm run export -- filename.json` to choose an output file. This reads the six public projects linked from `https://valgistesshots.com/work`; it does not access the new CMS. It overwrites the chosen output file only after every project has been fetched successfully.

Each project records its original URL and slug, title, suggested `firstWord`/`secondWord`, preview image URL, and ordered `images` and `videos` arrays. `position` is the shared zero-based order across both arrays. Image `url` uses the original Adobe Portfolio lightbox file when exposed, otherwise the largest available rendition on the page. `previewImageUrl` is the first gallery image's URL, or `null` for a video-only project; no old-site cover images are exported. Craft can generate smaller display transforms from the imported files, but cannot restore detail beyond Adobe's source. Video entries are Adobe embed URLs, **not** downloadable video assets. The JSON contains external URLs, not image files; keep the old site/CDN available until the files have been downloaded and imported.

## Import into Craft

In `https://admin.valgistesshots.meierlabs.dev/admin`, create a **separate private GraphQL schema** with site read access and read and create access for the `topics` section and `assets` volume. Create a token for it under GraphQL → Tokens; do not extend the frontend's `Endpoint` schema or commit the token. Schema changes require `allowAdminChanges` (otherwise create the schema locally and deploy project config); tokens must be created in the destination environment. Find the numeric user ID of the Craft account that should author the new topics.

**Before importing again, apply the updated Craft project config to the destination.** Both the `Topic Image` and `Images and Videos` Assets fields must be restricted to the `Assets` volume with a location subpath of `{slug}`. If project config cannot be deployed yet, set those exact field locations in the destination control panel before running the import. On saving a topic, Craft creates its slug folder and moves the related preview and gallery assets there. This is a lasting editorial rule: saving a topic later can also move assets related from other folders, so avoid sharing the same asset between topics.

From this directory, run these commands in Bash. They prompt for the token without adding it to shell history, and for a real numeric Craft user ID so you don't accidentally pass a placeholder:

```bash
read -rsp 'Migration token: ' MIGRATION_TOKEN; printf '\n'
export MIGRATION_TOKEN
npm run import
# Only after the check succeeds and you have backed up Craft's database and assets:
read -rp 'Numeric Craft author ID: ' CRAFT_AUTHOR_ID
npm run import -- --apply --images-only --author-id "$CRAFT_AUTHOR_ID"
```

The first command checks access and mutation availability without writing. If a previous import did not move the assets, test only one image before trying the full import:

```sh
npm run import -- --only design-atmosphere --max-images 1 --apply --images-only --author-id 2
```

This creates the topic with only its first gallery image. If it succeeds, inspect `assets/design-atmosphere/`, then delete **only that pilot topic entry** (keep the asset) before running the full import; the asset is reused. If it fails, keep the topic and asset for diagnosis and report the displayed sample paths. **Rerun the full command with `--apply` to write anything** after removing any existing imported topics; the importer skips existing topic slugs. It uploads gallery images from their Adobe URLs via Craft's GraphQL file mutations, then creates five image-based topics. The first gallery asset ID is also used for the topic's required preview image; it is not downloaded or stored twice. Assets appear in the volume root **temporarily** until the topic is saved; Craft then moves them into `assets/<slug>/`. The importer verifies every image's final path and stops if the destination field settings are not active. If a topic was created but this verification fails, first confirm the **destination** has those field settings, then open and re-save that topic in Craft; this should move its related assets without downloading them again. Check the Assets volume for `<slug>/`. If a re-save does not work, delete only the failed topic entry (keep the uploaded image assets), verify the field settings, and rerun: the importer reuses assets by their `legacy-...` filenames. Existing topic slugs are **skipped, never overwritten**. The script uses `https://admin.valgistesshots.meierlabs.dev/actions/graphql/api` (Craft's headless-mode endpoint); set `CRAFT_GRAPHQL_URL` to override it for another environment. Use `--input path/to/export.json` to use another export.

**Videos are not imported.** The export has 14 Adobe embed URLs but no video files; `--images-only` is required to acknowledge that limitation. `Above & Beyond` has no gallery images, so it is **skipped** instead of inventing a preview image or using the old cover. Obtain an image and the original videos, then add frontend video handling before expecting a complete migration. Review the suggested word split and missing image alt text before publishing. Revoke the migration token when finished.

Run `npm test` here to test the importer's read-only check, slug-folder verification, import, and retry behavior against a local mock GraphQL server. It does not contact production.
