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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-people me-2"></i>
          Gestion des Stagiaires
        </h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            <i className="bi bi-plus-lg me-1"></i>
            Nouveau Stagiaire
          </button>
        )}
      </div>

      {showForm ? (
        <div className="row">
          <div className="col-md-6 mx-auto">
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
