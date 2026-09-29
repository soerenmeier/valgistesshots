# Crelte project

This is a crelte project, if you want to know more about crelte
check out the [documentation](https://docs.crelte.com/).

## Local Development

Everything (Craft CMS and the Svelte dev server) runs inside [DDEV](https://ddev.com),
so you don't need PHP or Node.js on your machine.

Once you have cloned the repository you can start the project with the following commands:

### CMS

```bash
# Copy craft/.env.example.dev to craft/.env if needed, then set PostgreSQL
# (CRAFT_DB_DRIVER=pgsql, CRAFT_DB_SERVER=db, CRAFT_DB_PORT=5432).
# Then start DDEV from the project root:
ddev start
ddev composer install
# For a fresh database, run:
ddev craft install
# Or import an existing PostgreSQL SQL dump instead. Restore assets separately.
```

### Svelte

```bash
ddev npm install
ddev npm run dev
# then run `ddev launch` or open https://<project>.ddev.site
```

## URLs

- **Frontend**: `https://<project>.ddev.site`
- **Craft control panel**: `https://admin.valgistesshots.ddev.site/admin`

## Deployment

See [deploy/README.md](deploy/README.md) for local PostgreSQL setup. The production routes in [docker/compose.yaml](docker/compose.yaml) use `valgistesshots.meierlabs.dev` and `admin.valgistesshots.meierlabs.dev`; image publishing is configured in [riji.rhai](riji.rhai).

## Legacy project export

Run `node scripts/export-legacy-projects.mjs` from the project root to refresh [migration/legacy-projects.json](migration/legacy-projects.json), or pass an output filename as the first argument. This reads the six public projects linked from `https://valgistesshots.com/work`; it does not access the new CMS. It overwrites the chosen output file only after every project has been fetched successfully.

Each project records its original URL and slug, title, suggested `firstWord`/`secondWord`, preview image URL, and ordered `images` and `videos` arrays. `position` is the shared zero-based order across both arrays. Image `url` uses the original Adobe Portfolio lightbox file when exposed, otherwise the largest image URL on the page. Video entries are Adobe embed URLs, **not** downloadable video assets. The JSON contains external URLs, not image files; keep the old site/CDN available until the files have been downloaded and imported.

A later import must upload the images to Craft's Assets volume, create or update entries in the `topics` section, set their required `previewImage` and ordered `assets` relations, and decide how to handle the videos. The export does not create or modify entries on `valgistesshots.meierlabs.dev`; that step requires a writable Craft integration (and suitable credentials) or a Craft-side import command. Review the suggested word split and any missing image alt text before publishing.
