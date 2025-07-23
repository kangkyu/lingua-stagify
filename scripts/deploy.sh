#!/bin/bash

echo "🚀 Deploying Lingua Stagify to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the project with Turbo
echo "📦 Building with Turbo..."
npm run build:all

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Don't forget to set these environment variables in Vercel:"
echo "   - VITE_GOOGLE_CLIENT_ID"
echo "   - VITE_API_URL (your Vercel domain)"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - CLIENT_URL (same as VITE_API_URL)"
echo ""
echo "🔗 Visit your Vercel dashboard to configure environment variables"
