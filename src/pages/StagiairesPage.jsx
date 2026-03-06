import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StagiaireForm from "../components/StagiaireForm.jsx";
import StagiaireList from "../components/StagiaireList.jsx";
import {
  addStagiaire,
  updateStagiaire,
  deleteStagiaire,
} from "../store/stagiaireSlice.jsx";

// Stagiaires Page

function StagiairesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingStagiaire, setEditingStagiaire] = useState(null);

  const handleEdit = (stagiaire) => {
    setEditingStagiaire(stagiaire);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingStagiaire(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingStagiaire(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStagiaire(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-1">
            <i className="bi bi-people-fill me-3 text-dark-navy"></i>
            Gestion des Stagiaires
          </h2>
          <p className="text-muted mb-0">Consultez, ajoutez ou modifiez les profils des stagiaires.</p>
        </div>
        {!showForm && (
          <button className="btn btn-dark-navy rounded-pill px-4 py-2 shadow-sm fw-bold d-flex align-items-center" onClick={handleAddNew}>
            <i className="bi bi-plus-lg me-2 fs-5"></i>
            Nouveau Stagiaire
          </button>
        )}
      </div>

      {showForm ? (
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <StagiaireForm
              stagiaire={editingStagiaire}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </div>
        </div>
      ) : (
        <StagiaireList onEdit={handleEdit} />
      )}
    </div>
  );
}

export default StagiairesPage;
