#!/usr/bin/env bash
# Build the React app and create the Electron binary (installer) in release/.
cd "$(dirname "$0")"

echo "================================"
echo "Building Electron Binary"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo ""
fi

# The dist script builds the React app first, then creates the binary
echo "Creating Electron binary..."
npm run dist
echo ""

echo "================================"
echo "Done!"
echo "================================"
echo ""
echo "Your binary is in the 'release/' folder:"
ls -lh release/ 2>/dev/null || echo "No release folder found. Check for errors above."
