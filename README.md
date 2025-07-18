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
🔄 **Google Auth**: Basic implementation (needs Google API keys)  
⏳ **Backend API**: Planned Node.js/Express + PostgreSQL  
⏳ **Translation Service**: Google Translate API integration planned  
⏳ **Database**: PostgreSQL schema design needed  

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

### Planned Backend
- **Node.js/Express** - API server
- **PostgreSQL** - Primary database
- **Google OAuth 2.0** - Authentication
- **Google Translate API** - Translation service
- **AWS S3/Firebase Storage** - File storage for covers

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install dependencies**:
```bash
cd lingua-stagify
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open in browser**:
Visit `http://localhost:5173`

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
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
│   └── utils.js      # Utility functions
└── App.jsx          # Main app component with routing
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

1. **Backend API**: Node.js/Express server with PostgreSQL
2. **Google Auth Setup**: Configure OAuth credentials and complete integration
3. **Translation API**: Google Translate service integration
4. **Database Schema**: Design and implement data models
5. **File Upload**: Cover image upload functionality
6. **Real-time Features**: Live updates for likes/comments
7. **Testing**: Unit and integration tests
8. **Deployment**: Production deployment setup

## Contributing

This is a learning project demonstrating modern React patterns and full-stack architecture. The codebase follows:

- Component composition patterns
- Context for state management
- Tailwind for consistent styling
- Responsive mobile-first design
- RESTful API architecture planning

## License

MIT License - feel free to use this project for learning and development.
