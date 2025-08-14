#!/bin/bash

# Frontend Deployment Script for Vercel
echo "🚀 Starting Frontend Deployment..."

# Navigate to frontend directory
cd be-filler

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment completed!"
