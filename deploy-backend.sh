#!/bin/bash

# Backend Deployment Script for Vercel
echo "🚀 Starting Backend Deployment..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Backend deployment completed!"
