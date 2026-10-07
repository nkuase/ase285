#!/usr/bin/env bash
# Minimal build with the npm script: esbuild only, NO type check.
# The "build:nocheck" script in package.json runs esbuild directly.
# For the checked build, use run.sh.
set -e

npm install

# npm run adds node_modules/.bin to PATH, so npx is not needed in the scripts
npm run build:nocheck
