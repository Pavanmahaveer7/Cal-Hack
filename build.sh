#!/bin/bash

# Build script for Railway deployment
echo "🚀 Building Braillience for production..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to backend public directory
echo "📁 Copying frontend build to backend..."
mkdir -p backend/public
cp -r frontend/build/* backend/public/

echo "✅ Build complete!"
echo "🎯 Frontend built and served from backend at /public"
