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
  const [activeFilters, setActiveFilters] = useState([]);

  const applyFilters = () => {
    const filters = {
      filterType,
      dateFilter: dateFilter || null,
      periodFilter: startDate || endDate ? { startDate, endDate } : null,
      stagiaireFilter: stagiaireFilter || null,
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

    setActiveFilters(active);
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilterType("all");
    setDateFilter("");
    setStartDate("");
    setEndDate("");
    setStagiaireFilter("");
    setActiveFilters([]);
    onFilterChange({
      filterType: "all",
      dateFilter: null,
      periodFilter: null,
      stagiaireFilter: null,
    });
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-funnel me-2"></i>
          Filtres
        </h5>
      </div>
      <div className="card-body">
        {/* Filter by Justification */}
        <div className="mb-3">
          <label className="form-label">Type d'absence</label>
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="justified">Justifiées</option>
            <option value="unjustified">Non justifiées</option>
          </select>
        </div>

        {/* Filter by Date */}
        <div className="mb-3">
          <label className="form-label">Date spécifique</label>
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Filter by Period */}
        <div className="mb-3">
          <label className="form-label">Période</label>
          <div className="row">
            <div className="col-6">
              <input
                type="date"
                className="form-control"
                placeholder="Du"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-6">
              <input
                type="date"
                className="form-control"
                placeholder="Au"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter by Stagiaire */}
        <div className="mb-3">
          <label className="form-label">Stagiaire</label>
          <select
            className="form-select"
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

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={applyFilters}>
            <i className="bi bi-funnel-fill me-1"></i>
            Appliquer
          </button>
          <button className="btn btn-secondary" onClick={clearFilters}>
            <i className="bi bi-x-circle me-1"></i>
            Effacer
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-3">
            <small className="text-muted">Filtres actifs:</small>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {activeFilters.map((filter, index) => (
                <span key={index} className="badge bg-info">
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filters;
