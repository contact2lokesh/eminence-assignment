# MLM User Management System

## 🚀 Features
- **Multi-Level**: User registration with ancestry tracking.
- **Secure Authentication**: JWT-based authentication with HttpOnly Cookies.
- **Real-time Balance**: Get Real-time balance updates using with Socket.io.
- **Commission System**: Automatic 2% commission earned by the sender during transfers.
- **API Documentation**: added Interactive Swagger UI API Docs for testing all endpoints.
- **Dockerized Setup**: Ready-to-use Docker environment covering Database, Backend, and Frontend.

---

## 🛠️ Tech Stack Used
- **Frontend**: Angular 21, Bootstrap 5, Socket.io-client
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Database**: MongoDB (Atlas)
- **Real-time**: Socket.io
- **Docs**: Swagger JSDoc + UI

---

## 🔧 Prerequisites
- **Node.js** version 18 or above
- **NPM**
- **Docker** & **Docker Compose** Optional, (for containerized setup)
- **MongoDB Atlas Cluster**

---

## ⚡ Quick Start: Using Docker (Recommended)

The easiest way to get started is using the pre-configured Docker setup.

1.  **Configure Environment**:
    Create or edit `backend/.env` (and ensure `docker-compose.yml` environment matches):
    ```env
    PORT=5000
    MONGODB_URI=mongodb+srv://<db_username>:<db_password>@cluster0.ueqckxu.mongodb.net/mlm_db
    DB_USERNAME=your_atlas_user
    DB_PASSWORD=your_atlas_password
    JWT_SECRET=eminenceInnovation
    NODE_ENV=production
    ```

2.  **Run Containers**:
    In the root directory, run:
    ```bash
    docker-compose up --build
    ```

3.  **Access the App**:
    - **Frontend Dashboard**: [http://localhost:4200]
    - **API Documentation**: [http://localhost:5000/api-docs]
    -**Backend**: [http://localhost:5000]

---

## 🏠 Manual Setup (Development)

### 1. Backend Setup
```bash
cd backend
npm install
npm run start
```
The server will run at [http://localhost:5000]

### 2. Frontend Setup
```bash
cd multi-level-user-management
npm install
npm run start
```
The dashboard will run at [http://localhost:4200]

---

## 📝 Usage Guide

### 📂 Initial Owner Setup
1. Use the Register Owner API (`POST /api/auth/register`) or use the UI (if implemented) to create the unique System Owner (Level 0).
2. Only one Owner can exist in the system and existing Owner credentials are below 
    - **username**: admin
    - **password**: password

### 🛡️ Authentication in Swagger
- To use restricted APIs in Swagger (`auth_token` required):
  1. Expand the **Authentication** tag.
  2. Use `/auth/captcha` to get a `sessionId` and current `text_for_testing_only`.
  3. Execute `/auth/login` with your credentials and the captcha text.
  4. The browser automatically saves the session cookie for subsequent requests!

### 💰 Commission Math
Whenever a user (Sender) transfers balance to their direct downline (Receiver):
- **Sender pays**: $100.00
- **Receiver gets**: $98.00 (Net Amount)
- **Sender earns**: $2.00 (2% Commission)
- **Result**: Sender's total balance drops by $98.00 only.

---

## 📂 Project Structure

```text
├── backend/
│   ├── controllers/      # API Logic
│   ├── models/           # Mongoose Schemas (User, Transaction)
│   ├── routes/           # Express Route definitions (tagged with Swagger JSDoc)
│   ├── swagger.ts        # Swagger Spec Configuration
│   └── server.ts         # Main Entry point & Socket.io logic
├── multi-level-user-management/
│   ├── src/app/
│   │   ├── components/   # Angular Dashboard & Shared Components
│   │   ├── services/     # Angular Auth, Socket, and Data Services
│   └── Dockerfile        # 2-Stage build (Build + Nginx)
└── docker-compose.yml    # Root orchestrator
```