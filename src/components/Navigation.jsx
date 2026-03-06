import React from "react";

// Navigation Component
function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "stagiaires", label: "Stagiaires", icon: "bi-people" },
    { id: "absences", label: "Absences", icon: "bi-calendar-x" },
    { id: "saisie", label: "Saisie", icon: "bi-pencil-square" },
    { id: "statistics", label: "Statistiques", icon: "bi-graph-up" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-3 mb-4">
      <div className="container">
        <a className="navbar-brand fw-bold d-flex align-items-center" href="#">
          <div className="bg-white text-primary p-2 rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-calendar-check-fill"></i>
          </div>
          <span className="tracking-tight">ABSENCE MANAGER</span>
        </a>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2 mt-3 mt-lg-0">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.id}>
                <a
                  className={`nav-link px-4 py-2 rounded-pill d-flex align-items-center transition-all ${activeTab === tab.id
                      ? "active bg-white text-primary fw-bold shadow-sm"
                      : "text-white opacity-75 hover-opacity-100"
                    }`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                >
                  <i className={`bi ${tab.icon} me-2`}></i>
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style>{`
        .navbar-brand { letter-spacing: -0.5px; }
        .nav-link { transition: all 0.3s ease; border: 1px solid transparent; }
        .nav-link:not(.active):hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); opacity: 1 !important; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </nav>
  );
}

export default Navigation;
