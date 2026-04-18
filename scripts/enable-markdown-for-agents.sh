#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: CLOUDFLARE_API_TOKEN=... $0 <zone_id>" >&2
  exit 1
fi

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "CLOUDFLARE_API_TOKEN is required" >&2
  exit 1
fi

ZONE_ID="$1"

curl --fail-with-body --silent --show-error \
  --request PATCH \
  --url "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/settings/content_converter" \
  --header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{"value":"on"}'

