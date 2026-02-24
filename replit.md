# InsectaID

## Overview

InsectaID is a mobile-first AI-powered insect identification app built with Expo (React Native) and an Express.js backend. Users can take photos or upload images of insects to identify them, browse an insect encyclopedia organized by taxonomic orders, and view their identification history. The app supports multiple languages (English and Turkish) and features a nature-themed UI with animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: `expo-router` with file-based routing. The app uses a tab-based layout (`app/(tabs)/`) with four main screens: Home (index), Encyclopedia (insect orders), Library (detailed insect encyclopedia with accordion cards), and History. Additional screens for results and insect detail are presented as modals/stack screens.
- **State Management**: `@tanstack/react-query` for server state, React's built-in `useState`/`useEffect` for local state
- **Local Storage**: `@react-native-async-storage/async-storage` for persisting identification history and language preferences on-device
- **Animations**: `react-native-reanimated` for spring animations and enter/exit transitions throughout the UI
- **Styling**: React Native `StyleSheet` with a centralized color theme in `constants/colors.ts` using a nature-inspired palette (forest greens, golds, warm browns)
- **Fonts**: Google Fonts via `@expo-google-fonts` — Playfair Display (headings) and Inter (body text)
- **Internationalization**: Custom lightweight i18n system in `lib/i18n/` with JSON translation files, a React Context provider, and helper functions for string interpolation. Supports English and Turkish.
- **Camera/Image**: `expo-camera` for taking photos, `expo-image-picker` for gallery uploads, `expo-image` for optimized image display

### Backend (Express.js)

- **Framework**: Express 5 running as a Node.js server in `server/`
- **Purpose**: Serves as the API backend. Currently minimal with placeholder route registration in `server/routes.ts`. The server also handles CORS for Replit domains and localhost development.
- **Storage Layer**: Abstracted via `IStorage` interface in `server/storage.ts`. Currently uses in-memory storage (`MemStorage`) with a Map-based implementation. Designed to be swapped for database-backed storage.
- **Static Serving**: In production, serves the Expo web build from `dist/` directory. Includes a landing page template for when web builds aren't available.
- **Build Process**: Custom build script (`scripts/build.js`) handles Expo static web builds. Server is bundled with esbuild for production.

### Database Schema (Drizzle ORM + PostgreSQL)

- **ORM**: Drizzle ORM with PostgreSQL dialect, configured via `drizzle.config.ts`
- **Schema**: Defined in `shared/schema.ts` — currently has a `users` table with `id` (UUID, auto-generated), `username` (unique text), and `password` (text)
- **Validation**: Uses `drizzle-zod` to generate Zod schemas from Drizzle table definitions
- **Migrations**: Output to `./migrations` directory, managed via `drizzle-kit push`
- **Note**: The database schema exists but the app currently uses in-memory storage. The PostgreSQL database connection requires `DATABASE_URL` environment variable.

### Shared Code

- `shared/schema.ts` contains database schemas and types shared between frontend and backend
- Path aliases configured: `@/*` maps to project root, `@shared/*` maps to `./shared/*`

### Key Design Decisions

1. **File-based routing with expo-router**: Chosen for its simplicity and Next.js-like developer experience. Screen organization mirrors URL structure.
2. **Local-first history storage**: Identification history is stored on-device via AsyncStorage rather than server-side, keeping the app functional offline. Limited to 50 entries.
3. **Custom i18n over libraries**: A lightweight custom internationalization solution was chosen over heavy libraries like i18next, using simple JSON files and dot-notation path lookups with variable interpolation.
4. **In-memory server storage with interface abstraction**: The `IStorage` interface allows easy migration from `MemStorage` to a proper database implementation without changing consuming code.
5. **Monorepo structure**: Frontend (Expo) and backend (Express) live in the same repository, sharing types and schemas through the `shared/` directory.

## External Dependencies

- **PostgreSQL**: Database (requires `DATABASE_URL` environment variable). Used with Drizzle ORM for schema management and queries.
- **Expo Services**: Expo SDK for camera access, image picking, haptic feedback, location services, and web browser integration
- **Google Fonts**: Inter and Playfair Display font families loaded via `@expo-google-fonts`
- **AsyncStorage**: On-device key-value storage for history and language preferences
- **TanStack React Query**: Server state management and API request caching
- **Replit Environment**: The app is configured for Replit deployment, using `REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, and `REPLIT_INTERNAL_APP_DOMAIN` environment variables for CORS and build configuration