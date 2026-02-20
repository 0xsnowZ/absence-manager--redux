import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addStagiaire, updateStagiaire } from "../store/stagiaireSlice.jsx";

// Stagiaire Form Component

function StagiaireForm({ stagiaire, onCancel, onSave }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    nom: "",
    filiere: "",
    sexe: "m",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (stagiaire) {
      setFormData({
        nom: stagiaire.nom || "",
        filiere: stagiaire.filiere || "",
        sexe: stagiaire.sexe || "m",
      });
    }
  }, [stagiaire]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    if (!formData.filiere.trim()) {
      newErrors.filiere = "La filière est requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (stagiaire) {
        dispatch(updateStagiaire({ ...stagiaire, ...formData }));
      } else {
        dispatch(addStagiaire(formData));
      }
      onSave();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-person-plus me-2"></i>
          {stagiaire ? "Modifier Stagiaire" : "Nouveau Stagiaire"}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nom</label>
            <input
              type="text"
              className={`form-control ${errors.nom ? "is-invalid" : ""}`}
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Entrez le nom"
            />
            {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Filière</label>
            <input
              type="text"
              className={`form-control ${errors.filiere ? "is-invalid" : ""}`}
              name="filiere"
              value={formData.filiere}
              onChange={handleChange}
              placeholder="Ex: DD101"
            />
            {errors.filiere && (
              <div className="invalid-feedback">{errors.filiere}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Sexe</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexe"
                  id="sexeM"
                  value="m"
                  checked={formData.sexe === "m"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="sexeM">
                  <i className="bi bi-gender-male me-1"></i>Masculin
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexe"
                  id="sexeF"
                  value="f"
                  checked={formData.sexe === "f"}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="sexeF">
                  <i className="bi bi-gender-female me-1"></i>Féminin
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-lg me-1"></i>
              {stagiaire ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              <i className="bi bi-x-lg me-1"></i>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StagiaireForm;
