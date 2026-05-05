# Ethara AI - Team Task Manager

Ethara AI is a robust full-stack Team Task Manager designed to streamline collaboration, project management, and task tracking. It features a sophisticated team-level Role-Based Access Control (RBAC) system, ensuring secure data isolation and clear accountability.

## 🚀 Features

- **Multi-Tenant Team Support**: Create and manage multiple teams.
- **Hierarchical RBAC**: Access is scoped at the Team level (ADMIN vs. MEMBER).
- **Project Management**: Organize work into projects within teams.
- **Kanban Board**: Interactive task tracking with status-based columns.
- **Dynamic Dashboard**: Real-time KPIs including total, completed, and overdue tasks.
- **Personalized View**: "My Tasks" view for tracking individual assignments.
- **Secure Authentication**: JWT-based auth with password hashing.

## 🛠 Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide React.
- **Backend**: Express.js, TypeScript, Node.js.
- **ORM**: Prisma with PostgreSQL.
- **Validation**: Zod.
- **Deployment**: Railway.

## 🏗 Architecture

The project follows a clean, decoupled architecture:
- **Services**: Contain business logic and data access.
- **Controllers**: Handle HTTP requests and responses.
- **Middleware**: Manage authentication, RBAC, and request validation.
- **Context**: (Frontend) Manages global state like the active team.

## 🏃 Running Locally

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env # Update with your DATABASE_URL and JWT_SECRET
npx prisma migrate dev --name init
npm run dev
```

### 3. Setup Frontend
```bash
cd web
npm install
npm run dev
```
Visit `http://localhost:3000` to see the app.

## 🚢 Deployment (Railway)

1. Connect your GitHub repository to Railway.
2. Provision a PostgreSQL database.
3. Set environment variables:
   - **Backend**: `DATABASE_URL`, `JWT_SECRET`, `PORT=4000`, `CORS_ORIGIN`.
   - **Frontend**: `NEXT_PUBLIC_API_URL`.
4. Railway will automatically detect the `package.json` in each directory and deploy.

## ⚠️ Known Limitations
- Real-time updates (WebSockets) are not yet implemented.
- No email notifications for task assignments.
- File attachments are not supported in this version.
