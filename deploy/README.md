## PostgreSQL setup

DDEV is already configured for PostgreSQL 16. To install Craft locally:

```bash
ddev start
ddev craft install --interactive=1
```

If replacing a MySQL database or retrying a failed install, run `ddev delete -Oy` first. This deletes the local database without a snapshot. Make sure `CRAFT_DB_CHARSET` is `utf8`, not `utf8mb4`, before installing.

## Production deployment

`riji publish` builds and pushes images; it does not itself restart production services. Once the new Craft image is deployed and the container starts, `/app/docker/start.sh` runs `php craft up --interactive=0` against the production database **before** starting Supervisor, PHP-FPM, and Nginx. A failed update prevents the web processes from starting; Docker's `restart: on-failure` will retry, so check container logs if the service does not become healthy. `craft up` is idempotent and runs at every container start, but only applies pending changes. The image includes PostgreSQL client tools for Craft's migration backups and a health check that stays unhealthy until the web server starts.

If deploying manually, after publishing run these on the deployment host **from the directory containing `compose.yaml`**:

```sh
docker compose pull craft
docker compose up -d --no-deps --wait --wait-timeout 300 craft
# Only after Craft is healthy:
docker compose pull svelte
docker compose up -d --no-deps svelte
```

Do not put `RUN php craft up` in the Dockerfile: image builds have no production database or mounted `.env`. Back up the database and assets before deploying. For the legacy project import, verify the updated `Topic Image` and `Images and Videos` field restrictions are active before re-saving the existing topic or retrying the import.
