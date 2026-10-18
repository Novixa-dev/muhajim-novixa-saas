#!/usr/bin/env bash
# ==============================================================================
# Installs one Muhajim release into mailcow's nginx.
#
# Usage: deploy.sh <release-id>   (run from the unpacked release bundle,
#                                  which holds site/ and deploy/)
#
# The server hosts other sites and the mail stack, so this script only ever
# writes <mailcow>/data/conf/nginx/muhajim.conf and the muhajim/ folder next to
# it. It never restarts a container: it validates with `nginx -t` inside
# mailcow's nginx and reloads gracefully, restoring the previous config and
# release if the test fails.
# ==============================================================================
set -euo pipefail

RELEASE_ID="${1:?release id required}"
BUNDLE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MAILCOW_DIR="${MAILCOW_DIR:-/opt/mailcow-dockerized}"
CONF_DIR="$MAILCOW_DIR/data/conf/nginx"
SITE_DIR="$CONF_DIR/muhajim"
CONF_FILE="$CONF_DIR/muhajim.conf"
DOMAIN="muhajim.novixa.dev"
WILDCARD_CERT_DIR="$CONF_DIR/novixa"
KEEP_RELEASES=5

log() { echo "[deploy] $*"; }
die() { echo "[deploy] ERROR: $*" >&2; exit 1; }

# --- Preflight: abort before touching anything ------------------------------
[ -d "$CONF_DIR" ] || die "mailcow nginx config dir not found: $CONF_DIR"
[ -f "$BUNDLE_DIR/site/index.html" ] || die "bundle has no site/index.html"

NGINX_CT="$(docker ps -q --filter label=com.docker.compose.service=nginx-mailcow | head -n1)"
[ -n "$NGINX_CT" ] || die "mailcow nginx container is not running"

docker exec "$NGINX_CT" nginx -t >/dev/null 2>&1 \
  || die "mailcow nginx config is already invalid; not deploying on top of it"

if others="$(grep -lF "$DOMAIN" "$CONF_DIR"/*.conf | grep -vxF "$CONF_FILE")"; then
  die "$DOMAIN is already declared in: $others"
fi

# --- Certificate -------------------------------------------------------------
mkdir -p "$SITE_DIR/releases"

if [ ! -f "$SITE_DIR/origin.pem" ] && [ -f "$WILDCARD_CERT_DIR/origin.pem" ] \
  && openssl x509 -in "$WILDCARD_CERT_DIR/origin.pem" -noout -ext subjectAltName 2>/dev/null | grep -qF "*.novixa.dev" \
  && openssl x509 -in "$WILDCARD_CERT_DIR/origin.pem" -noout -checkend 86400 >/dev/null; then
  log "reusing *.novixa.dev origin certificate"
  install -m 644 "$WILDCARD_CERT_DIR/origin.pem" "$SITE_DIR/origin.pem"
  install -m 600 "$WILDCARD_CERT_DIR/origin.key" "$SITE_DIR/origin.key"
fi

if [ -f "$SITE_DIR/origin.pem" ] && [ -f "$SITE_DIR/origin.key" ]; then
  MODE=https
else
  MODE=http
  log "WARNING: no origin certificate in $SITE_DIR; serving HTTP only"
fi

# --- Stage release ------------------------------------------------------------
DEST="$SITE_DIR/releases/$RELEASE_ID"
rm -rf "$DEST"
cp -R "$BUNDLE_DIR/site" "$DEST"
chmod -R a+rX "$DEST"

PREV_RELEASE="$(readlink "$SITE_DIR/current" 2>/dev/null || true)"
CONF_BACKUP=""
if [ -f "$CONF_FILE" ]; then
  CONF_BACKUP="$(mktemp)"
  cp -p "$CONF_FILE" "$CONF_BACKUP"
fi

rollback() {
  log "rolling back"
  if [ -n "$CONF_BACKUP" ]; then cp -p "$CONF_BACKUP" "$CONF_FILE"; else rm -f "$CONF_FILE"; fi
  if [ -n "$PREV_RELEASE" ]; then ln -sfn "$PREV_RELEASE" "$SITE_DIR/current"; else rm -f "$SITE_DIR/current"; fi
  rm -rf "$DEST"
}
trap rollback ERR

# --- Validate config, then activate ------------------------------------------
# The live release is only switched once the new config has passed nginx -t.
cp "$BUNDLE_DIR/deploy/nginx/muhajim.$MODE.conf" "$CONF_FILE"
if ! grep -qF "[::]" "$CONF_DIR"/listen_plain.active 2>/dev/null; then
  sed -i '/#ipv6$/d' "$CONF_FILE"
fi

if ! docker exec "$NGINX_CT" nginx -t; then
  trap - ERR
  rollback
  die "nginx -t failed with the new config; previous state restored, nothing reloaded"
fi

ln -sfn "releases/$RELEASE_ID" "$SITE_DIR/current.tmp"
mv -Tf "$SITE_DIR/current.tmp" "$SITE_DIR/current"
docker exec "$NGINX_CT" nginx -s reload
trap - ERR
rm -f "$CONF_BACKUP"
log "release $RELEASE_ID live ($MODE)"

# --- Prune old releases --------------------------------------------------------
cd "$SITE_DIR/releases"
{ ls -1t | grep -vxF "$RELEASE_ID" || true; } | tail -n +"$KEEP_RELEASES" | xargs -r rm -rf --
