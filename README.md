# Stagify - Translation Management Platform

A modern translation management platform built with React and Google Auth, designed to help users create, share, and discover translations in a collaborative environment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Database](#database)
- [Authentication Setup](#authentication-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Features

### Core Functionality
- **Translation Management**: Create and organize translations in themed books
- **Multi-language Support**: Support for 12+ languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, and Hindi
- **Book Collections**: Organize translations into books with metadata, covers, and descriptions
- **Social Features**: Like, comment, and bookmark translations
- **Discovery Feed**: Browse and search public translations with filtering options
- **User Profiles**: Track translation activity and statistics

### Authentication
- **Google OAuth**: Secure authentication using Google accounts
- **User Management**: Profile management and session handling

### Current Implementation Status
✅ **Frontend Structure**: Complete React app with routing and UI components  
✅ **Authentication Framework**: Google Auth context and UI integration  
✅ **Backend API**: Vercel serverless functions with Prisma ORM
✅ **Database Schema**: PostgreSQL with Prisma (BigInt IDs, Users, Books, Translations, Bookmarks)
🔄 **Google Auth**: Basic implementation (needs Google API keys)  
⏳ **Translation Service**: Google Translate API integration planned

## Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

### Backend
- **Vercel Serverless Functions** - API endpoints
- **PostgreSQL** - Primary database (Supabase)
- **Prisma ORM** - Database toolkit and type safety
- **Google OAuth 2.0** - Authentication
- **Google Translate API** - Translation service (planned)
- **Node.js 20** - Runtime environment

## Getting Started

### Prerequisites
- Node.js 20+
- npm (turbo for monorepo management)
- PostgreSQL database (Supabase recommended)

### Installation

1. **Clone and install dependencies**:
```bash
cd lingua-stagify
npm install
```

2. **Database setup**:
```bash
# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

3. **Environment setup**:
Create `.env.local`:
```env
# Frontend configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Database configuration
DATABASE_URL=your_postgresql_connection_string

# Note: API URL is automatically set to window.location.origin
# No need to set VITE_API_URL unless using external API
```

4. **Start development servers**:
```bash
# Frontend + API
npm run dev:all

# Or separately:
npm run dev:frontend  # http://localhost:5173
npm run dev:api       # http://localhost:3001
```

### Development Commands
- `npm run dev` - Start frontend development server
- `npm run dev:all` - Start both frontend and API servers
- `npm run dev:api` - Start API server only
- `npm run build` - Build for production
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
frontend/src/
├── components/
│   ├── ui/           # Reusable UI components (Button, Card, Input, etc.)
│   └── Layout.jsx    # Main app layout with navigation
├── contexts/
│   └── AuthContext.jsx  # Authentication state management
├── pages/            # Route components
│   ├── Feed.jsx      # Translation discovery feed
│   ├── Books.jsx     # Book gallery
│   ├── BookDetail.jsx    # Individual book view
│   ├── Share.jsx     # Translation creation
│   ├── CreateBook.jsx    # Book creation
│   ├── Profile.jsx   # User profile
│   └── Bookmarks.jsx # Saved translations
├── lib/
│   ├── api.js        # API client functions
│   ├── auth.js       # Authentication utilities
│   ├── config.js     # Application configuration
│   └── utils.js      # Utility functions
└── App.jsx          # Main app component with routing

api/
├── auth/            # Authentication endpoints
├── books/           # Book CRUD endpoints
├── translations/    # Translation CRUD endpoints
├── lib/
│   └── prisma.js    # Prisma client setup
└── prisma/
    ├── schema.prisma # Database schema
    └── seed.js      # Database seeding script
```

## Development

### Local Development URLs
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001/api/*
- **Health Check**: http://localhost:3001/api/health

### Troubleshooting Development Issues

#### If `npm run dev:all` fails:
Run the services separately:
```bash
# Terminal 1
npm run dev:frontend

# Terminal 2  
npm run dev:api
```

#### If API dev fails:
The API uses Vercel serverless functions. For local development:
1. Make sure you have database connection configured
2. Run `npm run db:push` to setup database schema
3. Use `vercel dev api --listen 3001` for local API testing
4. For full OAuth testing, deploy to Vercel and test there

## Database

### Schema Overview
The database uses PostgreSQL with Prisma ORM and includes:

- **Users**: BigInt ID, email, name, avatar, timestamps
- **Books**: BigInt ID, title, author, cover, description, language
- **Translations**: BigInt ID, original/translated text, languages, context, metadata
- **Bookmarks**: BigInt ID, user/translation/book relationships

### Database Commands
```bash
# Push schema changes
npm run db:push

# Generate Prisma client
npm run db:generate

# Open database browser
npm run db:studio

# Seed with sample data
npm run db:seed
```

## Authentication Setup

### Google OAuth Configuration

#### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google OAuth2 API"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for development)
     - Add your production domain when deploying

#### Step 2: Configure Environment Variables

**Frontend (.env.local):**
```env
VITE_GOOGLE_CLIENT_ID="your_actual_google_client_id_here"
```

**Backend (.env.local):**
```env
GOOGLE_CLIENT_ID="your_actual_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_actual_google_client_secret_here"
DATABASE_URL="your_postgresql_connection_string"
```

⚠️ **Important**: Never commit your actual Google credentials to version control.

#### Step 3: Testing Authentication
- Click "Sign In with Google"
- Should redirect to Google, then back to your app with user logged in

### Authentication Flow

1. User clicks "Sign In with Google"
2. Frontend generates Google OAuth URL directly
3. User is redirected to Google's OAuth consent screen
4. After consent, Google redirects back to `/auth/callback` with an authorization code
5. Frontend exchanges the code directly with Google for user info
6. User data is stored in localStorage for session management

## Deployment

### Quick Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   npx vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
   - `GOOGLE_CLIENT_ID` - Same as above (for backend)
   - `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret
   - `DATABASE_URL` - Your PostgreSQL connection string

### Architecture
- **Frontend**: React + Vite built as static files with SPA routing
- **Backend**: Pure serverless functions in `api/` directory
- **Database**: PostgreSQL with Prisma ORM
- **Monorepo**: Single deployment for frontend + backend

### Production API Endpoints
- `GET /api/health` - Health check
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `GET /api/translations` - Get all translations
- `GET /api/translations/book/:bookId` - Get translations by book
- `GET /api/auth/google-url` - Get Google OAuth URL
- `POST /api/auth/validate-token` - Validate Google ID token

## API Documentation

### Books API
```bash
# Get all books
GET /api/books

# Get specific book with translations
GET /api/books/:id
```

### Translations API
```bash
# Get all translations
GET /api/translations

# Get translations for specific book
GET /api/translations/book/:bookId
```

### Authentication API
```bash
# Get Google OAuth URL
GET /api/auth/google-url

# Validate Google ID token
POST /api/auth/validate-token
Content-Type: application/json
{
  "idToken": "google_id_token"
}
```

## Troubleshooting

### Common Issues

#### "Google OAuth not configured" error
- Make sure `VITE_GOOGLE_CLIENT_ID` is set in environment variables
- Restart the development server after changing environment variables
- Check that environment variables start with `VITE_` prefix for frontend

#### Redirect URI mismatch
- Ensure the redirect URI in your Google Console matches exactly:
  - Development: `http://localhost:5173/auth/callback`
  - Production: `https://your-domain.com/auth/callback`

#### Database connection issues
- Verify `DATABASE_URL` is correctly formatted
- Ensure database is accessible from your environment
- Run `npm run db:push` to sync schema

#### API endpoints returning 404
- Ensure API functions are deployed correctly
- Check Vercel deployment logs
- Verify serverless function configuration

#### Build Issues
- Ensure all workspaces have `build` scripts
- Check `turbo.json` task dependencies
- Verify `package.json` workspaces configuration

#### CORS Issues
- Verify domain configuration in Google OAuth settings
- Check API function CORS headers in `api/` directory

## Next Steps

To complete the application, implement:

1. **Google Auth Setup**: Configure OAuth credentials and complete integration
2. **Translation API**: Google Translate service integration
3. **File Upload**: Cover image upload functionality (AWS S3/Vercel Blob)
4. **Social Features**: Likes, comments, and user interactions
5. **Real-time Features**: Live updates for likes/comments
6. **Testing**: Unit and integration tests
7. **Performance**: Caching and optimization
8. **Monitoring**: Error tracking and analytics

## Contributing

This is a learning project demonstrating modern React patterns and full-stack architecture. The codebase follows:

- Component composition patterns
- Context for state management
- Tailwind for consistent styling
- Responsive mobile-first design
- RESTful API architecture
- Type-safe database operations with Prisma

## License

MIT License - feel free to use this project for learning and development.
