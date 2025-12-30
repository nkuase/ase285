#!/bin/bash

# Simple TypeScript Build Script

# Compile TypeScript to JavaScript
tsc src/app.ts --outDir . --target ES2018

# Show completion message
echo "Build complete! Open src/index.html in your browser."