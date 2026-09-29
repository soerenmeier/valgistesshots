#!/bin/sh
set -eu

php craft up --interactive=0

exec /usr/bin/supervisord -c /etc/supervisord.conf
