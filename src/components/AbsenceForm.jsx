import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAbsence, updateAbsence } from "../store/absenceSlice.jsx";

// Absence Form Component

function AbsenceForm({ absence, onCancel, onSave }) {
  const dispatch = useDispatch();
  const stagiaires = useSelector((state) => state.stagiaires.items);

  const [formData, setFormData] = useState({
    idstag: "",
    date: "",
    justifie: false,
    heures: 2,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (absence) {
      setFormData({
        idstag: absence.idstag.toString(),
        date: absence.date,
        justifie: absence.justifie,
        heures: absence.heures || 2,
      });
    } else if (stagiaires.length > 0) {
      setFormData((prev) => ({
        ...prev,
        idstag: stagiaires[0].id.toString(),
      }));
    }
  }, [absence, stagiaires]);

  const validate = () => {
    const newErrors = {};
    if (!formData.idstag) {
      newErrors.idstag = "Veuillez sélectionner un stagiaire";
    }
    if (!formData.date) {
      newErrors.date = "La date est requise";
    }
    if (!formData.heures || formData.heures < 1) {
      newErrors.heures = "Le nombre d'heures doit être au moins 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const data = {
        ...formData,
        idstag: parseInt(formData.idstag),
        heures: parseInt(formData.heures),
      };

      if (absence) {
        dispatch(updateAbsence({ ...absence, ...data }));
      } else {
        dispatch(addAbsence(data));
      }
      onSave();
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  if (stagiaires.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-4">
          <i className="bi bi-exclamation-triangle fs-1 text-warning mb-2"></i>
          <p className="mb-0">Veuillez d'abord ajouter des stagiaires.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-calendar-plus me-2"></i>
          {absence ? "Modifier Absence" : "Nouvelle Absence"}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Stagiaire</label>
            <select
              className={`form-select ${errors.idstag ? "is-invalid" : ""}`}
              name="idstag"
              value={formData.idstag}
              onChange={handleChange}
            >
              <option value="">Sélectionner un stagiaire</option>
              {stagiaires.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom} ({s.filiere})
                </option>
              ))}
            </select>
            {errors.idstag && (
              <div className="invalid-feedback">{errors.idstag}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className={`form-control ${errors.date ? "is-invalid" : ""}`}
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && (
              <div className="invalid-feedback">{errors.date}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Nombre d'heures</label>
            <input
              type="number"
              min="1"
              max="8"
              className={`form-control ${errors.heures ? "is-invalid" : ""}`}
              name="heures"
              value={formData.heures}
              onChange={handleChange}
            />
            {errors.heures && (
              <div className="invalid-feedback">{errors.heures}</div>
            )}
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="justifie"
                id="justifie"
                checked={formData.justifie}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="justifie">
                <i className="bi bi-check-circle-fill text-success me-1"></i>
                Absence justifiée
              </label>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              <i className="bi bi-check-lg me-1"></i>
              {absence ? "Modifier" : "Ajouter"}
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

export default AbsenceForm;
