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
