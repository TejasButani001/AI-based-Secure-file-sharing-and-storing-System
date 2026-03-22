# AI-Secure File Sharing System - Folder Structure

## 📋 Quick Overview

```
project/
├── 🔧 Root Config Files (Build, TypeScript, Tailwind, ESLint)
├── 📁 /src → Frontend React App (React + TypeScript + Tailwind)
├── 📁 /server → Backend Express + Supabase Database
├── 📁 /public → Static Assets
└── 📁 /node_modules → Dependencies (auto-generated)
```

---

## 🔧 Root Configuration Files (Frontend Setup)

| File                 | Purpose                         |
| -------------------- | ------------------------------- |
| `package.json`       | Frontend dependencies & scripts |
| `tsconfig.json`      | TypeScript settings             |
| `vite.config.ts`     | Build tool configuration        |
| `tailwind.config.ts` | Tailwind CSS setup              |
| `eslint.config.js`   | Code quality rules              |
| `vitest.config.ts`   | Testing configuration           |
| `components.json`    | shadcn/ui components registry   |
| `postcss.config.js`  | CSS processing                  |
| `index.html`         | HTML entry point                |

---

## 📁 /src - Frontend Application

**Tech Stack:** React + TypeScript + Tailwind CSS + shadcn/ui

```
src/
├── App.tsx, main.tsx       # App entry points
├── App.css, index.css      # Global styles
│
├── components/             # Reusable Components
│   ├── layout/             # DashboardLayout, Navbar, Sidebar, ProtectedRoute
│   ├── dashboard/          # RecentActivity, SecurityStatus, StatCard
│   ├── files/              # FileCard, FileUpload
│   ├── alerts/             # AlertItem
│   ├── ui/                 # shadcn/ui components (25+)
│   ├── mode-toggle.tsx     # Dark/Light mode
│   ├── NavLink.tsx         # Navigation links
│   └── theme-provider.tsx  # Theme provider
│
├── pages/                  # Page Components (Routes)
│   ├── Login, Register, ForgotPassword
│   ├── Dashboard, MyFiles, SharedFiles, Files
│   ├── AdminDashboard, ManageUsers, Users, AccessControl
│   ├── Profile, Settings, SecuritySettings
│   ├── MlDashboard, MLInfo
│   ├── Activity, AuditLogs, Alerts
│   ├── DatabaseMonitor, Contact, FAQ
│   ├── Index (Landing), NotFound
│   └── ... (Total: 25+ pages)
│
├── context/                # State Management
│   └── AuthContext.tsx     # Authentication context
│
├── hooks/                  # Custom Hooks
│   ├── use-mobile.tsx      # Responsive detection
│   └── use-toast.ts        # Toast notifications
│
├── lib/                    # Utilities
│   ├── authFetch.ts        # API calls with authentication
│   └── utils.ts            # Helper functions
│
└── test/                   # Testing
    ├── example.test.ts
    └── setup.ts
```

---

## 🖥️ /server - Backend API

**Tech Stack:** Express + TypeScript + Supabase PostgreSQL

```
server/
├── package.json            # Backend dependencies (express, supabase, nodemailer, etc.)
├── tsconfig.json           # TypeScript config
│
├── src/
│   ├── index.ts            # Main server + API endpoints
│   │                        # - File upload/download
│   │                        # - User registration with email
│   │                        # - Authentication endpoints
│   │                        # - Admin operations
│   │
│   ├── middleware.ts       # JWT auth, error handling, admin verification
│   ├── supabaseClient.ts   # Database connection
│   ├── setupDatabase.ts    # Schema initialization
│   ├── seedAllTables.ts    # Database seeding
│   ├── seedAdmins.ts       # Admin user setup
│   ├── setAdmins.ts        # Admin permissions
│   ├── debugTables.ts      # Debug utility
│   ├── anomalyDetection.ts # ML anomaly detection
│   └── test_isolation.js   # Test configuration
│
├── uploads/                # File storage (encrypted user files)
├── schema.sql              # Database schema
└── .env                    # Environment variables (emails, keys, etc.)
```

---

## 📚 Other Directories

| Directory       | Contains                                  |
| --------------- | ----------------------------------------- |
| `/public`       | Static assets (robots.txt)                |
| `/dist`         | Production build output (auto-generated)  |
| `/node_modules` | npm packages (auto-generated, not in git) |
| `/.git`         | Git version control                       |

---

## 🎯 File Organization Summary

| Category          | Location                                  | Purpose                                            |
| ----------------- | ----------------------------------------- | -------------------------------------------------- |
| **Pages**         | `/src/pages/`                             | User-facing routes (Login, Dashboard, Files, etc.) |
| **Components**    | `/src/components/`                        | Reusable UI pieces (buttons, cards, forms, etc.)   |
| **Backend Logic** | `/server/src/`                            | API, database, authentication                      |
| **Styling**       | `/src/App.css`, `tailwind.config.ts`      | Global & Tailwind styles                           |
| **Config**        | Root directory                            | Build, TypeScript, ESLint settings                 |
| **Database**      | `/server/schema.sql`                      | Table definitions                                  |
| **Testing**       | `/src/test/`, `/server/test_isolation.js` | Unit & integration tests                           |

---

## 🚀 Quick Start

1. **Frontend:** `npm install && npm run dev`
2. **Backend:** `cd server && npm install && npm run dev`
3. **Build:** `npm run build`
4. **Deploy:** Push to GitHub, deploy with GitHub Pages (frontend) + Vercel/Railway (backend)

.github/ # GitHub configuration
└── [GitHub workflows/templates if any]

```

---

## 📊 Key Technologies by Directory

### Frontend (`/src`)

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS + PostCSS
- **UI Components:** shadcn/ui (30+ components)
- **State Management:** React Context API
- **Build Tool:** Vite
- **Testing:** Vitest
- **Code Quality:** ESLint

### Backend (`/server`)

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT + bcryptjs
- **File Upload:** Multer
- **Email:** Nodemailer (Gmail SMTP)
- **Encryption:** [Ready for AES implementation]

---

## 🗄️ Database (Supabase PostgreSQL)

### Key Tables

- **users** - User accounts with roles (admin/user)
- **files** - File metadata (name, size, owner, path)
- **access_logs** - Download audit trail
- **audit_trail** - Admin actions & deletions
- **file_access_permission** - Sharing permissions
- **alerts** - Security alerts
- **sessions** - Active user sessions
- **login_logs** - Login history
- **ml_activity_data** - ML analytics data
- **admin_actions** - Admin operation logs

---

## 🚀 Build & Runtime

### Frontend Build

```

npm run build → Compiles React to /dist
npm run dev → Dev server on port 8080 (Vite)
npm run preview → Preview production build
npm test → Run Vitest tests

```

### Backend Build

```

cd server
npm install → Install dependencies
npm start → Run server on port 3001 (ts-node)

```

---

## 📋 Summary

| Directory       | Type   | Files    | Purpose                    |
| --------------- | ------ | -------- | -------------------------- |
| `/src`          | Source | 50+      | Frontend React application |
| `/server/src`   | Source | 10+      | Backend API server         |
| `/public`       | Assets | 1        | Static files               |
| `/dist`         | Build  | Auto-gen | Production build           |
| `/node_modules` | Deps   | 600+     | JavaScript packages        |
| `/.git`         | VCS    | Auto-gen | Version control            |
| Root            | Config | 14       | Project configuration      |

---

## 🎯 Key Features by Location

| Feature              | Location                                                     | Status                 |
| -------------------- | ------------------------------------------------------------ | ---------------------- |
| User Registration    | `/server/src/index.ts` + `/src/pages/Register.tsx`           | ✅ Done (with email)   |
| File Upload/Download | `/server/src/index.ts` + `/src/pages/Files.tsx`              | ✅ Done                |
| Authentication       | `/server/src/middleware.ts` + `/src/context/AuthContext.tsx` | ✅ Done                |
| Dashboard/Stats      | `/src/pages/Dashboard.tsx`                                   | ✅ Done (with storage) |
| Email Notifications  | `/server/src/index.ts` (nodemailer)                          | ✅ Done                |
| File Encryption      | [Ready in `/server/src`]                                     | 🔄 In Progress         |
| Admin Panel          | `/src/pages/AdminDashboard.tsx`                              | ✅ Done                |
| Security Logs        | `/src/pages/AuditLogs.tsx`                                   | ✅ Done                |

---

**Project:** AI-based Secure File Sharing and Storing System
**Frontend:** React + TypeScript + Tailwind CSS
**Backend:** Express.js + PostgreSQL + Nodemailer
```
