// Initial data for the application
const initialStagiaires = [
  { id: 1, nom: "Tahiri", filiere: "DD101", sexe: "m" },
  { id: 2, nom: "Mouhid", filiere: "DD102", sexe: "f" },
  { id: 3, nom: "Errami", filiere: "DD201", sexe: "m" },
];

const initialAbsences = [
  { id: 1, idstag: 1, date: "2025-10-10", justifie: true, heures: 4 },
  { id: 2, idstag: 1, date: "2025-10-19", justifie: false, heures: 2 },
  { id: 3, idstag: 2, date: "2025-11-20", justifie: true, heures: 3 },
];

export { initialStagiaires, initialAbsences };
