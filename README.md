# Absence Manager - Pro Edition

A modern, professional React-based application for managing student absences, featuring a premium aesthetic, bulk entry system, and role-based access control.

## 🚀 Key Features

- **Double-Entry Mode**
    - **Saisie Professionnelle** – Bulk entry using an attendance-book style grid (S1-S4 slots)
    - **Individual Management** – Modal-based entry for detailed absence tracking
- **User Authentication & Roles (RBAC)**
    - **Admin** – Full access (Statistics, Delete, Management)
    - **Professeur** – Recording & Viewing only
- **Intelligent Statistics** – Visual dashboard with justification rates and chronological recent absences
- **Advanced Lists** – Optimized with search, filtering, and pagination for high performance
- **Premium UI** – Clean, professional design with smooth transitions and micro-animations

## 🛠 Tech Stack

- **React 18** – UI Framework
- **Redux Toolkit** – State Architecture
- **React Router DOM 6** – Routing & Protection
- **Bootstrap 5** – Responsive Layout & Core UI
- **Bootstrap Icons** – Iconography
- **Vite** – High-speed Build Tool

## 🔐 Authentication (Mock Data)

The app is pre-configured with the following accounts for testing:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@school.ma` | `password` |
| **Professeur** | `teacher@school.ma` | `password` |

## 📂 Project Structure

```
absence-manager/
├── src/
│   ├── components/            # Reusable UI Components
│   │   ├── Navigation.jsx     # Dynamic Navbar (RBAC)
│   │   ├── ProtectedRoute.jsx # Route Guard
│   │   └── ...
│   ├── pages/                 # Full Page Views
│   │   ├── LoginPage.jsx      # Auth Entrance
│   │   ├── SaisiePage.jsx     # Bulk Entry Grid
│   │   └── ...
│   ├── store/                 # Redux State Management
│   │   ├── authSlice.jsx      # Auth & Roles Logic
│   │   ├── absenceSlice.jsx
│   │   └── ...
│   └── utils/
│       └── data.jsx           # Mock Data Generator
```

## ⚙️ Installation

```bash
# Clone
git clone https://github.com/0xsnowZ/absence-manager--redux.git
cd absence-manager--redux

# Install & Run
npm install
npm run dev
```

The app will launch at `http://localhost:5173/`. You will be automatically redirected to the Login page.

## License

This project is for educational purposes.
