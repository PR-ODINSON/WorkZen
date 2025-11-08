# WorkZen

This repository contains a WorkZen (HRMS) skeleton.

Folders:
- server: Express + Mongoose backend
- client: React (Vite) frontend with TailwindCSS

## Features

- ✅ User Authentication (JWT-based)
- ✅ Role-based Access Control (Admin, HR, PayrollOfficer, Employee)
- ✅ Employee Management
- ✅ Attendance Tracking
- ✅ Leave Management
- ✅ Payroll Processing
- ✅ **Automated Welcome Emails** - New users receive login credentials via email

## Quick Start (PowerShell)

### Backend
```powershell
cd server
npm install
# create a .env with MONGO_URI, JWT_SECRET, and EMAIL configuration
node server.js
```

### Frontend
```powershell
cd client
npm install
npm run dev
```

## Email Configuration

When an admin creates a new user, WorkZen automatically sends them a welcome email with their login credentials. To enable this feature:

1. Copy `server/.env.example` to `server/.env`
2. Add your SMTP configuration:
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=WorkZen <noreply@workzen.com>
   ```

📖 **Full setup guide:** See [server/EMAIL_SETUP.md](server/EMAIL_SETUP.md) for detailed configuration instructions, Gmail setup, and troubleshooting.

**Note:** The system works without email configuration - emails simply won't be sent, but user creation will still succeed.


