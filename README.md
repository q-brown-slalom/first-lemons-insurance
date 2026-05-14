# First Lemons Insurance — Member Portal

A full-stack mock patient portal for **First Lemons Insurance**, a fictional company that provides insurance coverage for lemonade stands, their owners, and their employees. Built as a demonstration application showcasing a modern Java/Spring Boot API backend paired with a React frontend.

---

## Table of Contents

- [Overview](#overview)
- [Design](#design)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
- [Test Accounts](#test-accounts)
- [API Reference](#api-reference)

---

## Overview

The First Lemons Insurance Member Portal gives policyholders a self-service hub to manage their insurance needs. The app supports three distinct user roles with differentiated access:

| Role | Who they are | What they can do |
|---|---|---|
| **Employee** | A lemonade stand worker covered under a stand's policy | View their own coverage, file personal claims, pay bills, find medical providers |
| **Stand Owner** | A lemonade stand operator managing a business policy | Everything an employee can do, plus view all employee claims, find stand-specific service providers |
| **Admin** | First Lemons Insurance internal staff | Full read access to all users and accounts |

The application uses in-memory data (H2 database) pre-seeded with realistic lemonade-stand-flavored records, making it immediately demo-ready with no database setup required.

---

## Design

### Architecture

```
first-lemons-insurance/
├── backend/    ← Spring Boot REST API (port 8080)
└── frontend/   ← React SPA (port 5173)
```

The two halves are fully decoupled. The frontend communicates with the backend exclusively via REST API calls. Authentication is stateless: the backend issues a signed JWT on login, and the frontend attaches it to every subsequent request via the `Authorization: Bearer` header.

### Backend

- **Framework:** Spring Boot 3.2 with Gradle (Groovy DSL)
- **Security:** Spring Security + JJWT 0.12.x (HS256 signed tokens, 24-hour expiry)
- **Persistence:** Spring Data JPA + H2 in-memory database (resets on each restart)
- **Data seeding:** A `DataInitializer` component runs on startup to populate all tables using BCrypt-hashed passwords — no plain-text credentials are stored anywhere
- **CORS:** Configured to allow requests from `localhost:5173` and `localhost:3000`

### Frontend

- **Framework:** React 18 + Vite
- **UI Library:** Material UI v5 (MUI) with a custom navy-blue professional theme
- **Routing:** React Router v6 with protected routes (unauthenticated users are redirected to `/login`)
- **State:** Auth state is held in a React Context (`AuthContext`) and persisted to `localStorage` so sessions survive page refreshes
- **HTTP:** Axios with request/response interceptors — the JWT is injected automatically into every request, and a 401 response triggers an automatic logout and redirect to the login page

---

## Features

### Login
- Email/password form with error feedback
- On success, stores the JWT and user details in `localStorage` and redirects to the dashboard
- Displays test account credentials on the login page for convenience

### Dashboard
- Personalized greeting
- Three summary cards showing: current plan status, number of open (Pending) claims, and total outstanding balance
- Each card links directly to its full page

### My Coverage
- Full policy detail: plan name, status, effective/expiration dates
- Cost-sharing breakdown: deductible, out-of-pocket maximum, coinsurance percentage
- List of covered service categories

### Claims
- Full claims history in a sortable table with color-coded status chips (green = Approved, yellow = Pending, red = Denied)
- **Submit Claim** button opens a dialog to file a new claim: description, claim type (Medical / Equipment / Inspection / Supply), date of service, and dollar amount
- Owners and Admins see all claims across all users; Employees see only their own

### Bills
- Outstanding balance summary at the top of the page
- Bills table with paid/unpaid status and due dates
- **Pay Now** button on unpaid bills — marks the bill as paid and updates the UI immediately

### Find Providers
- **Medical Providers** tab: in-network doctors and urgent care facilities (visible to all roles)
- **Stand Service Providers** tab: equipment repair, health inspectors, and supply vendors (visible to Owners and Admins only)
- Each provider card shows name, specialty, address, phone, and an "Accepting / Full" badge

### Document Library
- Lists all documents belonging to the user plus any global (company-wide) documents
- Document types include Policy Certificates, Explanation of Benefits (EOBs), and general resources
- **Download** button triggers a mock download response and shows a confirmation snackbar

### Profile
- Displays current user information pulled live from the API
- Toggle into edit mode to update first name, last name, email, phone, and (for Owners) stand name
- Changes are persisted via `PUT /api/users/me`

### Manage Users *(Admin only)*
- Full roster of all portal members with their role, contact info, and stand affiliation

---

## Project Structure

```
first-lemons-insurance/
│
├── backend/
│   ├── build.gradle
│   ├── settings.gradle
│   └── src/main/
│       ├── java/com/firstlemons/portal/
│       │   ├── FirstLemonsApplication.java
│       │   ├── config/
│       │   │   ├── CorsConfig.java
│       │   │   ├── DataInitializer.java      ← seed data
│       │   │   └── SecurityConfig.java
│       │   ├── controller/                   ← REST endpoints
│       │   ├── dto/                          ← request/response shapes
│       │   ├── model/                        ← JPA entities
│       │   ├── repository/                   ← Spring Data interfaces
│       │   ├── security/                     ← JWT filter & service
│       │   └── service/                      ← business logic
│       └── resources/
│           └── application.properties
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx                           ← routes
        ├── theme.js                          ← MUI theme
        ├── contexts/
        │   └── AuthContext.jsx               ← auth state & login/logout
        ├── services/
        │   └── api.js                        ← axios instance + interceptors
        ├── components/
        │   ├── Layout.jsx                    ← app shell (sidebar + topbar)
        │   ├── ProtectedRoute.jsx
        │   └── Sidebar.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Coverage.jsx
            ├── Claims.jsx
            ├── Bills.jsx
            ├── Providers.jsx
            ├── Documents.jsx
            ├── Profile.jsx
            └── AdminUsers.jsx
```

---

## Prerequisites

| Tool | Minimum Version | Notes |
|---|---|---|
| Java JDK | 17 | Required to compile and run the Spring Boot API |
| Node.js | 18 | Required to run the React frontend |
| npm | 9 | Bundled with Node.js 18+ |

No database installation is required — the backend uses an embedded H2 in-memory database.

To check your installed versions:
```bash
java -version
node -v
npm -v
```

---

## Running Locally

### 1. Clone / open the project

```bash
cd "first-lemons-insurance"
```

### 2. Start the Backend

Open a terminal in the `backend/` directory.

**macOS / Linux:**
```bash
cd backend
./gradlew bootRun
```

**Windows (Command Prompt or PowerShell):**
```powershell
cd backend
.\gradlew.bat bootRun
```

> On first run, Gradle will download all dependencies. This may take a minute or two.

Wait for the line:
```
Started FirstLemonsApplication in X.XXX seconds
```

The API is now running at **http://localhost:8080**. The H2 console (for inspecting in-memory data) is available at **http://localhost:8080/h2-console** with JDBC URL `jdbc:h2:mem:firstlemons`, username `sa`, and no password.

### 3. Start the Frontend

Open a **second** terminal in the `frontend/` directory.

```bash
cd frontend
npm install      # only needed the first time
npm run dev
```

Vite will print:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

### 4. Log In

Use one of the [test accounts](#test-accounts) below. The login page also displays them for reference.

---

## Test Accounts

| Username | Password | Role | Access Level |
|---|---|---|---|
| `alice` | `password` | Employee | Personal coverage, claims, bills, medical providers |
| `bob` | `password` | Stand Owner | All employee features + all claims, stand service providers |
| `carol` | `password` | Admin | All features + user management |

---

## API Reference

All endpoints are prefixed with `/api`. Every endpoint except `/api/auth/login` requires a valid `Authorization: Bearer <token>` header.

| Method | Path | Roles | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate and receive a JWT |
| `GET` | `/api/users/me` | All | Get current user's profile |
| `PUT` | `/api/users/me` | All | Update current user's profile |
| `GET` | `/api/users` | Admin | List all users |
| `GET` | `/api/policy` | All | Get current user's policy (Admin gets all) |
| `GET` | `/api/claims` | All | Get claims (Owner/Admin see all; Employee sees own) |
| `POST` | `/api/claims` | All | Submit a new claim |
| `GET` | `/api/claims/{id}` | All | Get a single claim |
| `GET` | `/api/bills` | All | Get current user's bills |
| `POST` | `/api/bills/{id}/pay` | All | Mark a bill as paid |
| `GET` | `/api/providers` | All | List providers; filter with `?type=MEDICAL` or `?type=STAND_SERVICE` |
| `GET` | `/api/documents` | All | List user's documents plus global documents |
| `GET` | `/api/documents/{id}/download` | All | Mock document download |
