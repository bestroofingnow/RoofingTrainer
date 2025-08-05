# Overview

This is a cold calling training platform specifically designed for Best Roofing Now's appointment setters and canvassers. The application provides a comprehensive 5-day boot camp program with interactive modules, quizzes, script libraries, practice call simulations, and performance tracking. The platform combines educational content about roofing, insurance claims, and cold calling psychology with practical tools for skill development and assessment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with role-based navigation
- **State Management**: TanStack Query for server state management with optimistic updates
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation schemas

## Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with type-safe schema definitions
- **Authentication**: Replit Auth with OpenID Connect integration
- **Session Management**: Express sessions with PostgreSQL storage
- **File Uploads**: Integration with Google Cloud Storage and Uppy file uploader

## Database Design
- **Primary Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Key Entities**: Users, training modules, quizzes, user progress, practice recordings, and performance metrics
- **Session Storage**: Dedicated sessions table for authentication persistence

## Authentication & Authorization
- **Provider**: Replit Auth with OAuth2/OpenID Connect flow
- **Session Strategy**: Server-side sessions stored in PostgreSQL
- **Role-Based Access**: User roles (trainee, instructor, admin) with different permission levels
- **Security**: HTTPS-only cookies, CSRF protection, and secure session management

## Training Module System
- **Content Types**: Video lessons, interactive labs, quizzes, and practice simulations
- **Progress Tracking**: Module completion status, quiz scores, and time spent
- **Assessment**: Automated scoring with passing thresholds and certification tracking
- **Gamification**: Performance badges, leaderboards, and progress indicators

## Practice Call Features
- **Recording System**: Browser-based audio recording with MediaRecorder API
- **Scenario Generation**: Dynamic prospect information and storm data for realistic practice
- **Framework Tracking**: Six-step cold calling framework with completion checkboxes
- **Performance Analytics**: Call analysis, scoring, and improvement recommendations

# External Dependencies

- **Database**: Neon PostgreSQL serverless database for data persistence
- **Cloud Storage**: Google Cloud Storage for file uploads and audio recordings
- **Authentication**: Replit OAuth service for user authentication and authorization
- **UI Components**: Radix UI primitives for accessible component foundation
- **File Handling**: Uppy file uploader with AWS S3 and Google Cloud Storage adapters
- **Development Tools**: Vite development server with React plugin and TypeScript support
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach