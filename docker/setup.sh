#!/bin/sh
set -eu

# Run from the docker directory on the deployment host.
sudo mkdir -p craft/storage/logs craft/storage/backups craft/web/assets
sudo chown -R 3000:3000 craft
sudo chown 3000:1000 craft/.env
sudo chmod 640 craft/.env
