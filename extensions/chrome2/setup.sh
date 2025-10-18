#!/bin/bash

echo "🚀 DatResume Chrome Extension Development Setup"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the chrome2 directory"
    exit 1
fi

# Check if Supabase is running
echo "📡 Checking Supabase connection..."
if curl -s http://127.0.0.1:54321/rest/v1/ > /dev/null 2>&1; then
    echo "✅ Supabase is running on port 54321"
else
    echo "⚠️  Warning: Supabase doesn't appear to be running on port 54321"
    echo "   Please start Supabase with 'supabase start' from the project root"
fi

# Build the extension
echo "🔨 Building Chrome extension..."
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Extension built successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' in the top right"
    echo "3. Click 'Load unpacked' and select: $(pwd)/dist"
    echo ""
    echo "🔧 Development Commands:"
    echo "  pnpm dev    - Watch for changes"
    echo "  pnpm build  - Build for production"
    echo ""
    echo "📁 Extension files are in: $(pwd)/dist"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi