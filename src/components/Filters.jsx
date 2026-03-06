import { useState } from "react";
import { useSelector } from "react-redux";

// Filters Component

function Filters({ onFilterChange }) {
  const stagiaires = useSelector((state) => state.stagiaires.items);
  const [filterType, setFilterType] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stagiaireFilter, setStagiaireFilter] = useState("");
  const [filiereFilter, setFiliereFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  // Extract unique filières
  const filieres = [...new Set(stagiaires.map((s) => s.filiere))];

  const applyFilters = () => {
    const filters = {
      filterType,
      dateFilter: dateFilter || null,
      periodFilter: startDate || endDate ? { startDate, endDate } : null,
      stagiaireFilter: stagiaireFilter || null,
      filiereFilter: filiereFilter || null,
    };

    const active = [];
    if (filterType !== "all")
      active.push(filterType === "justified" ? "Justifiées" : "Non justifiées");
    if (dateFilter) active.push(`Date: ${dateFilter}`);
    if (startDate || endDate)
      active.push(`Période: ${startDate || "..."} à ${endDate || "..."}`);
    if (stagiaireFilter) {
      const stag = stagiaires.find((s) => s.id === parseInt(stagiaireFilter));
      if (stag) active.push(`Stagiaire: ${stag.nom}`);
    }
    if (filiereFilter) active.push(`Filière: ${filiereFilter}`);

    setActiveFilters(active);
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilterType("all");
    setDateFilter("");
    setStartDate("");
    setEndDate("");
    setStagiaireFilter("");
    setFiliereFilter("");
    setActiveFilters([]);
    onFilterChange({
      filterType: "all",
      dateFilter: null,
      periodFilter: null,
      stagiaireFilter: null,
      filiereFilter: null,
    });
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold small text-uppercase tracking-wider">
          <i className="bi bi-funnel-fill me-2"></i>
          Filtrer les Résultats
        </h5>
      </div>
      <div className="card-body p-4">
        {/* Filter by Justification */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-muted text-uppercase">Type d'absence</label>
          <select
            className="form-select bg-light border-0"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Toutes les absences</option>
            <option value="justified">Justifiées uniquement</option>
            <option value="unjustified">Non justifiées uniquement</option>
          </select>
        </div>

        {/* Filter by Date */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-muted text-uppercase">Date précise</label>
          <input
            type="date"
            className="form-control bg-light border-0"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Filter by Period */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-muted text-uppercase">Période d'analyse</label>
          <div className="row g-2">
            <div className="col-6">
              <input
                type="date"
                className="form-control bg-light border-0"
                placeholder="Du"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-6">
              <input
                type="date"
                className="form-control bg-light border-0"
                placeholder="Au"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter by Stagiaire */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-muted text-uppercase">Stagiaire</label>
          <select
            className="form-select bg-light border-0"
            value={stagiaireFilter}
            onChange={(e) => setStagiaireFilter(e.target.value)}
          >
            <option value="">Tous les stagiaires</option>
            {stagiaires.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom} ({s.filiere})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Filière */}
        <div className="mb-4">
          <label className="form-label fw-bold small text-muted text-uppercase">Filière</label>
          <select
            className="form-select bg-light border-0"
            value={filiereFilter}
            onChange={(e) => setFiliereFilter(e.target.value)}
          >
            <option value="">Toutes les filières</option>
            {filieres.map((f, index) => (
              <option key={index} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="d-grid gap-2 mt-4">
          <button className="btn btn-primary rounded-pill fw-bold py-2 shadow-sm" onClick={applyFilters}>
            <i className="bi bi-check2-circle me-2"></i>
            Appliquer les filtres
          </button>
          <button className="btn btn-outline-secondary rounded-pill fw-bold py-2" onClick={clearFilters}>
            Réinitialiser
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4 pt-3 border-top">
            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Filtres actifs:</small>
            <div className="d-flex flex-wrap gap-1 mt-2">
              {activeFilters.map((filter, index) => (
                <span key={index} className="badge rounded-pill bg-soft-primary text-primary px-3 border shadow-none" style={{ fontSize: '0.7rem' }}>
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .bg-soft-primary { background-color: #e7f1ff; }
        .tracking-wider { letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
}

export default Filters;
