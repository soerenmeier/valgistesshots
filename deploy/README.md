## PostgreSQL setup

DDEV is already configured for PostgreSQL 16. To install Craft locally:

```bash
ddev start
ddev craft install --interactive=1
```

If replacing a MySQL database or retrying a failed install, run `ddev delete -Oy` first. This deletes the local database without a snapshot. Make sure `CRAFT_DB_CHARSET` is `utf8`, not `utf8mb4`, before installing.
