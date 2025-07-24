# Stagify - Translation Management Platform

A modern translation management platform built with React and Google Auth, designed to help users create, share, and discover translations in a collaborative environment.

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
- **React 18** - UI framework
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
VITE_GOOGLE_CLIENT_ID=your_google_client_id
DATABASE_URL=your_postgresql_connection_string
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

## Key Features Implementation

### Authentication System
- Context-based auth state management
- Google OAuth integration framework
- Protected routes and conditional UI
- User session persistence

### Translation Management
- Book-based organization system
- Multi-language translation pairs
- Context and metadata support
- Tag-based categorization

### Social Features
- Like and comment system framework
- Bookmark functionality
- User profiles with statistics
- Public/private content visibility

### Discovery & Search
- Feed with sorting options (recent, popular, most discussed)
- Search across translations, books, and context
- Filtering and categorization

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
- RESTful API architecture planning

## License

MIT License - feel free to use this project for learning and development.
