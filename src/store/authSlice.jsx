import { createSlice } from '@reduxjs/toolkit';

// Initial state, checking local storage for a persisted session
const storedUser = localStorage.getItem('user');

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!storedUser,
    error: null,
};

// Mock users for testing
const mockUsers = [
    { id: 1, email: 'admin@school.ma', password: 'password', name: 'Administrateur', role: 'admin' },
    { id: 2, email: 'teacher@school.ma', password: 'password', name: 'Professeur', role: 'prof' },
];

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        loginFailure: (state, action) => {
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Thunk for handling mock login
export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginStart());

    // Simulate API call delay
    setTimeout(() => {
        const user = mockUsers.find(
            (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
            // Don't store the password in state/local storage
            const { password, ...userWithoutPassword } = user;
            dispatch(loginSuccess(userWithoutPassword));
        } else {
            dispatch(loginFailure('Email ou mot de passe incorrect'));
        }
    }, 800);
};

export default authSlice.reducer;
