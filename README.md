# 🚀 100x Team Task Manager

A high-performance, industrial-grade task management system built for scale.  
This project combines a distributed-systems-inspired backend with a reactive, strictly-typed frontend.

---

## 🌐 Live Application

- **Backend API:**  
  https://task-manager-backend-5tzq.onrender.com/api

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- TanStack Query (React Query)
- Tailwind CSS
- Lucide React
- Zustand

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Security

- JWT (JSON Web Tokens)
- Role-Based Access Control (RBAC)
- bcryptjs (password hashing)

### Validation

- Zod (schema-first validation for API and forms)

---

## ⚙️ Key Features

### 1. 📊 Advanced Dashboard

- **Bento-style UI** with real-time task statistics:
  - Total Tasks
  - In Progress
  - Completed
- **Dynamic Overdue Monitoring**  
  Amber-glow alerts for overdue tasks
- **Role-Aware Stats**
  - Admin → global system overview
  - Member → personal task insights

---

### 2. 🧠 Kanban Board (Crown Jewel)

- **Native Drag & Drop** (HTML5 API → zero latency)
- **Optimistic UI Updates**
  - Instant UI response
  - Background server sync
- **Priority Indicators**
  - High / Medium / Low (color-coded)

---

### 3. 🔐 Role-Based Access Control (RBAC)

#### Admin Capabilities

- Create projects
- Manage team members
- Assign tasks

#### Member Capabilities

- View assigned tasks
- Update task status
- Access project boards

#### Backend Security

- Route-level protection
- Unauthorized access returns **403 Forbidden**

---

### 4. 👥 Project & Team Hub

- **Secure Member Invitations**
- **Team Avatar Stack UI**
- **Efficient relational modeling (Prisma)**

---

## 🏗️ Architecture Highlights

### ⚡ Zero-Footprint Caching Strategy

- Built using **TanStack Query**
- Query keys scoped by **User ID**
- Prevents **cross-account cache leakage**
- Automatic cache reset on logout

---

## 🔑 Demo Credentials

| Role   | Email           | Password     |
| ------ | --------------  | ------------ |
| Admin  | yash@demo.com   | Password@123 |
| Member | sniper@demo.com | Password@123 |
| Member | yogesh@demo.com | Password@123 |

---

## 🚀 Deployment

### Backend

- Hosted on **Render** (Railway free trial expired)
- PostgreSQL database
- Prisma handles migrations automatically

### Frontend

- Hosted on **Vercel**
- Optimized for static delivery + edge caching

---

## 📦 Local Setup

```bash
# Clone repo
git clone https://github.com/YashXBansal/task-manager.git
cd task-manager

# Backend
cd backend
npm install
npx prisma migrate dev
npx tsc
node dist/index.js

# Frontend
cd ../frontend
npm install
npm run dev
```
