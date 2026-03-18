# Project Folder Structure - Detailed Documentation

## 📁 Root Level Files & Directories

```
AI-based-Secure-file-sharing-and-storing-System/
├── Frontend Configuration & Build Files
├── Backend Server Directory
├── Public Assets
├── Source Code (Frontend)
├── Version Control & Documentation
└── Dependencies & Build Output
```

---

## 📋 Detailed Structure

### 🔧 Configuration Files (Root)

| File                 | Purpose                             |
| -------------------- | ----------------------------------- |
| `package.json`       | Frontend dependencies & npm scripts |
| `package-lock.json`  | Locked dependency versions          |
| `tsconfig.json`      | TypeScript configuration (root)     |
| `tsconfig.app.json`  | TypeScript config for frontend app  |
| `tsconfig.node.json` | TypeScript config for Node tools    |
| `.env`               | Environment variables (frontend)    |
| `.gitignore`         | Git ignore patterns                 |
| `vite.config.ts`     | Vite build configuration            |
| `vitest.config.ts`   | Vitest testing configuration        |
| `eslint.config.js`   | ESLint code quality rules           |
| `tailwind.config.ts` | Tailwind CSS configuration          |
| `postcss.config.js`  | PostCSS transformation rules        |
| `components.json`    | shadcn/ui component registry        |
| `index.html`         | HTML entry point                    |
| `vite-env.d.ts`      | Vite environment type definitions   |

---

## 📂 Directory Structure

### 🎨 `/src` - Frontend React Application

**Purpose:** Main frontend application code built with React, TypeScript, and Tailwind CSS

```
src/
├── App.tsx                 # Main application component
├── App.css                 # Global styles
├── index.css               # Base styles
├── main.tsx                # React entry point
├── vite-env.d.ts           # Vite type definitions
│
├── components/             # Reusable React components
│   ├── mode-toggle.tsx     # Dark/Light mode switcher
│   ├── NavLink.tsx         # Navigation link component
│   ├── theme-provider.tsx  # Theme context provider
│   ├── alerts/
│   │   └── AlertItem.tsx   # Individual alert display
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── RecentActivity.tsx      # Activity feed component
│   │   ├── SecurityStatus.tsx      # Security status widget
│   │   └── StatCard.tsx            # Statistics cards
│   ├── files/              # File management components
│   │   ├── FileCard.tsx    # Single file display
│   │   └── FileUpload.tsx  # File upload interface
│   ├── layout/             # Layout components
│   │   ├── DashboardLayout.tsx     # Main layout wrapper
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── ProtectedRoute.tsx      # Route protection wrapper
│   │   └── Sidebar.tsx             # Left sidebar navigation
│   └── ui/                 # shadcn/ui components (25+ files)
│       ├── button.tsx, card.tsx, input.tsx, ... (UI library)
│       └── [Other UI components for forms, dialogs, etc.]
│
├── context/                # React Context providers
│   └── AuthContext.tsx     # Authentication state management
│
├── hooks/                  # Custom React hooks
│   ├── use-mobile.tsx      # Mobile device detection
│   └── use-toast.ts        # Toast notification hook
│
├── lib/                    # Utility functions & helpers
│   ├── authFetch.ts        # API requests with auth headers
│   └── utils.ts            # Utility functions
│
├── pages/                  # Page components (routes)
│   ├── AccessControl.tsx        # User access control page
│   ├── Activity.tsx             # Activity log page
│   ├── AdminDashboard.tsx       # Admin dashboard
│   ├── Alerts.tsx               # Alerts page
│   ├── AuditLogs.tsx            # Audit trail page
│   ├── Contact.tsx              # Contact page
│   ├── Dashboard.tsx            # Main dashboard (with storage stats)
│   ├── DatabaseMonitor.tsx      # Database monitoring page
│   ├── FAQ.tsx                  # FAQ page
│   ├── Files.tsx                # File listing page
│   ├── ForgotPassword.tsx       # Password reset page
│   ├── Index.tsx                # Landing page
│   ├── Login.tsx                # Login page
│   ├── ManageUsers.tsx          # User management page
│   ├── MlDashboard.tsx          # ML analytics dashboard
│   ├── MLInfo.tsx               # ML information page
│   ├── MyFiles.tsx              # User's files page
│   ├── NotFound.tsx             # 404 page
│   ├── Profile.tsx              # User profile page
│   ├── Register.tsx             # Registration page
│   ├── SecuritySettings.tsx     # Security settings page
│   ├── Settings.tsx             # General settings page
│   ├── SharedFiles.tsx          # Shared files page
│   └── Users.tsx                # Users list page
│
└── test/                   # Testing files
    ├── example.test.ts     # Example test
    └── setup.ts            # Test setup / configuration
```

---

### 🖥️ `/server` - Backend Express Server

**Purpose:** RESTful API server with file management, authentication, and email services

```
server/
├── package.json            # Backend dependencies (nodemailer, bcryptjs, jwt, etc.)
├── tsconfig.json           # TypeScript config for backend
├── .env                    # Backend environment variables
│                           # (EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWORD, etc.)
│
├── src/                    # Backend source code
│   ├── index.ts            # Main Express server file
│   │                        # Contains:
│   │                        # - Email transporter configuration
│   │                        # - Registration endpoint (with email sending)
│   │                        # - File upload/download endpoints
│   │                        # - Authentication middleware
│   │                        # - Admin endpoints
│   │
│   ├── middleware.ts       # Custom Express middleware
│   │                        # - JWT authentication
│   │                        # - Admin-only routes
│   │                        # - Error handling
│   │
│   ├── supabaseClient.ts   # Supabase PostgreSQL client initialization
│   ├── setupDatabase.ts    # Database schema initialization
│   ├── seedAllTables.ts    # Database seeding script
│   ├── seedAdmins.ts       # Admin user creation script
│   ├── setAdmins.ts        # Admin permission script
│   ├── debugTables.ts      # Database debugging utility
│   └── test_isolation.js   # Test isolation configuration
│
├── uploads/                # File storage directory
│   └── [Encrypted user files stored here]
│
└── schema.sql              # Database schema (SQL definitions)
```

---

### 📚 `/public` - Static Assets

```
public/
└── robots.txt              # SEO robots configuration
```

---

### 📦 `/dist` - Build Output

```
dist/                       # Production build (auto-generated)
├── index.html
├── assets/
│   ├── *.js                # Compiled JavaScript chunks
│   ├── *.css               # Compiled CSS chunks
│   └── [Other assets]
└── [Compiled frontend code]
```

---

### 🔒 `/node_modules` - Dependencies

```
node_modules/              # npm packages (auto-generated, not in git)
├── react, react-dom, ...   # Core dependencies
├── express, cors, ...      # Backend dependencies
└── [600+ packages total]
```

---

### 🐙 `/.git & /.github` - Version Control

```
.git/                       # Git repository data
└── [Version history]

.github/                    # GitHub configuration
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
npm run build       → Compiles React to /dist
npm run dev         → Dev server on port 8080 (Vite)
npm run preview     → Preview production build
npm test            → Run Vitest tests
```

### Backend Build

```
cd server
npm install         → Install dependencies
npm start           → Run server on port 3001 (ts-node)
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

**Generated:** March 18, 2026
**Project:** AI-based Secure File Sharing and Storing System
**Frontend:** React + TypeScript + Tailwind CSS
**Backend:** Express.js + PostgreSQL + Nodemailer
