import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteStagiaire } from "../store/stagiaireSlice.jsx";

// Stagiaire List Component

function StagiaireList({ onEdit }) {
  const dispatch = useDispatch();
  const stagiaires = useSelector((state) => state.stagiaires.items);
  const absences = useSelector((state) => state.absences.items);
  const [searchTerm, setSearchTerm] = useState("");

  const getAbsenceCount = (stagiaireId) => {
    return absences.filter((a) => a.idstag === stagiaireId).length;
  };

  const filteredStagiaires = stagiaires.filter(
    (s) =>
      s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.filiere.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce stagiaire ?")) {
      dispatch(deleteStagiaire(id));
      // Also delete related absences
      const relatedAbsences = absences.filter((a) => a.idstag === id);
      relatedAbsences.forEach((a) => dispatch(deleteAbsence(a.id)));
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-people me-2"></i>
          Liste des Stagiaires
        </h5>
        <span className="badge bg-light text-primary">
          {filteredStagiaires.length}
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
              placeholder="Rechercher par nom ou filière..."
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
                <th>Nom</th>
                <th>Filière</th>
                <th>Sexe</th>
                <th>Absences</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStagiaires.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    Aucun stagiaire trouvé
                  </td>
                </tr>
              ) : (
                filteredStagiaires.map((stagiaire) => (
                  <tr key={stagiaire.id}>
                    <td>{stagiaire.id}</td>
                    <td>
                      <i
                        className={`bi bi-person${stagiaire.sexe === "f" ? "-fill" : ""} me-2 ${stagiaire.sexe === "f" ? "text-danger" : "text-primary"}`}
                      ></i>
                      {stagiaire.nom}
                    </td>
                    <td>
                      <span className="badge bg-info">{stagiaire.filiere}</span>
                    </td>
                    <td>
                      {stagiaire.sexe === "m" ? (
                        <span>
                          <i className="bi bi-gender-male me-1"></i>M
                        </span>
                      ) : (
                        <span>
                          <i className="bi bi-gender-female me-1"></i>F
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${getAbsenceCount(stagiaire.id) > 0 ? "bg-warning" : "bg-success"}`}
                      >
                        {getAbsenceCount(stagiaire.id)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary btn-action me-1"
                        onClick={() => onEdit(stagiaire)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger btn-action"
                        onClick={() => handleDelete(stagiaire.id)}
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

export default StagiaireList;
