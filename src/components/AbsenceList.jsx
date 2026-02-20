import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteAbsence } from "../store/absenceSlice.jsx";

// Absence List Component

function AbsenceList({
  onEdit,
  filterType = "all",
  dateFilter = null,
  periodFilter = null,
  stagiaireFilter = null,
}) {
  const dispatch = useDispatch();
  const absences = useSelector((state) => state.absences.items);
  const stagiaires = useSelector((state) => state.stagiaires.items);
  const [searchTerm, setSearchTerm] = useState("");

  const getStagiaireName = (id) => {
    const stagiaire = stagiaires.find((s) => s.id === id);
    return stagiaire ? stagiaire.nom : "Inconnu";
  };

  const getStagiaireFiliere = (id) => {
    const stagiaire = stagiaires.find((s) => s.id === id);
    return stagiaire ? stagiaire.filiere : "-";
  };

  const filteredAbsences = absences.filter((absence) => {
    // Filter by justification type
    if (filterType === "justified" && !absence.justifie) return false;
    if (filterType === "unjustified" && absence.justifie) return false;

    // Filter by specific date
    if (dateFilter && absence.date !== dateFilter) return false;

    // Filter by period
    if (periodFilter) {
      const { startDate, endDate } = periodFilter;
      if (startDate && absence.date < startDate) return false;
      if (endDate && absence.date > endDate) return false;
    }

    // Filter by stagiaire
    if (stagiaireFilter && absence.idstag !== parseInt(stagiaireFilter))
      return false;

    // Filter by search term
    if (searchTerm) {
      const stagiaireName = getStagiaireName(absence.idstag).toLowerCase();
      return stagiaireName.includes(searchTerm.toLowerCase());
    }

    return true;
  });

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette absence ?")) {
      dispatch(deleteAbsence(id));
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-calendar-x me-2"></i>
          Liste des Absences
        </h5>
        <span className="badge bg-light text-primary">
          {filteredAbsences.length}
        </span>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher par nom de stagiaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Stagiaire</th>
                <th>Filière</th>
                <th>Date</th>
                <th>Heures</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAbsences.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    Aucune absence trouvée
                  </td>
                </tr>
              ) : (
                filteredAbsences.map((absence) => (
                  <tr key={absence.id}>
                    <td>{absence.id}</td>
                    <td>
                      <i className="bi bi-person me-2"></i>
                      {getStagiaireName(absence.idstag)}
                    </td>
                    <td>
                      <span className="badge bg-info">
                        {getStagiaireFiliere(absence.idstag)}
                      </span>
                    </td>
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
                    <td>
                      <button
                        className="btn btn-sm btn-primary btn-action me-1"
                        onClick={() => onEdit(absence)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger btn-action"
                        onClick={() => handleDelete(absence.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AbsenceList;
