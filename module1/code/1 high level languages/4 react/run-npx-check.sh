#!/usr/bin/env bash
# Checked build with npx: type-check with tsc, then bundle with esbuild.
# Both tools are run directly with npx (no package.json scripts).
set -e

npm install

# 1. Type check only (tsconfig.json sets noEmit, so no files are written)
npx tsc --noEmit

# 2. Bundle (set -e stops here if the type check failed)
npx esbuild src/App.tsx \
    --bundle \
    --outfile=app.js \
    --format=iife \
    --global-name=AppModule
