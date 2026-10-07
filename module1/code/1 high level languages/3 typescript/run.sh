#!/bin/bash

set -e

# Simple TypeScript Build Script

# Compile TypeScript to JavaScript
tsc --project src/tsconfig.json

# Show completion message
echo "Build complete! Open src/index.html in your browser."
