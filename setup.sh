#!/bin/bash

# PakFiller Setup Script
echo "🚀 Setting up PakFiller for deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install Vercel CLI globally
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Install all dependencies
echo "📦 Installing project dependencies..."
npm run install:all

# Create environment files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f "be-filler/.env.local" ]; then
    cp be-filler/env.example be-filler/.env.local
    echo "✅ Created be-filler/.env.local (please update with your values)"
fi

if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env (please update with your values)"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in be-filler/.env.local"
echo "2. Update environment variables in backend/.env"
echo "3. Set up MongoDB database"
echo "4. Run 'npm run deploy' to deploy both applications"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
