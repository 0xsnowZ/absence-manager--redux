import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { addAbsence } from "../store/absenceSlice.jsx";

// Saisie Page
function SaisiePage() {
    const dispatch = useDispatch();
    const stagiaires = useSelector((state) => state.stagiaires.items);

    // Date range: [startDate, endDate]
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [filiere, setFiliere] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    // saisieData: { [`${stagId}|${dateStr}|${slotId}`]: boolean }
    const [saisieData, setSaisieData] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const slots = [
        { id: 1, label: "08:30-10:30", short: "S1" },
        { id: 2, label: "10:30-12:30", short: "S2" },
        { id: 3, label: "13:30-15:30", short: "S3" },
        { id: 4, label: "15:30-17:30", short: "S4" }
    ];

    const filieres = useMemo(() => {
        return [...new Set(stagiaires.map((s) => s.filiere))];
    }, [stagiaires]);

    const filteredStagiaires = useMemo(() => {
        if (!filiere) return [];
        return stagiaires.filter((s) => s.filiere === filiere);
    }, [stagiaires, filiere]);

    // Calculate dates between start and end
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        if (!startDate || !endDate) return dates;

        let currentDate = new Date(startDate.getTime());
        currentDate.setHours(0, 0, 0, 0);

        const end = new Date(endDate.getTime());
        end.setHours(0, 0, 0, 0);

        while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const dateColumns = useMemo(() => {
        if (dateRange && dateRange.length === 2 && dateRange[0] && dateRange[1]) {
            return getDatesInRange(dateRange[0], dateRange[1]);
        }
        return [];
    }, [dateRange]);

    // Handle individual cell toggle
    const handleSaisieChange = (stagId, dateStr, slotId) => {
        const key = `${stagId}|${dateStr}|${slotId}`;
        setSaisieData((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Helper to format date for display
    const formatHeaderDate = (d) => {
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    // Helper to format date for backend/state
    const formatStoreDate = (d) => {
        const offset = d.getTimezoneOffset()
        const localDate = new Date(d.getTime() - (offset * 60 * 1000))
        return localDate.toISOString().split('T')[0];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!dateColumns.length || !filiere) return;

        let addedCount = 0;

        // Group entries by student and date to aggregate hours (2h per slot)
        const aggregated = {};

        Object.entries(saisieData).forEach(([key, isAbsent]) => {
            if (isAbsent) {
                const [stagId, dateStr] = key.split('|');
                const groupKey = `${stagId}|${dateStr}`;
                aggregated[groupKey] = (aggregated[groupKey] || 0) + 2;
            }
        });

        Object.entries(aggregated).forEach(([groupKey, hours]) => {
            const [stagId, dateStr] = groupKey.split('|');
            dispatch(
                addAbsence({
                    idstag: parseInt(stagId),
                    date: dateStr,
                    justifie: false,
                    heures: hours,
                })
            );
            addedCount++;
        });

        if (addedCount > 0) {
            setSuccessMessage(`${addedCount} séance(s) d'absence(s) enregistrée(s) avec succès.`);
            setSaisieData({}); // Reset
            setTimeout(() => setSuccessMessage(""), 5000);
        } else {
            setSuccessMessage("Aucune absence sélectionnée.");
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    return (
        <div className="container py-4">
            <div className="mb-4">
                <h2 className="fw-bold">
                    <i className="bi bi-person-badge me-2 text-primary"></i>
                    Registre de Présence 
                </h2>
                <p className="text-muted">
                    Saisie par séances (S1-S4) de 2 heures chacune. Cliquez sur une case pour marquer une absence.
                </p>
            </div>

            <div className="card mb-4 border-0 shadow-sm" style={{ position: 'relative', zIndex: 9999 }}>
                <div className="card-header bg-dark text-white py-3">
                    <h5 className="mb-0 small text-uppercase fw-bold tracking-wider">
                        <i className="bi bi-gear-fill me-2"></i>Configuration du Registre
                    </h5>
                </div>
                <div className="card-body bg-light border-bottom">
                    <div className="row g-4 align-items-end">
                        <div className="col-lg-4">
                            <label className="form-label fw-bold small text-muted text-uppercase">Classe / Filière</label>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-mortarboard-fill text-primary"></i>
                                </span>
                                <select
                                    className="form-select border-start-0"
                                    value={filiere}
                                    onChange={(e) => {
                                        setFiliere(e.target.value);
                                        setSaisieData({});
                                    }}
                                    required
                                >
                                    <option value="">Sélectionner une filière</option>
                                    {filieres.map((f, i) => (
                                        <option key={i} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <label className="form-label fw-bold small text-muted text-uppercase">Période d'appel</label>
                            <div className="position-relative">
                                <button
                                    className="btn btn-white border btn-lg w-100 d-flex justify-content-between align-items-center shadow-sm"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    type="button"
                                >
                                    <span className="text-dark">
                                        <i className="bi bi-calendar-check-fill me-2 text-primary"></i>
                                        {dateRange?.[0] ? dateRange[0].toLocaleDateString('fr-FR') : 'Début'}
                                        <span className="mx-2 text-muted">➟</span>
                                        {dateRange?.[1] ? dateRange[1].toLocaleDateString('fr-FR') : 'Fin'}
                                    </span>
                                    <i className={`bi bi-chevron-${showCalendar ? 'up' : 'down'} text-muted`}></i>
                                </button>

                                {showCalendar && (
                                    <div className="position-absolute start-0 mt-2 bg-white p-3 border rounded shadow-lg" style={{ minWidth: '350px', zIndex: 1050 }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                                            <span className="fw-bold small text-muted">CHOISIR LA PLAGE</span>
                                            <button className="btn-close btn-sm" onClick={() => setShowCalendar(false)}></button>
                                        </div>
                                        <Calendar
                                            onChange={(val) => {
                                                setDateRange(val);
                                                if (val && val.length === 2 && val[0] && val[1]) setShowCalendar(false);
                                            }}
                                            selectRange={true}
                                            value={dateRange}
                                            className="border-0 w-100"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <button className="btn btn-outline-secondary btn-lg w-100" onClick={() => setSaisieData({})}>
                                <i className="bi bi-x-lg me-1"></i> Réinitialiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className="alert alert-success border-0 shadow-sm d-flex align-items-center mb-4 fade show">
                    <i className="bi bi-check-circle-fill fs-4 me-3"></i>
                    <div className="fw-medium">{successMessage}</div>
                </div>
            )}

            {dateColumns.length > 0 && filiere ? (
                filteredStagiaires.length > 0 ? (
                    <form onSubmit={handleSubmit}>
                        <div className="card border-0 shadow-lg overflow-hidden">
                            <div className="card-header bg-white py-4 border-bottom-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold text-dark d-flex align-items-center">
                                        <span className="bg-primary text-white p-2 rounded me-3">
                                            <i className="bi bi-people-fill"></i>
                                        </span>
                                        {filiere}
                                    </h5>
                                    <div className="d-flex gap-4">
                                        {slots.map(s => (
                                            <div key={s.id} className="text-center">
                                                <div className="fw-bold text-primary small">{s.short}</div>
                                                <div className="text-muted" style={{ fontSize: '0.65rem' }}>{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered table-sm mb-0 align-middle professional-grid">
                                    <thead>
                                        <tr className="bg-light">
                                            <th rowSpan="2" className="ps-4 border-bottom-0 sticky-col" style={{ width: "240px", zIndex: 10 }}>
                                                STUDENT NAME
                                            </th>
                                            {dateColumns.map((d, index) => (
                                                <th key={index} colSpan="4" className="text-center py-2 border-bottom-0" style={{ minWidth: "160px", backgroundColor: '#f8f9fa' }}>
                                                    <div className="text-uppercase text-muted lh-1 mb-1" style={{ fontSize: '0.6rem' }}>
                                                        {d.toLocaleDateString('fr-FR', { weekday: 'short' })}
                                                    </div>
                                                    <div className="fw-bold text-dark">{formatHeaderDate(d)}</div>
                                                </th>
                                            ))}
                                        </tr>
                                        <tr className="bg-light text-muted">
                                            {dateColumns.map((d, dIdx) => (
                                                <React.Fragment key={dIdx}>
                                                    {slots.map(s => (
                                                        <th key={s.id} className="text-center small py-1 border-top-0" style={{ width: '40px', fontSize: '0.65rem' }}>
                                                            {s.id}
                                                        </th>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStagiaires.map((stagiaire) => (
                                            <tr key={stagiaire.id} className="hover-row">
                                                <td className="ps-4 fw-bold text-dark border-end-heavy sticky-col bg-white">
                                                    {stagiaire.nom}
                                                </td>
                                                {dateColumns.map((d, dIdx) => {
                                                    const dateStr = formatStoreDate(d);
                                                    return (
                                                        <React.Fragment key={dIdx}>
                                                            {slots.map(s => {
                                                                const key = `${stagiaire.id}|${dateStr}|${s.id}`;
                                                                const isChecked = !!saisieData[key];
                                                                return (
                                                                    <td
                                                                        key={s.id}
                                                                        className={`text-center p-0 cell-slot ${isChecked ? 'is-absent' : ''}`}
                                                                        onClick={() => handleSaisieChange(stagiaire.id, dateStr, s.id)}
                                                                        style={{ height: '48px' }}
                                                                    >
                                                                        {isChecked ? (
                                                                            <span className="text-white fw-bold">A</span>
                                                                        ) : (
                                                                            <span className="dot-marker"></span>
                                                                        )}
                                                                    </td>
                                                                );
                                                            })}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="card-footer bg-light p-4 text-center border-top-0">
                                <button type="submit" className="btn btn-primary px-5 py-3 btn-lg shadow rounded-pill fw-bold">
                                    <i className="bi bi-check2-all me-2"></i>
                                    VALIDER LE RÉGISTRE D'APPEL
                                </button>
                                <div className="mt-3 text-secondary small">
                                    <i className="bi bi-info-circle-fill me-1"></i>
                                    Chaque séance sélectionnée "A" sera enregistrée comme 2 heures d'absence.
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-5 bg-white border rounded shadow-sm">
                        <i className="bi bi-people text-muted opacity-25" style={{ fontSize: '4rem' }}></i>
                        <h5 className="mt-3 text-muted">Aucun stagiaire trouvé pour cette filière</h5>
                    </div>
                )
            ) : (
                <div className="text-center py-5 bg-white border rounded shadow-sm" style={{ borderStyle: 'dashed' }}>
                    <i className="bi bi-layout-three-columns text-primary opacity-25" style={{ fontSize: '5rem' }}></i>
                    <h4 className="mt-3 text-dark fw-bold">Registre d'Appel Prêt</h4>
                    <p className="text-muted">Sélectionnez une filière et une période pour charger la grille de saisie professionnelle.</p>
                </div>
            )}

            <style>{`
                .professional-grid { border-collapse: separate; border-spacing: 0; }
                .border-end-heavy { border-right: 2px solid #dee2e6 !important; }
                .sticky-col { position: sticky; left: 0; z-index: 5; }
                .cell-slot { cursor: pointer; transition: background 0.2s; border: 1px solid #f2f2f2 !important; position: relative; }
                .cell-slot:hover { background-color: #fceaea; }
                .is-absent { background-color: #dc3545 !important; border-color: #c82333 !important; }
                .dot-marker { display: inline-block; width: 4px; height: 4px; background-color: #ddd; border-radius: 50%; }
                .hover-row:hover .sticky-col { background-color: #f8f9fa !important; }
                .hover-row:hover td { background-color: rgba(0,0,0,0.01); }
                .btn-white { background-color: #fff; border-color: #dee2e6; }
                .tracking-wider { letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
}

export default SaisiePage;
