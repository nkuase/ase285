#!/bin/bash

echo "================================"
echo "Building Electron Binary"
echo "================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Build React app
echo "⚛️  Building React app..."
npm run build
echo ""

# Create binary
echo "🔨 Creating Electron binary..."
npm run dist
echo ""

echo "================================"
echo "✅ Done!"
echo "================================"
echo ""
echo "Your binary is in the 'release/' folder:"
ls -lh release/ 2>/dev/null || echo "No release folder found. Check for errors above."
