#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <url>" >&2
  exit 1
fi

URL="$1"
HEADERS="$(mktemp)"
BODY="$(mktemp)"
trap 'rm -f "$HEADERS" "$BODY"' EXIT

curl --silent --show-error \
  --dump-header "$HEADERS" \
  --output "$BODY" \
  --header "Accept: text/markdown" \
  "$URL"

CONTENT_TYPE="$(awk 'BEGIN{IGNORECASE=1} /^content-type:/ {sub(/\r$/, "", $0); print $0}' "$HEADERS" | tail -n 1)"
TOKENS="$(awk 'BEGIN{IGNORECASE=1} /^x-markdown-tokens:/ {sub(/\r$/, "", $0); print $0}' "$HEADERS" | tail -n 1)"
VARY="$(awk 'BEGIN{IGNORECASE=1} /^vary:/ {sub(/\r$/, "", $0); print $0}' "$HEADERS" | tail -n 1)"

echo "$CONTENT_TYPE"
if [[ -n "$TOKENS" ]]; then
  echo "$TOKENS"
fi
if [[ -n "$VARY" ]]; then
  echo "$VARY"
fi
echo
head -n 20 "$BODY"

if [[ "${CONTENT_TYPE,,}" != content-type:\ text/markdown* ]]; then
  echo
  echo "Expected Content-Type: text/markdown" >&2
  exit 1
fi

