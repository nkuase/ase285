#!/usr/bin/env bash
# Checked build: type-check with tsc, then bundle with esbuild.
# The "build" script in package.json does both (check first, then esbuild).
# For the minimal build without a type check, use run-npx.sh.
set -e

npm install

# npm run adds node_modules/.bin to PATH, so npx is not needed in the scripts
npm run build
