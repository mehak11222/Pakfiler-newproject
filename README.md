# PakFiller - Tax Filing Application

A comprehensive tax filing application for Pakistan, built with Next.js frontend and Node.js backend.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pak-Filler
   ```

2. **Run the setup script**
   ```bash
   # On Windows
   setup.bat
   
   # On macOS/Linux
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**
   - Update `be-filler/.env.local` with your frontend configuration
   - Update `backend/.env` with your backend configuration

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
Pak-Filler/
├── be-filler/          # Next.js Frontend
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── services/      # API services
│   └── types/         # TypeScript types
├── backend/           # Node.js Backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── config/       # Configuration files
│   └── uploads/          # File uploads
└── docs/              # Documentation
```

## 🛠️ Development

### Frontend (Next.js)

```bash
cd be-filler
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Backend (Node.js)

```bash
cd backend
npm run dev          # Start development server
npm start            # Start production server
```

## 🚀 Deployment

### Quick Deployment

```bash
# Deploy both frontend and backend
npm run deploy

# Deploy individually
npm run deploy:frontend
npm run deploy:backend
```

### Manual Deployment

1. **Frontend Deployment**
   ```bash
   cd be-filler
   vercel --prod
   ```

2. **Backend Deployment**
   ```bash
   cd backend
   vercel --prod
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

#### Frontend (`be-filler/.env.local`)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.vercel.app
NEXT_PUBLIC_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_YT_API=your_youtube_api_key_here
NEXT_PUBLIC_PASSWORD_USER=your_password_here
```

#### Backend (`backend/.env`)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pakfiller
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## 📚 Features

### User Features
- **Tax Filing**: Complete tax return filing process
- **Income Management**: Multiple income source tracking
- **Deductions**: Tax deduction calculations
- **Asset Management**: Wealth statement management
- **Document Upload**: Secure document storage
- **Family Filing**: Family tax account management

### Admin Features
- **User Management**: Admin dashboard for user oversight
- **Document Review**: Document verification system
- **Tax Filing Oversight**: Admin tax filing management
- **Reports**: Comprehensive reporting system

### Technical Features
- **Real-time Updates**: Live data synchronization
- **File Upload**: Secure document handling
- **PDF Generation**: Automated document generation
- **Email Notifications**: User communication system
- **Multi-language Support**: English and Urdu support

## 🛡️ Security

- JWT-based authentication
- CORS protection
- Input validation
- File upload security
- Environment variable protection

## 📊 Database Schema

The application uses MongoDB with the following main collections:
- Users
- Tax Filings
- Income Details
- Assets
- Deductions
- Documents
- Payments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review the documentation in the `/docs` folder
- Create an issue in the repository

## 🔗 Links

- [Frontend Application](https://your-frontend-domain.vercel.app)
- [Backend API](https://your-backend-domain.vercel.app)
- [Documentation](./DEPLOYMENT.md)
