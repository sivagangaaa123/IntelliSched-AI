import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
    <div 
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
      }}
    >
      {/* Decorative Glowing Orbs */}
      <div 
        className="position-absolute rounded-circle" 
        style={{ width: '500px', height: '500px', background: 'rgba(59, 130, 246, 0.4)', top: '-15%', left: '-10%', filter: 'blur(100px)' }}
      ></div>
      <div 
        className="position-absolute rounded-circle" 
        style={{ width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.3)', bottom: '-10%', right: '-5%', filter: 'blur(100px)' }}
      ></div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card border-0 z-1" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '10px'
        }}
      >
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-5">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="d-inline-block bg-primary text-white rounded-circle p-3 mb-3 shadow-sm"
            >
              <i className="bi bi-calendar3-range fs-1"></i>
            </motion.div>
            <h2 
              className="fw-bolder mb-1" 
              style={{ 
                background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}
            >
              IntelliSched AI
            </h2>
            <p className="text-muted fw-medium" style={{ letterSpacing: '0.5px', fontSize: '0.9rem' }}>
              Explainable Timetable Optimizer
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="alert alert-danger py-2 small fw-semibold border-0 border-start border-danger border-4 rounded-3 shadow-sm">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Email Address</label>
              <div className="input-group shadow-sm rounded-4 overflow-hidden">
                <span className="input-group-text bg-white border-0 text-primary px-3">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control border-0 bg-white py-3 ps-1" 
                  placeholder="admin@mca.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ boxShadow: 'none' }}
                  required 
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label text-secondary small fw-bold text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>Password</label>
              <div className="input-group shadow-sm rounded-4 overflow-hidden">
                <span className="input-group-text bg-white border-0 text-primary px-3">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control border-0 bg-white py-3 ps-1" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ boxShadow: 'none' }}
                  required 
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="btn btn-primary w-100 py-3 rounded-pill fw-bold border-0 shadow"
              style={{ background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Login <i className="bi bi-arrow-right ms-2"></i>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-5 text-center">
            <div className="badge bg-light text-secondary border px-3 py-2 rounded-pill fw-normal shadow-sm">
              Demo: <strong>admin@mca.edu</strong> | Pass: <strong>admin</strong>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer text */}
      <div className="position-absolute bottom-0 mb-4 text-white-50 small z-1">
        IntelliSched AI © {new Date().getFullYear()} | MCA Department
      </div>
    </div>
  );
}

export default Login;
