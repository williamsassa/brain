#!/bin/bash
# BRAIN HEALTH Quick Start Script

echo "🏥 BRAIN HEALTH v2.1 - QUICK START"
echo "===================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Show options
echo "Choose an option:"
echo "1) Start development server"
echo "2) Build for production"
echo "3) Run production build locally"
echo "4) Run tests"
echo "5) View project documentation"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Starting development server..."
        npm run dev
        ;;
    2)
        echo "🏗️  Building for production..."
        npm run build
        ;;
    3)
        echo "🚀 Running production build..."
        npm run start
        ;;
    4)
        echo "🧪 Running tests..."
        npm run lint
        ;;
    5)
        echo "📚 Project Documentation:"
        echo "  • RAPPORT_EXECUTION.md - Executive summary"
        echo "  • AUDIT_COMPLET.md - Detailed audit"
        echo "  • DEVELOPER_GUIDE.md - Development guide"
        echo "  • README_INDEX.md - Quick reference"
        ;;
    *)
        echo "❌ Invalid choice"
        ;;
esac
