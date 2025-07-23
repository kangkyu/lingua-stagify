#!/bin/bash

echo "🏗️  Building for Vercel deployment..."

# Build the frontend
echo "📦 Building frontend..."
npm run frontend:build

# Copy API serverless functions to the right location
echo "🔧 Preparing API functions..."
mkdir -p api
cp -r api/auth api/
cp api/health.js api/

# Ensure api functions have proper dependencies
echo "📋 Checking API dependencies..."
if [ ! -f "api/package.json" ]; then
    echo "⚠️  API package.json not found in deployment structure"
fi

echo "✅ Build complete for Vercel!"
