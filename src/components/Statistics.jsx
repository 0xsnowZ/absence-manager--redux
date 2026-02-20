import { useSelector } from "react-redux";

// Statistics Component

function Statistics() {
  const absences = useSelector((state) => state.absences.items);
  const stagiaires = useSelector((state) => state.stagiaires.items);

  // Calculate statistics
  const totalAbsences = absences.length;
  const totalHeures = absences.reduce((sum, a) => sum + (a.heures || 2), 0);
  const justifiedAbsences = absences.filter((a) => a.justifie).length;
  const unjustifiedAbsences = absences.filter((a) => !a.justifie).length;
  const justifiedHeures = absences
    .filter((a) => a.justifie)
    .reduce((sum, a) => sum + (a.heures || 2), 0);
  const unjustifiedHeures = absences
    .filter((a) => !a.justifie)
    .reduce((sum, a) => sum + (a.heures || 2), 0);

  // Get stagiaires with most absences
  const stagiaireAbsences = stagiaires
    .map((s) => {
      const stagAbsences = absences.filter((a) => a.idstag === s.id);
      return {
        ...s,
        absenceCount: stagAbsences.length,
        totalHeures: stagAbsences.reduce((sum, a) => sum + (a.heures || 2), 0),
      };
    })
    .sort((a, b) => b.absenceCount - a.absenceCount)
    .slice(0, 5);

  return (
    <div>
      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card stat-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Absences</h6>
                  <h3 className="mb-0">{totalAbsences}</h3>
                  <small className="text-muted">{totalHeures} heures</small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-calendar-x fs-3 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card stat-card justified">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Justifiées</h6>
                  <h3 className="mb-0 text-success">{justifiedAbsences}</h3>
                  <small className="text-muted">{justifiedHeures} heures</small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-check-circle fs-3 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card stat-card unjustified">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Non Justifiées</h6>
                  <h3 className="mb-0 text-danger">{unjustifiedAbsences}</h3>
                  <small className="text-muted">
                    {unjustifiedHeures} heures
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded">
                  <i className="bi bi-x-circle fs-3 text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">
            <i className="bi bi-pie-chart me-2"></i>
            Répartition des Absences
          </h5>
        </div>
        <div className="card-body">
          {totalAbsences > 0 ? (
            <>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Justifiées</span>
                  <span>
                    {Math.round((justifiedAbsences / totalAbsences) * 100)}%
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{
                      width: `${(justifiedAbsences / totalAbsences) * 100}%`,
                    }}
                  >
                    {justifiedAbsences}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Non Justifiées</span>
                  <span>
                    {Math.round((unjustifiedAbsences / totalAbsences) * 100)}%
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{
                      width: `${(unjustifiedAbsences / totalAbsences) * 100}%`,
                    }}
                  >
                    {unjustifiedAbsences}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-muted text-center mb-0">
              Aucune absence enregistrée
            </p>
          )}
        </div>
      </div>

      {/* Top Stagiaires with Absences */}
      <div className="card">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">
            <i className="bi bi-trophy me-2"></i>
            Stagiaires avec le plus d'absences
          </h5>
        </div>
        <div className="card-body">
          {stagiaireAbsences.filter((s) => s.absenceCount > 0).length === 0 ? (
            <p className="text-muted text-center mb-0">
              Aucune absence enregistrée
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Rang</th>
                    <th>Stagiaire</th>
                    <th>Filière</th>
                    <th>Nb Absences</th>
                    <th>Heures</th>
                  </tr>
                </thead>
                <tbody>
                  {stagiaireAbsences
                    .filter((s) => s.absenceCount > 0)
                    .map((s, index) => (
                      <tr key={s.id}>
                        <td>
                          {index === 0 && (
                            <i className="bi bi-trophy-fill text-warning me-1"></i>
                          )}
                          #{index + 1}
                        </td>
                        <td>{s.nom}</td>
                        <td>
                          <span className="badge bg-info">{s.filiere}</span>
                        </td>
                        <td>
                          <span className="badge bg-danger">
                            {s.absenceCount}
                          </span>
                        </td>
                        <td>{s.totalHeures}h</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
