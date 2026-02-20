# Absence Manager - Redux

A React-based application for managing intern (stagiaire) absences, built with **React**, **Redux Toolkit**, and **Bootstrap 5**.

## Features

- **Stagiaire Management** – Add, edit, and delete interns with name, filière, and gender details
- **Absence Tracking** – Record absences with date, hours, and justified/unjustified status
- **Filtering** – Filter absences by type, date, period, or specific stagiaire
- **Statistics** – View detailed absence statistics including totals, justified/unjustified breakdown, and per-stagiaire analytics

## Tech Stack

- **React 18** – UI library
- **Redux Toolkit** – State management
- **React-Redux** – React bindings for Redux
- **Bootstrap 5** – Styling & responsive layout
- **Bootstrap Icons** – Icon set
- **Vite** – Build tool & dev server

## Project Structure

```
absence-manager/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── index.jsx              # Entry point
    ├── App.jsx                # Main app component
    ├── components/
    │   ├── AbsenceForm.jsx    # Form to add/edit absences
    │   ├── AbsenceList.jsx    # Table listing all absences
    │   ├── Filters.jsx        # Absence filter controls
    │   ├── Navigation.jsx     # Top navbar
    │   ├── StagiaireForm.jsx  # Form to add/edit stagiaires
    │   ├── StagiaireList.jsx  # Table listing all stagiaires
    │   └── Statistics.jsx     # Statistics dashboard
    ├── pages/
    │   ├── AbsencesPage.jsx   # Absences page layout
    │   ├── StagiairesPage.jsx # Stagiaires page layout
    │   └── StatisticsPage.jsx # Statistics page layout
    ├── store/
    │   ├── absenceSlice.jsx   # Redux slice for absences
    │   ├── stagiaireSlice.jsx # Redux slice for stagiaires
    │   └── store.jsx          # Redux store configuration
    └── utils/
        └── data.jsx           # Initial seed data
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
git clone https://github.com/0xsnowZ/absence-manager--redux.git
cd absence-manager--redux
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Build for Production

```bash
npm run build
npm run preview
```

## License

This project is for educational purposes.
