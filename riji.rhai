fn export_db() {
    let pg_dump = cmd([
        "docker",
        "exec",
        "-e",
        "PGPASSWORD=db",
        "ddev-valgistesshots-db",
        "pg_dump",
        "-U",
        "db",
        "-Ft",
        "-f",
        "/tmp/postgres-dump.tar",
    ]);
    pg_dump.execute();

    let cp = cmd([
        "docker",
        "cp",
        "ddev-valgistesshots-db:/tmp/postgres-dump.tar",
        "./postgres-dump.tar",
    ]);
    cp.execute();
}

fn publish() {
    let registry = "registry.s2.goodserver.ch/valgistesshots";

    publish_craft(registry);
    publish_svelte(registry);
}

fn publish_craft(registry) {
    // The Craft image runs as UID 3000.
    let build = cmd([
        "docker",
        "buildx",
        "build",
        "--platform",
        "linux/amd64",
        "--push",
        "-t",
        registry + "/craft",
        ".",
    ]);
    build.dir("craft");
    build.execute();
}

fn publish_svelte(registry) {
    // The Svelte image runs as UID 1000.
    let build = cmd([
        "docker",
        "buildx",
        "build",
        "--platform",
        "linux/amd64",
        "--push",
        "-t",
        registry + "/svelte",
        ".",
    ]);
    build.dir("svelte");
    build.execute();
}
