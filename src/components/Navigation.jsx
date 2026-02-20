import { useState } from "react";

// Navigation Component

function Navigation({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="#">
          <i className="bi bi-calendar-check me-2"></i>
          Gestion d'État des Absences
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "stagiaires" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("stagiaires");
                }}
              >
                <i className="bi bi-people me-1"></i>
                Stagiaires
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "absences" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("absences");
                }}
              >
                <i className="bi bi-calendar-x me-1"></i>
                Absences
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === "statistics" ? "active" : ""}`}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("statistics");
                }}
              >
                <i className="bi bi-graph-up me-1"></i>
                Statistiques
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
