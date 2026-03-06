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
    <div className="card border-0 shadow-lg overflow-hidden">
      <div className="card-header bg-dark text-white py-3">
        <h5 className="mb-0 fw-bold small text-uppercase tracking-wider">
          <i className="bi bi-person-plus-fill me-2"></i>
          {stagiaire ? "Modifier le Profil" : "Nouveau Stagiaire"}
        </h5>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold small text-muted text-uppercase">Nom Complet</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person text-primary"></i>
              </span>
              <input
                type="text"
                className={`form-control form-control-lg border-start-0 bg-light ${errors.nom ? "is-invalid" : ""}`}
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex: Ahmed Alami"
              />
            </div>
            {errors.nom && <div className="text-danger small mt-1">{errors.nom}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-muted text-uppercase">Filière / Classe</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-mortarboard text-primary"></i>
              </span>
              <input
                type="text"
                className={`form-control form-control-lg border-start-0 bg-light ${errors.filiere ? "is-invalid" : ""}`}
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
                placeholder="Ex: DD105"
              />
            </div>
            {errors.filiere && (
              <div className="text-danger small mt-1">{errors.filiere}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold small text-muted text-uppercase d-block mb-3">Genre</label>
            <div className="d-flex gap-4">
              <div className="form-check custom-radio">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexe"
                  id="sexeM"
                  value="m"
                  checked={formData.sexe === "m"}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-medium" htmlFor="sexeM">
                  <i className="bi bi-gender-male me-1 text-primary"></i>Masculin
                </label>
              </div>
              <div className="form-check custom-radio">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexe"
                  id="sexeF"
                  value="f"
                  checked={formData.sexe === "f"}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-medium" htmlFor="sexeF">
                  <i className="bi bi-gender-female me-1 text-danger"></i>Féminin
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 pt-3">
            <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center flex-grow-1 justify-content-center">
              <i className="bi bi-check-lg me-2 fs-5"></i>
              {stagiaire ? "Mettre à jour" : "Enregistrer"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold d-flex align-items-center"
              onClick={onCancel}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .tracking-wider { letter-spacing: 0.05em; }
        .custom-radio .form-check-input:checked { background-color: #0d6efd; border-color: #0d6efd; }
      `}</style>
    </div>
  );
}

export default StagiaireForm;
