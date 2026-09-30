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
    <div className="container-fluid min-vh-100 p-0">
      <div className="row g-0 min-vh-100">
        
        {/* Left Side: Branding / Hero Area (Hidden on mobile) */}
        <div 
          className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center text-white position-relative"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}
        >
          {/* Subtle background pattern/overlay */}
          <div className="position-absolute w-100 h-100" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }}></div>
          
          <div className="text-center px-5 z-1" style={{ maxWidth: '600px' }}>
            <i className="bi bi-calendar3-range display-1 mb-4 opacity-75"></i>
            <h1 className="fw-bolder mb-3 display-4">IntelliSched AI</h1>
            <p className="fs-5 text-white-50 mb-5">
              The smart, explainable timetable optimizer designed specifically for academic departments.
            </p>
            
            <div className="d-flex justify-content-center gap-3 mt-4 text-start">
              <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded-pill px-3 py-2">
                <i className="bi bi-check-circle-fill text-info"></i>
                <span className="small fw-medium">Constraint Satisfaction Engine</span>
              </div>
              <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded-pill px-3 py-2">
                <i className="bi bi-check-circle-fill text-info"></i>
                <span className="small fw-medium">XAI Audit Logs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center bg-white p-4 p-md-5">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            
            {/* Mobile Logo (Visible only on small screens) */}
            <div className="d-lg-none text-center mb-5">
              <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle p-3 mb-3">
                <i className="bi bi-calendar3-range fs-1"></i>
              </div>
              <h2 className="fw-bold text-dark mt-2">IntelliSched AI</h2>
            </div>

            <div className="mb-5">
              <h3 className="fw-bold text-dark mb-2">Welcome back</h3>
              <p className="text-secondary">Please enter your details to sign in to your dashboard.</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small rounded-3 d-flex align-items-center border-0 bg-danger bg-opacity-10 text-danger fw-medium">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label text-dark fw-semibold small">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg rounded-3 fs-6 bg-light border-0" 
                  placeholder="admin@mca.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: '0.8rem 1rem' }}
                  required 
                />
              </div>

              <div className="mb-5">
                <label className="form-label text-dark fw-semibold small">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg rounded-3 fs-6 bg-light border-0" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ padding: '0.8rem 1rem' }}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 rounded-3 fs-6 fw-bold shadow-sm"
                style={{ padding: '0.8rem 1rem' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-5 pt-3">
              <div className="p-3 bg-light rounded-3 border text-center text-secondary small">
                <span className="d-block mb-1"><i className="bi bi-info-circle me-1"></i> <strong>Demo Access</strong></span>
                Email: <span className="text-dark fw-medium">admin@mca.edu</span> <br/>
                Password: <span className="text-dark fw-medium">admin</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
