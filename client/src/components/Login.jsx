import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@mca.edu');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        onLoginSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}>
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <i className="bi bi-calendar3-range text-primary display-5 mb-2"></i>
            <h4 className="fw-bold text-dark mt-2 mb-1">IntelliSched AI</h4>
            <p className="text-muted small">MCA Department Timetable Optimizer</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-secondary small fw-semibold">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="admin@mca.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary small fw-semibold">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        <div className="card-footer bg-white border-top text-center py-3 text-muted small">
          Demo Credentials: <strong>admin@mca.edu</strong> / <strong>admin</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;
