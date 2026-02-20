import { useState } from "react";
import Navigation from "./components/Navigation.jsx";
import StagiairesPage from "./pages/StagiairesPage.jsx";
import AbsencesPage from "./pages/AbsencesPage.jsx";
import StatisticsPage from "./pages/StatisticsPage.jsx";

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState("stagiaires");

  const renderContent = () => {
    switch (activeTab) {
      case "stagiaires":
        return <StagiairesPage />;
      case "absences":
        return <AbsencesPage />;
      case "statistics":
        return <StatisticsPage />;
      default:
        return <StagiairesPage />;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>{renderContent()}</main>
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <small>
            <i className="bi bi-calendar-check me-2"></i>
            Gestion d'État des Absences - Projet React Redux
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
