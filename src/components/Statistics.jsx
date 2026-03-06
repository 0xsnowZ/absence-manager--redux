import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Statistics Component

function Statistics() {
  const absences = useSelector((state) => state.absences.items);
  const stagiaires = useSelector((state) => state.stagiaires.items);

  const [filiere, setFiliere] = useState("");
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7); // Default to last 7 days
    return [start, end];
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const filieres = useMemo(() => {
    return [...new Set(stagiaires.map((s) => s.filiere))];
  }, [stagiaires]);

  const filteredStagiaires = useMemo(() => {
    if (!filiere) return [];
    return stagiaires.filter((s) => s.filiere === filiere);
  }, [stagiaires, filiere]);

  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    if (!startDate || !endDate) return dates;
    let current = new Date(startDate.getTime());
    current.setHours(0, 0, 0, 0);
    const end = new Date(endDate.getTime());
    end.setHours(0, 0, 0, 0);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const dateColumns = useMemo(() => {
    if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      return getDatesInRange(dateRange[0], dateRange[1]);
    }
    return [];
  }, [dateRange]);

  const formatStoreDate = (d) => {
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  // Map to easily look up absences by stagiaire and date
  const absenceMap = useMemo(() => {
    const map = {};
    absences.forEach((a) => {
      const key = `${a.idstag}_${a.date}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(a);
    });
    return map;
  }, [absences]);

  // Calculate statistics
  const totalAbsences = absences.length;
  const totalHeures = absences.reduce((sum, a) => sum + (a.heures || 2.5), 0);
  const justifiedAbsences = absences.filter((a) => a.justifie).length;
  const unjustifiedAbsences = absences.filter((a) => !a.justifie).length;
  const justifiedHeures = absences
    .filter((a) => a.justifie)
    .reduce((sum, a) => sum + (a.heures || 2.5), 0);
  const unjustifiedHeures = absences
    .filter((a) => !a.justifie)
    .reduce((sum, a) => sum + (a.heures || 2.5), 0);

  // Get most recent absences
  const lastAbsences = [...absences]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const getStagiaireInfo = (idstag) => {
    const s = stagiaires.find((st) => st.id === idstag);
    return s ? s : { nom: "Inconnu", filiere: "-" };
  };

  return (
    <div className="stats-container">
      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden transition-all hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-dark-navy text-white rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px", flexShrink: 0 }}
                >
                  <i className="bi bi-calendar-x-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0 small fw-bold text-uppercase tracking-wider">
                    Total des absences
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1">{totalAbsences}</h3>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge rounded-pill bg-light text-dark-navy border px-3 py-1 fw-bold">
                  {totalHeures} heures totales
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden transition-all hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-soft-success text-success rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px", flexShrink: 0 }}
                >
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0 small fw-bold text-uppercase tracking-wider">
                    Justifiées
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1 text-success">
                    {justifiedAbsences}
                  </h3>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge rounded-pill bg-soft-success text-success border border-success px-3 py-1 fw-bold">
                  {justifiedHeures}h validées
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 overflow-hidden transition-all hover-lift">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-soft-danger text-danger rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px", flexShrink: 0 }}
                >
                  <i className="bi bi-x-circle-fill fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-0 small fw-bold text-uppercase tracking-wider">
                    Non Justifiées
                  </h6>
                  <h3 className="fw-bold mb-0 mt-1 text-danger">
                    {unjustifiedAbsences}
                  </h3>
                </div>
              </div>
              <div className="mt-2">
                <span className="badge rounded-pill bg-soft-danger text-danger border border-danger px-3 py-1 fw-bold">
                  {unjustifiedHeures}h à régulariser
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Ranking Grid */}
      <div className="row g-4 mb-5">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom-0 d-flex align-items-center">
              <div
                className="bg-info text-white rounded-circle me-3 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: "48px", height: "48px", flexShrink: 0 }}
              >
                <i className="bi bi-pie-chart-fill"></i>
              </div>
              <h5 className="mb-0 fw-bold">Répartition Analytique</h5>
            </div>
            <div className="card-body pt-0">
              {totalAbsences > 0 ? (
                <div className="px-2">
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold small text-muted text-uppercase">
                        Taux de justification
                      </span>
                      <span className="badge bg-soft-success text-success rounded-pill px-3">
                        {Math.round((justifiedAbsences / totalAbsences) * 100)}%
                      </span>
                    </div>
                    <div
                      className="progress rounded-pill shadow-none border"
                      style={{ height: "12px" }}
                    >
                      <div
                        className="progress-bar bg-success rounded-pill"
                        role="progressbar"
                        style={{
                          width: `${(justifiedAbsences / totalAbsences) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-bold small text-muted text-uppercase">
                        Taux d'irrégularité
                      </span>
                      <span className="badge bg-soft-danger text-danger rounded-pill px-3">
                        {Math.round(
                          (unjustifiedAbsences / totalAbsences) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div
                      className="progress rounded-pill shadow-none border"
                      style={{ height: "12px" }}
                    >
                      <div
                        className="progress-bar bg-danger rounded-pill"
                        role="progressbar"
                        style={{
                          width: `${(unjustifiedAbsences / totalAbsences) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-4 border-bottom-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                <div
                  className="bg-soft-danger text-danger rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px", flexShrink: 0 }}
                >
                  <i className="bi bi-trophy-fill"></i>
                </div>
                Dernières absences
              </h5>
            </div>
            <div className="card-body pt-0">
              {lastAbsences.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                  Aucun record d'absence
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle custom-table">
                    <thead className="bg-light text-muted small text-uppercase fw-bold">
                      <tr>
                        <th className="ps-3 border-0">Date</th>
                        <th className="border-0">Stagiaire</th>
                        <th className="border-0 text-center">Heures</th>
                        <th className="border-0 text-center pe-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastAbsences.map((absence) => {
                        const stag = getStagiaireInfo(absence.idstag);
                        const date = new Date(absence.date).toLocaleDateString(
                          "fr-FR",
                        );
                        return (
                          <tr key={absence.id}>
                            <td className="ps-3 fw-medium text-muted">
                              <i className="bi bi-calendar3 me-2 text-dark-navy opacity-50"></i>
                              {date}
                            </td>
                            <td>
                              <span className="fw-bold text-dark d-block mb-0">
                                {stag.nom}
                              </span>
                              <small className="text-muted">
                                {stag.filiere}
                              </small>
                            </td>
                            <td className="text-center fw-bold text-dark">
                              {absence.heures || 2.5}h
                            </td>
                            <td className="text-center pe-3">
                              {absence.justifie ? (
                                <span className="badge rounded-pill bg-soft-success text-success px-3 py-1 border border-success">
                                  Justifiée
                                </span>
                              ) : (
                                <span className="badge rounded-pill bg-soft-danger text-danger px-3 py-1 border border-danger">
                                  Non justifiée
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar History Section */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-white py-4 border-bottom-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
            <div
              className="bg-dark-navy text-white rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{ width: "48px", height: "48px", flexShrink: 0 }}
            >
              <i className="bi bi-calendar3-range-fill"></i>
            </div>
            Historique du Calendrier
          </h5>
        </div>
        <div className="card-body bg-light border-bottom">
          <div className="row g-4 align-items-end">
            <div className="col-lg-5">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Classe / Filière
              </label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-mortarboard-fill text-dark-navy"></i>
                </span>
                <select
                  className="form-select border-start-0"
                  value={filiere}
                  onChange={(e) => setFiliere(e.target.value)}
                >
                  <option value="">Sélectionner une filière</option>
                  {filieres.map((f, i) => (
                    <option key={i} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-lg-7">
              <label className="form-label fw-bold small text-muted text-uppercase">
                Période d'affichage
              </label>
              <div className="position-relative">
                <button
                  className="btn btn-white border bg-white btn-lg w-100 d-flex justify-content-between align-items-center shadow-sm"
                  onClick={() => setShowCalendar(!showCalendar)}
                  type="button"
                >
                  <span className="text-dark">
                    <i className="bi bi-calendar-check-fill me-2 text-dark-navy"></i>
                    {dateRange?.[0]
                      ? dateRange[0].toLocaleDateString("fr-FR")
                      : "Début"}
                    <span className="mx-2 text-muted">➟</span>
                    {dateRange?.[1]
                      ? dateRange[1].toLocaleDateString("fr-FR")
                      : "Fin"}
                  </span>
                  <i
                    className={`bi bi-chevron-${showCalendar ? "up" : "down"} text-muted`}
                  ></i>
                </button>

                {showCalendar && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white p-3 border rounded shadow-lg"
                    style={{ minWidth: "350px", zIndex: 1050 }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                      <span className="fw-bold small text-muted">
                        CHOISIR LA PLAGE
                      </span>
                      <button
                        className="btn-close btn-sm"
                        onClick={() => setShowCalendar(false)}
                      ></button>
                    </div>
                    <Calendar
                      onChange={(val) => {
                        setDateRange(val);
                        if (val && val.length === 2 && val[0] && val[1])
                          setShowCalendar(false);
                      }}
                      selectRange={true}
                      value={dateRange}
                      className="border-0 w-100"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {dateColumns.length > 0 && filiere ? (
          filteredStagiaires.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0 align-middle professional-grid">
                <thead>
                  <tr className="bg-white">
                    <th
                      className="ps-4 border-bottom-0 pb-3 pt-3 sticky-col"
                      style={{ width: "240px", zIndex: 10 }}
                    >
                      NOM DU STAGIAIRE
                    </th>
                    {dateColumns.map((d, index) => (
                      <th
                        key={index}
                        className="text-center py-2 border-bottom-0"
                        style={{ minWidth: "60px", backgroundColor: "#f8f9fa" }}
                      >
                        <div
                          className="text-uppercase text-muted lh-1 mb-1"
                          style={{ fontSize: "0.6rem" }}
                        >
                          {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                        </div>
                        <div className="fw-bold text-dark">
                          {d.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStagiaires.map((stagiaire) => (
                    <tr key={stagiaire.id} className="hover-row">
                      <td className="ps-4 fw-bold text-dark border-end-heavy sticky-col bg-white">
                        {stagiaire.nom}
                      </td>
                      {dateColumns.map((d, dIdx) => {
                        const dateStr = formatStoreDate(d);
                        const key = `${stagiaire.id}_${dateStr}`;
                        const dayAbsences = absenceMap[key] || [];
                        const totalHours = dayAbsences.reduce(
                          (sum, a) => sum + (a.heures || 2.5),
                          0,
                        );
                        const allJustified =
                          dayAbsences.length > 0 &&
                          dayAbsences.every((a) => a.justifie);

                        let cellClass = "";
                        let cellContent = null;

                        if (totalHours > 0) {
                          cellClass = allJustified
                            ? "is-justified"
                            : "is-absent";
                          cellContent = `${totalHours}h`;
                        } else {
                          cellContent = (
                            <span className="text-muted opacity-25">-</span>
                          );
                        }

                        return (
                          <td
                            key={dIdx}
                            className={`text-center p-0 cell-slot ${cellClass}`}
                            style={{ height: "48px" }}
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 bg-white">
              <h5 className="text-muted">
                Aucun stagiaire trouvé pour cette filière
              </h5>
            </div>
          )
        ) : (
          <div className="text-center py-5 bg-white">
            <h5 className="text-muted">
              <i className="bi bi-info-circle me-2"></i>Sélectionnez une filière
              pour afficher l'historique
            </h5>
          </div>
        )}
      </div>

      <style>{`
        .bg-dark-navy { background-color: #0A121A; }
        .text-dark-navy { color: #0A121A; }
        .bg-soft-primary { background-color: #f0f7ff; }
        .bg-soft-danger { background-color: #fff1f1; }
        .bg-soft-success { background-color: #f0fff4; }
        .bg-soft-warning { background-color: #fffbf0; }
        .tracking-wider { letter-spacing: 0.05em; }
        .hover-lift { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-lift:hover { transform: translateY(-5px); }
        .custom-table tbody tr { border-color: #f8f9fa; }
        .custom-table tbody tr:last-child { border-bottom: none; }
        .card { border: 1px solid rgba(0,0,0,0.05) !important; }
        .professional-grid { border-collapse: collapse; width: 100%; border: 1px solid #ced4da; }
        .professional-grid th, .professional-grid td { border: 1px solid #adb5bd !important; }
        .border-end-heavy { border-right: 3px solid #495057 !important; }
        .sticky-col { position: sticky; left: 0; z-index: 5; background-color: #fff !important; }
        .cell-slot { position: relative; vertical-align: middle; }
        .is-absent { background-color: #fceaea !important; color: #dc3545; font-weight: bold; }
        .is-justified { background-color: #e6f9ed !important; color: #198754; font-weight: bold; }
        .hover-row:hover .sticky-col { background-color: #f8f9fa !important; }
        .hover-row:hover td { background-color: rgba(0,0,0,0.01); }
      `}</style>
    </div>
  );
}

export default Statistics;
