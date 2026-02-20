import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AbsenceForm from "../components/AbsenceForm.jsx";
import AbsenceList from "../components/AbsenceList.jsx";
import Filters from "../components/Filters.jsx";
import {
  addAbsence,
  updateAbsence,
  deleteAbsence,
} from "../store/absenceSlice.jsx";

// Absences Page

function AbsencesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingAbsence, setEditingAbsence] = useState(null);
  const [filters, setFilters] = useState({
    filterType: "all",
    dateFilter: null,
    periodFilter: null,
    stagiaireFilter: null,
  });

  const handleEdit = (absence) => {
    setEditingAbsence(absence);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAbsence(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingAbsence(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAbsence(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-calendar-x me-2"></i>
          Gestion des Absences
        </h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddNew}>
            <i className="bi bi-plus-lg me-1"></i>
            Nouvelle Absence
          </button>
        )}
      </div>

      {showForm ? (
        <div className="row">
          <div className="col-md-6 mx-auto">
            <AbsenceForm
              absence={editingAbsence}
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-3 mb-4">
            <Filters onFilterChange={handleFilterChange} />
          </div>
          <div className="col-md-9">
            <AbsenceList
              onEdit={handleEdit}
              filterType={filters.filterType}
              dateFilter={filters.dateFilter}
              periodFilter={filters.periodFilter}
              stagiaireFilter={filters.stagiaireFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AbsencesPage;
