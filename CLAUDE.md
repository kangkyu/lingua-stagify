# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start Vite development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture Overview

### Tech Stack
- **React 19** with Vite build tool
- **React Router** for client-side routing
- **Tailwind CSS** with custom UI components
- **Context API** for state management (AuthContext)
- **Google OAuth** authentication (framework in place, needs API keys)

### Code Organization

**Frontend-only React SPA** - This is a translation management platform frontend with no backend implementation yet.

**Component Architecture:**
- `src/components/ui/` - Reusable UI components using shadcn/ui patterns with Tailwind
- `src/components/Layout.jsx` - Main app layout with navigation
- `src/pages/` - Route components for different app sections
- `src/contexts/AuthContext.jsx` - Authentication state management with Google OAuth setup

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

**Current State:** Frontend-only implementation with mock data and authentication. The README indicates this is a learning project demonstrating React patterns with planned backend implementation.

**No Testing Setup:** No test commands or testing framework configured in package.json.

**Key Dependencies:**
- `lucide-react` for icons
- `class-variance-authority` for component variants
- `axios` for HTTP requests (backend integration ready)
- `google-auth-library` for OAuth (needs configuration)

**Styling:** Uses Tailwind CSS with custom component library following shadcn/ui patterns.