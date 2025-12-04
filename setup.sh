#!/bin/bash

echo "🎄 Grand Luxury Christmas Tree - Setup Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected"
    echo "   Please upgrade to Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo "   This may take a few minutes..."
echo ""
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Add your photos to public/photos/ (see PHOTO-GUIDE.md)"
    echo "   2. Run: npm run dev"
    echo "   3. Open: http://localhost:3000"
    echo ""
    echo "🚀 To deploy to web:"
    echo "   See DEPLOYMENT.md for detailed instructions"
    echo ""
    echo "📚 Need help?"
    echo "   Read README.md for full documentation"
    echo ""
    
    # Ask if user wants to start dev server
    read -p "🎄 Start development server now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Starting development server..."
        echo "   Press Ctrl+C to stop"
        echo ""
        npm run dev
    fi
else
    echo ""
    echo "❌ Installation failed!"
    echo "   Try: rm -rf node_modules && npm install"
    exit 1
fi
