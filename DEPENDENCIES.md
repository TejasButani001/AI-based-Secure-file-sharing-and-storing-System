# Complete Dependencies & Requirements Guide

## System Requirements

- **Node.js**: >= 18.x LTS (recommended: 20.x or 22.x)
- **npm**: >= 9.x
- **Git**: Latest version
- **PostgreSQL**: >= 13.x (Database server)
- **Supabase Account**: Required for backend authentication & database

---

## Project Overview

This is a full-stack TypeScript/React application with the following structure:

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + PostgreSQL + Supabase
- **Package Manager**: npm (monorepo structure with root & server folders)

---

## Frontend Dependencies (Root package.json)

### React & Core Libraries

```
react: ^18.3.1
react-dom: ^18.3.1
react-router-dom: ^6.30.1
```

### UI Framework & Components (shadcn/ui with Radix UI)

```
@radix-ui/react-accordion: ^1.2.11
@radix-ui/react-alert-dialog: ^1.1.14
@radix-ui/react-aspect-ratio: ^1.1.7
@radix-ui/react-avatar: ^1.1.10
@radix-ui/react-checkbox: ^1.3.2
@radix-ui/react-collapsible: ^1.1.11
@radix-ui/react-context-menu: ^2.2.15
@radix-ui/react-dialog: ^1.1.14
@radix-ui/react-dropdown-menu: ^2.1.15
@radix-ui/react-hover-card: ^1.1.14
@radix-ui/react-label: ^2.1.7
@radix-ui/react-menubar: ^1.1.15
@radix-ui/react-navigation-menu: ^1.2.13
@radix-ui/react-popover: ^1.1.14
@radix-ui/react-progress: ^1.1.7
@radix-ui/react-radio-group: ^1.3.7
@radix-ui/react-scroll-area: ^1.2.9
@radix-ui/react-select: ^2.2.5
@radix-ui/react-separator: ^1.1.7
@radix-ui/react-slider: ^1.3.5
@radix-ui/react-slot: ^1.2.3
@radix-ui/react-switch: ^1.2.5
@radix-ui/react-tabs: ^1.1.12
@radix-ui/react-toast: ^1.2.14
@radix-ui/react-toggle: ^1.1.9
@radix-ui/react-toggle-group: ^1.1.10
@radix-ui/react-tooltip: ^1.2.7
```

### Form Handling & Validation

```
react-hook-form: ^7.61.1
@hookform/resolvers: ^3.10.0
zod: ^3.25.76
```

### UI Utilities

```
class-variance-authority: ^0.7.1
clsx: ^2.1.1
tailwind-merge: ^2.6.0
cmdk: ^1.1.1
```

### Data Visualization & Charts

```
recharts: ^2.15.4
```

### Date Handling

```
date-fns: ^3.6.0
react-day-picker: ^8.10.1
```

### Animations & Motion

```
framer-motion: ^12.33.0
embla-carousel-react: ^8.6.0
```

### Styling & Themes

```
tailwindcss-animate: ^1.0.7
next-themes: ^0.3.0
```

### UI Components

```
lucide-react: ^0.462.0
sonner: ^1.7.4
input-otp: ^1.4.2
react-resizable-panels: ^2.1.9
vaul: ^0.9.9
```

### API & Data Fetching

```
@tanstack/react-query: ^5.83.0
```

### Authentication

```
@react-oauth/google: ^0.13.4
```

### Frontend DevDependencies

```
vite: ^5.4.19
@vitejs/plugin-react-swc: ^3.11.0
typescript: ^5.8.3
@types/react: ^18.3.23
@types/react-dom: ^18.3.7
@types/node: ^22.16.5

eslint: ^9.32.0
@eslint/js: ^9.32.0
eslint-plugin-react-hooks: ^5.2.0
eslint-plugin-react-refresh: ^0.4.20
typescript-eslint: ^8.38.0

tailwindcss: ^3.4.17
autoprefixer: ^10.4.21
postcss: ^8.5.6
@tailwindcss/typography: ^0.5.16

vitest: ^3.2.4
@testing-library/react: ^16.0.0
@testing-library/jest-dom: ^6.6.0
jsdom: ^20.0.3

concurrently: ^9.2.1
globals: ^15.15.0
lovable-tagger: ^1.1.13
```

---

## Backend Dependencies (server/package.json)

### Core Framework

```
express: ^4.21.2
typescript: ^5.7.3
```

### Database & ORM

```
@supabase/supabase-js: ^2.95.3
pg: ^8.20.0
```

### Authentication & Security

```
jsonwebtoken: ^9.0.2
bcryptjs: ^2.4.3
google-auth-library: ^10.6.2
```

### File Handling

```
multer: ^2.0.2
@types/multer: ^2.0.0
```

### Email Service

```
nodemailer: ^8.0.3
@types/nodemailer: ^7.0.11
```

### Middleware

```
cors: ^2.8.5
@types/cors: ^2.8.17
```

### Environment Configuration

```
dotenv: ^16.4.7
```

### Backend DevDependencies

```
typescript: ^5.7.3
ts-node: ^10.9.2
nodemon: ^3.1.9

@types/node: ^22.13.0
@types/express: ^5.0.0
@types/jsonwebtoken: ^9.0.8
@types/bcryptjs: ^2.4.6
```

---

## Installation Instructions for Your Teammate

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd AI-based-Secure-file-sharing-and-storing-System
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This installs all dependencies from the root `package.json`

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 4: Setup Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Create a `.env` file in the `server` directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_SECRET=your_google_client_secret
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_password
PORT=3000
```

### Step 5: Setup Database

```bash
cd server
npm run setup
cd ..
```

### Step 6: Run the Application

#### Option A: Run both frontend and backend concurrently

```bash
npm start
```

or

```bash
npm run dev
```

#### Option B: Run individually

Frontend only:

```bash
npm run start:client
```

Backend only:

```bash
cd server
npm run dev
```

---

## Available NPM Scripts

### Root Directory

```
npm start              # Concurrent frontend + backend
npm run start:client   # Frontend only (Vite dev server)
npm run start:server   # Backend only (Express)
npm run dev            # Alias for npm start
npm run build          # Build frontend for production
npm run build:dev      # Build frontend in development mode
npm run lint           # Run ESLint
npm run preview        # Preview production build
npm run test           # Run tests once
npm run test:watch     # Run tests in watch mode
```

### Server Directory

```
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run build          # Compile TypeScript to JavaScript
npm run setup          # Setup and seed database
```

---

## Technology Stack Summary

| Category            | Technology                 |
| ------------------- | -------------------------- |
| Frontend Framework  | React 18                   |
| Frontend Build Tool | Vite 5                     |
| Language            | TypeScript 5.8             |
| CSS                 | Tailwind CSS 3.4           |
| UI Library          | shadcn/ui + Radix UI       |
| Forms               | React Hook Form + Zod      |
| Backend             | Express.js                 |
| Database            | PostgreSQL + Supabase      |
| Authentication      | JWT + Google OAuth         |
| File Upload         | Multer                     |
| Email               | Nodemailer                 |
| State Management    | TanStack React Query       |
| Testing             | Vitest + Testing Library   |
| Linting             | ESLint + TypeScript ESLint |

---

## Ports & Services

| Service           | Port | URL                   |
| ----------------- | ---- | --------------------- |
| Frontend (Vite)   | 5173 | http://localhost:5173 |
| Backend (Express) | 3000 | http://localhost:3000 |
| PostgreSQL        | 5432 | localhost:5432        |

---

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 or 5173 already in use

**Solution**: Change port in respective config files or kill the process using the port

### Issue: Database connection fails

**Solution**: Verify PostgreSQL is running and `.env` has correct DATABASE_URL

### Issue: Module not found errors

**Solution**: Ensure all dependencies are installed in both root and server directories

---

## Quick Start Checklist for New Team Members

- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] Clone repository
- [ ] Run `npm install` (root)
- [ ] Run `npm install` (server directory)
- [ ] Create `.env` files with required variables
- [ ] Run `npm run setup` to initialize database
- [ ] Run `npm start` to start development
- [ ] Access application at http://localhost:5173

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Express.js Documentation](https://expressjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

**Last Updated**: March 2026
**Version**: 1.0.0
