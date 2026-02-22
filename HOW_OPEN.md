# How to Run SecureVault Successfully

This guide will help you set up and run the **AI-Based Secure File Sharing & Storing System** on your local machine.

## 📋 Prerequisites
- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **Supabase Account**: You need a Supabase project for the database and authentication.

## 🚀 Getting Started

### 1. Clone & Install Dependencies
First, install the necessary modules for both the frontend and the backend.

```bash
# Install root dependencies (including client)
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 2. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `server/schema.sql` and run it in the SQL Editor. This will create all required tables (`users`, `files`, `audit_trail`, etc.).

### 3. Environment Configuration
Create a `.env` file in the `server` directory with your Supabase credentials.

**File: `server/.env`**
```env
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-anon-key"
JWT_SECRET="your-random-secret-key"
PORT=3001
```

### 4. Seed Admin Account (Optional)
If you need a default admin account to get started:
```bash
cd server
npm run setup
cd ..
```

## 🏃 Running the Application

You can run both the frontend and backend simultaneously from the root directory:

```bash
npm run dev
```

- **Frontend**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 🛠️ Troubleshooting
- **Port Conflict**: If port 8080 or 3001 is already in use, you can change the `PORT` in `server/.env` or the Vite config.
- **Connection Error**: Ensure your Supabase URL and Key are correct in `server/.env`.
- **Module Not Found**: Try deleting `node_modules` and running `npm install` again.
