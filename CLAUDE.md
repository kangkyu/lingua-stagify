# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start frontend development server (http://localhost:5173)
- `npm run dev:all` - Start both frontend and API servers
- `npm run dev:api` - Start API server (http://localhost:3001)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data

## Architecture Overview

### Tech Stack
- **React 19** with Vite build tool
- **React Router** for client-side routing
- **Tailwind CSS** with custom UI components
- **Context API** for state management (AuthContext)
- **Vercel Serverless Functions** for API backend
- **Prisma ORM** with PostgreSQL database
- **Node.js 20** runtime environment
- **Google OAuth** authentication (framework in place, needs API keys)

### Code Organization

**Full-stack React application** - Translation management platform with React frontend and Vercel serverless API backend.

**Component Architecture:**
- `src/components/ui/` - Reusable UI components using shadcn/ui patterns with Tailwind
- `src/components/Layout.jsx` - Main app layout with navigation
- `src/pages/` - Route components for different app sections
- `src/contexts/AuthContext.jsx` - Authentication state management with Google OAuth setup
- `src/lib/` - API clients, authentication, configuration, and utilities
- `api/` - Vercel serverless functions for backend API
- `api/prisma/` - Database schema and seeding

**Key Patterns:**
- Path alias `@/` maps to `src/` directory (configured in vite.config.js)
- UI components use compound variant patterns with `cn()` utility (clsx + tailwind-merge)
- Context-based auth state with localStorage persistence
- React Router v7 for navigation

### Application Structure

**Main Routes:**
- `/` and `/feed` - Translation discovery feed
- `/books` - Book gallery, `/books/:id` - Individual book view  
- `/share` - Translation creation
- `/create-book` - Book creation
- `/profile` - User profile
- `/bookmarks` - Saved translations

**Authentication:**
- Google OAuth integration framework is set up but needs actual Google API credentials
- Mock authentication currently implemented for development
- User state managed via AuthContext with localStorage persistence

### Development Notes

**Current State:** Full-stack implementation with React frontend and Vercel serverless backend. Database schema implemented with Prisma ORM. API endpoints available for books, translations, and authentication.

**No Testing Setup:** No test commands or testing framework configured in package.json.

**Key Dependencies:**
- `lucide-react` for icons
- `class-variance-authority` for component variants
- `@prisma/client` for database operations
- `google-auth-library` for OAuth (needs configuration)
- Native `fetch` for API requests (no axios dependency)

**Styling:** Uses Tailwind CSS with custom component library following shadcn/ui patterns.
