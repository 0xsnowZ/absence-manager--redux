import { configureStore } from "@reduxjs/toolkit";
import absenceSlice from "./absenceSlice.jsx";
import stagiaireSlice from "./stagiaireSlice.jsx";
import authReducer from "./authSlice.jsx";

// Redux Store Configuration
// Create store
const store = configureStore({
  reducer: {
    stagiaires: stagiaireSlice.reducer,
    absences: absenceSlice.reducer,
    auth: authReducer,
  },

});

export default store;
