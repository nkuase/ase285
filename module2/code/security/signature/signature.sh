#!/usr/bin/env bash
# sign_file.sh — simple GPG signature generator

FILE="$1"
if [[ -z "$FILE" || ! -f "$FILE" ]]; then
  echo "Usage: $0 <file>"
  exit 1
fi

# 1️⃣ Check for private key
KEYID=$(gpg --list-secret-keys --with-colons | awk -F: '/^fpr/{print $10; exit}')
if [[ -z "$KEYID" ]]; then
  echo "❌ No private key found. Run: gpg --full-generate-key"
  exit 1
fi

# 2️⃣ Generate detached ASCII signature (.asc)
OUT="${FILE}.asc"
gpg --armor --local-user "$KEYID" --output "$OUT" --detach-sign "$FILE"

if [[ $? -eq 0 ]]; then
  echo "✅ Signature created: $OUT"
else
  echo "❌ Failed to create signature."
  exit 1
fi

# 3️⃣ Export your public key (if not already)
PUB="my_pubkey.asc"
if [[ ! -f "$PUB" ]]; then
  gpg --export -a "$KEYID" > "$PUB"
  echo "✅ Public key exported: $PUB"
else
  echo "ℹ️ Public key already exists: $PUB"
fi