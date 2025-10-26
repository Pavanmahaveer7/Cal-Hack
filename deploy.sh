#!/bin/bash

# Braillience Deployment Script
echo "🚀 Deploying Braillience..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the Braillience root directory"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ..

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
cd frontend
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app should be live at the URL provided above"
echo ""
echo "📝 Next steps:"
echo "1. Deploy backend to Railway or Render"
echo "2. Update REACT_APP_API_URL environment variable"
echo "3. Test all functionality"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for more options"
