#!/bin/bash

# Braillience Railway Deployment Script
echo "🚀 Deploying Braillience to Railway with Custom Domain..."

# Check if we're in the right directory
if [ ! -f "railway.json" ]; then
    echo "❌ Please run this script from the Braillience root directory"
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📥 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
if ! railway whoami &> /dev/null; then
    echo "Please log in to Railway:"
    railway login
fi

# Build frontend for production
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

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps for custom domain:"
echo "1. Go to Railway dashboard → Settings → Domains"
echo "2. Add your custom domain"
echo "3. Update DNS records at your domain provider"
echo "4. Add REACT_APP_API_URL environment variable in Railway"
echo "5. Wait for SSL certificate to be provisioned"
echo ""
echo "🔗 Your app will be available at:"
echo "   - Railway URL: https://your-app.railway.app"
echo "   - Custom domain: https://yourdomain.com (after DNS setup)"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
