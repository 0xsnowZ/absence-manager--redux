import { useState } from "react";
import { useSelector } from "react-redux";
import Statistics from "../components/Statistics.jsx";

// Statistics Page

function StatisticsPage() {
  const absences = useSelector((state) => state.absences.items);
  const stagiaires = useSelector((state) => state.stagiaires.items);
  const [selectedStagiaire, setSelectedStagiaire] = useState("");

  const getStagiaireAbsences = (stagiaireId) => {
    return absences.filter((a) => a.idstag === parseInt(stagiaireId));
  };

  const getStagiaireName = (id) => {
    const stagiaire = stagiaires.find((s) => s.id === id);
    return stagiaire ? stagiaire.nom : "Inconnu";
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR");
  };

  const selectedAbsences = selectedStagiaire
    ? getStagiaireAbsences(selectedStagiaire)
    : [];

  return (
    <div className="container py-4">
      <h2 className="mb-4">
        <i className="bi bi-graph-up me-2"></i>
        Statistiques et Rapports
      </h2>

      {/* Main Statistics */}
      <Statistics />

      {/* Absences by Stagiaire */}
      <div className="card mt-4">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">
            <i className="bi bi-person-lines-fill me-2"></i>
            Absences par Stagiaire
          </h5>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Sélectionner un stagiaire</label>
              <select
                className="form-select"
                value={selectedStagiaire}
                onChange={(e) => setSelectedStagiaire(e.target.value)}
              >
                <option value="">Choisir un stagiaire...</option>
                {stagiaires.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.filiere})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedStagiaire && (
            <div className="table-responsive">
              <h6 className="mb-3">
                Absences de{" "}
                <strong>{getStagiaireName(parseInt(selectedStagiaire))}</strong>
                <span className="badge bg-primary ms-2">
                  {selectedAbsences.length}
                </span>
              </h6>
              {selectedAbsences.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Ce stagiaire n'a aucune absence enregistrée.
                </div>
              ) : (
                <table className="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Heures</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAbsences.map((absence) => (
                      <tr key={absence.id}>
                        <td>{formatDate(absence.date)}</td>
                        <td>{absence.heures || 2}h</td>
                        <td>
                          {absence.justifie ? (
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i>
                              Justifiée
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              <i className="bi bi-x-circle me-1"></i>
                              Non justifiée
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-primary">
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>
                          {selectedAbsences.reduce(
                            (sum, a) => sum + (a.heures || 2),
                            0,
                          )}
                          h
                        </strong>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="card mt-4">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>
            Récapitulatif Global
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-secondary">
                <tr>
                  <th>Stagiaire</th>
                  <th>Filière</th>
                  <th>Total Absences</th>
                  <th>Justifiées</th>
                  <th>Non Justifiées</th>
                  <th>Total Heures</th>
                </tr>
              </thead>
              <tbody>
                {stagiaires.map((stagiaire) => {
                  const stagAbsences = absences.filter(
                    (a) => a.idstag === stagiaire.id,
                  );
                  const justified = stagAbsences.filter(
                    (a) => a.justifie,
                  ).length;
                  const unjustified = stagAbsences.filter(
                    (a) => !a.justifie,
                  ).length;
                  const hours = stagAbsences.reduce(
                    (sum, a) => sum + (a.heures || 2),
                    0,
                  );

                  return (
                    <tr key={stagiaire.id}>
                      <td>{stagiaire.nom}</td>
                      <td>
                        <span className="badge bg-info">
                          {stagiaire.filiere}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${stagAbsences.length > 0 ? "bg-warning" : "bg-success"}`}
                        >
                          {stagAbsences.length}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-success">{justified}</span>
                      </td>
                      <td>
                        <span className="badge bg-danger">{unjustified}</span>
                      </td>
                      <td>{hours}h</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="table-primary">
                <tr>
                  <td colSpan="2">
                    <strong>TOTAL</strong>
                  </td>
                  <td>
                    <strong>{absences.length}</strong>
                  </td>
                  <td>
                    <strong>{absences.filter((a) => a.justifie).length}</strong>
                  </td>
                  <td>
                    <strong>
                      {absences.filter((a) => !a.justifie).length}
                    </strong>
                  </td>
                  <td>
                    <strong>
                      {absences.reduce((sum, a) => sum + (a.heures || 2), 0)}h
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;
