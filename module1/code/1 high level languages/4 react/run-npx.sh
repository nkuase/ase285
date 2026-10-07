#!/usr/bin/env bash
# Minimal build: run esbuild directly with npx.
# esbuild only removes the types. It does NOT type-check.
# For the checked build, use run.sh.
set -e

npm install

# npx finds esbuild in node_modules/.bin (it is not in your PATH)
npx esbuild src/App.tsx \
    --bundle \
    --outfile=app.js \
    --format=iife \
    --global-name=AppModule
