# 🚀 Complete Step-by-Step Setup Guide

## For New Team Members: Zero to Running Website

---

## 📋 Prerequisites Checklist

Before starting, ensure your teammate has these installed on their computer:

### 1. **Node.js & npm**

- [ ] Download from [nodejs.org](https://nodejs.org) (Download LTS version 20.x or 22.x)
- [ ] Verify installation:
  ```bash
  node --version
  npm --version
  ```
  Expected output: `v20.x.x` or higher for Node, `9.x.x` or higher for npm

### 2. **Git**

- [ ] Download from [git-scm.com](https://git-scm.com)
- [ ] Verify installation:
  ```bash
  git --version
  ```
  Expected output: `git version 2.x.x`

### 3. **PostgreSQL Database**

- [ ] Download from [postgresql.org](https://www.postgresql.org/download)
- [ ] During installation, remember the password you set for the `postgres` user
- [ ] Verify installation:
  ```bash
  psql --version
  ```
  Expected output: `psql (PostgreSQL) 13.x`

### 4. **Code Editor** (Optional, but recommended)

- [ ] [Visual Studio Code](https://code.visualstudio.com) - Recommended
- [ ] Or any code editor of their choice

### 5. **Supabase Account**

- [ ] Create free account at [supabase.com](https://supabase.com)
- [ ] Create a new Supabase project
- [ ] Copy your Supabase URL and API Key (you'll need these later)

### 6. **Google OAuth Credentials** (Optional for OAuth login)

- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create OAuth 2.0 credentials
- [ ] Copy Client ID and Client Secret

---

## ✅ Step 1: Clone the Repository

### 1.1 Open Terminal/Command Prompt

**Windows Users:**

- Press `Win + R`, type `cmd`, and press Enter
- Or open PowerShell

**Mac/Linux Users:**

- Open Terminal application

### 1.2 Navigate to where you want the project

```bash
# Example: Put project on Desktop
cd Desktop
```

### 1.3 Clone the repository

```bash
git clone https://github.com/TejasButani001/AI-based-Secure-file-sharing-and-storing-System.git
```

### 1.4 Navigate into the project folder

```bash
cd AI-based-Secure-file-sharing-and-storing-System
```

**Verify:** You should see these folders in the terminal:

- `src/` (frontend code)
- `server/` (backend code)
- `public/`
- `node_modules/` (will appear after npm install)

---

## 📦 Step 2: Install Frontend Dependencies

### 2.1 Install npm packages for frontend

From the project root directory (where you see `package.json`):

```bash
npm install
```

**What this does:** Downloads ~150+ npm packages needed for React, UI components, and tools

**Speed:** Usually takes 3-5 minutes depending on internet speed

**Expected output:** Ends with something like:

```
added 450+ packages in 2m50s
```

### 2.2 Verify installation

```bash
npm --version
```

The `node_modules/` folder should now exist and be quite large (500MB+)

---

## 🔙 Step 3: Install Backend Dependencies

### 3.1 Navigate to server folder

From project root:

```bash
cd server
```

### 3.2 Install backend packages

```bash
npm install
```

**What this does:** Downloads packages for Express server, database, authentication, etc.

**Speed:** Usually 1-2 minutes

**Expected output:**

```
added 180+ packages in 1m30s
```

### 3.3 Return to project root

```bash
cd ..
```

---

## 🔑 Step 4: Setup Environment Variables

### 4.1 Create `.env` file in root directory

In the project root folder (same level as `package.json`), create a new file named `.env`

**Windows (Command Prompt):**

```bash
echo. > .env
```

**Mac/Linux:**

```bash
touch .env
```

**Or manually:** Right-click → New File → name it `.env`

### 4.2 Add frontend environment variables

Open the `.env` file in your code editor and add:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with actual credentials if you have them (optional for now)

### 4.3 Create `.env` file in server folder

Navigate to `server` folder and create another `.env` file

**Windows:**

```bash
cd server
echo. > .env
cd ..
```

**Mac/Linux:**

```bash
cd server
touch .env
cd ..
```

### 4.4 Add backend environment variables

Open `server/.env` and add:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:your_postgres_password@localhost:5432/securevault

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-super-secret-key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_123456789

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (Optional - for password reset emails)
NODEMAILER_EMAIL=your_email@gmail.com
NODEMAILER_PASSWORD=your_app_specific_password
```

**Important:**

- Replace values with your actual credentials
- For `DATABASE_URL`: Use the password you set during PostgreSQL installation
- Keep this file private - never commit to GitHub

---

## 🗄️ Step 5: Setup PostgreSQL Database

### 5.1 Start PostgreSQL service

**Windows:**

- PostgreSQL should be running automatically after installation
- Check: Open Services (services.msc) and look for "postgresql"

**Mac:**

```bash
brew services start postgresql
```

**Linux:**

```bash
sudo systemctl start postgresql
```

### 5.2 Verify PostgreSQL is running

```bash
psql --version
```

### 5.3 Create a new database

**Open PostgreSQL terminal:**

```bash
psql -U postgres
```

It will ask for password - enter the password you set during PostgreSQL installation

**Inside PostgreSQL terminal, type:**

```sql
CREATE DATABASE securevault;
\l
```

**Expected output:** You should see `securevault` database in the list

**Exit PostgreSQL:**

```sql
\q
```

### 5.4 Run database setup script

From project root:

```bash
cd server
npm run setup
cd ..
```

**What this does:**

- Creates tables
- Seeds data (adds sample admins, etc.)
- Prepares database for use

**Expected output:** Success messages or table creation confirmations

---

## 🚀 Step 6: Run the Application

### 6.1 Start both frontend and backend together

From project root:

```bash
npm start
```

**What this does:**

- Starts Express backend on `http://localhost:3000`
- Starts Vite frontend dev server on `http://localhost:5173`
- Automatically opens browser (usually)

**Expected output in terminal:**

```
> start
> concurrently -k "npm run start:server" "npm run start:client"

[0] $ cd server && npm start
[1] $ vite

[0] Server running on port 3000
[1] VITE v5.x.x ready in xxx ms
[1] ➜ Local:   http://localhost:5173/
```

### 6.2 Access the website

Open browser and go to:

```
http://localhost:5173
```

**You should see:** The login page of the secure file sharing application

---

## ✨ Step 7: Verify Everything Works

### 7.1 Test Frontend

- [ ] Website loads without errors
- [ ] Can see login/register page
- [ ] Page styling looks correct (colors, buttons, layout)

### 7.2 Test Backend

- [ ] Terminal shows "Server running on port 3000"
- [ ] No error messages in terminal

### 7.3 Test Database

- [ ] No database connection errors in terminal
- [ ] If you can log in with test credentials, database works

### 7.4 Create a test account

1. Click "Register" on the website
2. Fill in the form with:
   - Email: `test@example.com`
   - Password: `Test123!@#`
   - Other required fields
3. Click "Register"
4. You should see success message

### 7.5 Login with test account

1. Click "Login"
2. Use credentials from step 7.4
3. Should redirect to dashboard

---

## 🎯 Step 8: Common First-Time Issues & Solutions

### ❌ Issue: "npm: command not found"

**Solution:**

- Restart your terminal/command prompt
- If still failing, reinstall Node.js
- Verify: `node --version`

### ❌ Issue: "Port 3000 already in use"

**Solution:**

```bash
# Windows - find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /pid <PID> /f

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

Or change port in `server/src/index.ts`:

```typescript
const PORT = 3001; // Changed from 3000
```

### ❌ Issue: "Port 5173 already in use"

**Solution:** Similar to above, or it'll use 5174, 5175, etc automatically

### ❌ Issue: "Cannot find module" errors

**Solution:**

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

### ❌ Issue: "Database connection refused"

**Solution:**

- Verify PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Default password is usually what you set during installation
- Try connecting manually: `psql -U postgres`

### ❌ Issue: "Supabase connection error"

**Solution:**

- Verify SUPABASE_URL and SUPABASE_KEY in `.env`
- Check URL format: should be `https://xxxx.supabase.co`
- Get credentials from Supabase dashboard → Settings → API

### ❌ Issue: "EACCES: permission denied"

**Solution (Mac/Linux):**

```bash
sudo npm install -g npm
```

---

## 🎓 Step 9: Understanding the Project Structure

```
AI-based-Secure-file-sharing-and-storing-System/
├── src/                          # Frontend (React) code
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── context/                  # React Context
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utility functions
│   └── App.tsx                   # Main app component
│
├── server/                       # Backend (Express) code
│   ├── src/
│   │   ├── index.ts              # Main server file
│   │   ├── middleware.ts         # Express middleware
│   │   ├── setupDatabase.ts      # Database setup
│   │   └── supabaseClient.ts     # Supabase client
│   └── package.json
│
├── package.json                  # Frontend dependencies
├── .env                          # Frontend environment variables
└── DEPENDENCIES.md               # Dependencies documentation
```

---

## 📝 Step 10: Daily Development Workflow

### Start working on the project:

```bash
# Terminal 1: Start the application
npm start
```

### Stop the application:

Press `Ctrl + C` in terminal

### Make code changes:

1. Edit files in `src/` folder (frontend)
2. Or edit files in `server/src/` folder (backend)
3. Changes auto-reload (no need to restart for frontend)
4. Restart backend if needed: `npm start`

### Running tests:

```bash
npm run test          # Run tests once
npm run test:watch   # Watch mode
```

### Build for production:

```bash
npm run build
```

---

## 🆘 Step 11: Need Help?

### Check logs

**Frontend errors:** Check browser console (F12)

**Backend errors:** Check terminal output

### Useful debug commands:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List running Node processes
ps aux | grep node

# Test database connection
psql -U postgres -d securevault

# Check if ports are open
netstat -an | grep LISTEN
```

### Documentation links:

- React Issues: [react.dev](https://react.dev)
- Express Issues: [expressjs.com](https://expressjs.com)
- PostgreSQL: [postgresql.org/docs](https://www.postgresql.org/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)

---

## ✅ Final Checklist

Before considering setup complete:

- [ ] Node.js and npm installed
- [ ] PostgreSQL installed and running
- [ ] Repository cloned
- [ ] `npm install` completed in root
- [ ] `npm install` completed in server folder
- [ ] `.env` files created with correct values
- [ ] Database created and setup script ran
- [ ] `npm start` runs without errors
- [ ] Website accessible at `http://localhost:5173`
- [ ] Can register and login
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal

---

## 📞 Quick Reference Commands

```bash
# Clone project
git clone https://github.com/TejasButani001/AI-based-Secure-file-sharing-and-storing-System.git

# Install dependencies
npm install
cd server && npm install && cd ..

# Start application
npm start

# Stop application
Ctrl + C

# Start frontend only
npm run start:client

# Start backend only
cd server && npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Setup database
cd server && npm run setup
```

---

**Created:** March 2026  
**Version:** 1.0 - Complete Setup Guide  
**Last Updated:** Today

Good luck! 🎉 Your website will be up and running in about 30 minutes!
