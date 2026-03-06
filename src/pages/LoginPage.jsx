import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice.jsx';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, error } = useSelector((state) => state.auth);

    useEffect(() => {
        // Redirect if already logged in
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Dispatch thunk -> waits for mock API -> updates state
        await dispatch(loginUser({ email, password }));

        setIsLoading(false);
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
            <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%', borderRadius: '1rem' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-5">
                        <div
                            className="bg-gradient-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-lg"
                            style={{
                                background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)',
                                width: '80px',
                                height: '80px'
                            }}
                        >
                            <i className="bi bi-person-lock fs-1"></i>
                        </div>
                        <h2 className="fw-bold mb-1">Espace Membres</h2>
                        <p className="text-muted small text-uppercase fw-bold tracking-wider">Gestion des Absences</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center rounded-pill py-2 px-3 mb-4 shadow-sm border-danger" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                            <div className="small fw-bold">{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold text-muted small text-uppercase" htmlFor="email">Adresse Email</label>
                            <div className="input-group input-group-lg shadow-sm">
                                <span className="input-group-text bg-white border-end-0 text-primary">
                                    <i className="bi bi-envelope-fill"></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control border-start-0 ps-0"
                                    id="email"
                                    placeholder="admin@school.ma"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="form-label fw-bold text-muted small text-uppercase" htmlFor="password">Mot de passe</label>
                            <div className="input-group input-group-lg shadow-sm">
                                <span className="input-group-text bg-white border-end-0 text-primary">
                                    <i className="bi bi-key-fill"></i>
                                </span>
                                <input
                                    type="password"
                                    className="form-control border-start-0 ps-0"
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-2 text-end">
                                {/* Mock credentials reminder for easy testing */}
                                <small className="text-muted">Essayer avec: <strong>admin@school.ma</strong> / <strong>password</strong></small>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow position-relative overflow-hidden"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Connexion...
                                </span>
                            ) : (
                                <span>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Se Connecter
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
