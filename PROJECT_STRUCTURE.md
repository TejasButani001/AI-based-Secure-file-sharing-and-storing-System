# Project Structure

This document outlines the folder structure of the **AI-based Secure File Sharing and Storing System** project.

## Folder Structure Diagram

```
AI-based-Secure-file-sharing-and-storing-System/
├── server/                 # Backend (Node.js/Express)
│   ├── src/                # Backend Source Code
│   │   ├── index.ts        # Main Server Entry Point
│   │   ├── supabaseClient.ts # Database Configuration
│   │   └── seedAdmins.ts   # Admin Seeding Script
│   ├── uploads/            # Local File Storage
│   ├── .env                # Environment Variables
│   ├── package.json        # Backend Dependencies
│   └── schema.sql          # Database Schema
├── src/                    # Frontend (React/Vite)
│   ├── components/         # Reusable UI Components
│   ├── context/            # React Context (Auth)
│   ├── pages/              # Application Pages
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── Profile.tsx
│   ├── App.tsx             # Main App Component
│   ├── main.tsx            # React Entry Point
│   └── index.css           # Global Styles
├── public/                 # Static Assets
├── package.json            # Frontend Dependencies
└── vite.config.ts          # Vite Configuration
```

## Root Directory
The root directory functions as a monorepo containing both the frontend and backend code.

| File / Folder | Description |
| :--- | :--- |
| `server/` | Contains the backend Node.js/Express application. |
| `src/` | Contains the frontend React application source code. |
| `public/` | Static assets (images, icons) served directly. |
| `vite.config.ts` | Configuration for Vite (frontend build tool and dev server proxy). |
| `package.json` | Project metadata, scripts, and frontend dependencies. |
| `README.md` | Project documentation. |

---

## Backend (`/server`)
The backend handles API requests, database interactions (Supabase), and file management.

| File / Folder | Description |
| :--- | :--- |
| `src/` | Backend source code. |
| `src/index.ts` | **Main Entry Point**. Sets up the Express server and API routes. |
| `src/supabaseClient.ts` | Configuration for connecting to the Supabase database. |
| `src/seedAdmins.ts` | Script to seed default admin users into the database. |
| `schema.sql` | SQL script defining the database tables and schema. |
| `.env` | Environment variables (Database credentials, JWT secret, Port). |
| `uploads/` | Directory where uploaded files are stored locally (if not using cloud storage). |

---

## Frontend (`/src`)
The frontend is built with React, TypeScript, and Vite, using Tailwind CSS and Shadcn UI.

| File / Folder | Description |
| :--- | :--- |
| `pages/` | React components representing full pages (routed views). |
| `components/` | Reusable UI components (buttons, inputs, layout). |
| `components/ui/` | Shadcn UI primitive components. |
| `context/` | React Context definitions (e.g., `AuthContext.tsx` for user session state). |
| `lib/` | Utility functions and helpers (e.g., `utils.ts`). |
| `App.tsx` | Main application component handling routing and layout structure. |
| `main.tsx` | Entry point that renders the React app into the DOM. |
| `index.css` | Global styles and Tailwind CSS directives. |

### Key Pages (`src/pages/`)
-   `Login.tsx`: User login page.
-   `Register.tsx`: User registration page.
-   `Dashboard.tsx`: Main user dashboard.
-   `Profile.tsx`: User profile management.
-   `Files.tsx`: File browser and management.
-   `AdminDashboard.tsx`: Admin-specific controls.

---

## Key Commands

### Start Development
To run both the frontend and backend concurrently:
```bash
npm run dev
```
-   **Frontend**: [http://localhost:8080](http://localhost:8080)
-   **Backend**: [http://localhost:5001](http://localhost:5001)

### Database Management
-   **Schema**: Apply `server/schema.sql` in your Supabase SQL Editor.
-   **Seed Admins**: Run `npx ts-node server/src/seedAdmins.ts` (from root or server dir).
