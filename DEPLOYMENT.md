# PakFiller Deployment Guide for Vercel

This guide will help you deploy both the frontend (Next.js) and backend (Node.js) applications to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
3. **Git Repository**: Ensure your code is in a Git repository

## Frontend Deployment (Next.js)

### 1. Environment Variables Setup

In your Vercel dashboard, add the following environment variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
NEXT_PUBLIC_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_YT_API=your_youtube_api_key_here
NEXT_PUBLIC_PASSWORD_USER=your_password_here
```

### 2. Deploy Frontend

1. Navigate to the `be-filler` directory
2. Run the following commands:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Backend Deployment (Node.js)

### 1. Environment Variables Setup

In your Vercel dashboard for the backend project, add:

```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pakfiller
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 2. Deploy Backend

1. Navigate to the `backend` directory
2. Run the following commands:

```bash
# Install dependencies
npm install

# Deploy to Vercel
vercel --prod
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string
5. Add it to your backend environment variables

### Local MongoDB (Development)

```bash
# Install MongoDB locally
# Update MONGO_URI in env.example
MONGO_URI=mongodb://localhost:27017/pakfiller
```

## File Upload Configuration

The application handles file uploads. For production:

1. **Vercel Functions**: Limited to 50MB per function
2. **External Storage**: Consider using AWS S3 or similar for large files
3. **Upload Limits**: Configure in your backend environment

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **CORS**: Configure properly for your domains
3. **Environment Variables**: Never commit sensitive data
4. **HTTPS**: Vercel provides this automatically

## Monitoring and Logs

1. **Vercel Dashboard**: Monitor deployments and logs
2. **Function Logs**: Check serverless function logs
3. **Database Monitoring**: Monitor MongoDB performance

## Troubleshooting

### Common Issues

1. **Build Failures**: Check TypeScript errors and dependencies
2. **CORS Errors**: Verify CORS_ORIGIN configuration
3. **Database Connection**: Ensure MONGO_URI is correct
4. **File Upload Issues**: Check file size limits

### Debug Commands

```bash
# Check build locally
npm run build

# Test API locally
npm run dev

# Check environment variables
echo $NEXT_PUBLIC_API_URL
```

## Performance Optimization

1. **Image Optimization**: Configure Next.js image domains
2. **Bundle Analysis**: Use `@next/bundle-analyzer`
3. **Caching**: Implement proper caching strategies
4. **CDN**: Vercel provides global CDN

## Support

For issues related to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **MongoDB**: Check [MongoDB Documentation](https://docs.mongodb.com)
