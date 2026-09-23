import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [serverHealth, setServerHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check connection to backend
    axios.get('/api/health')
      .then((res) => {
        setServerHealth(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#home">
            <i className="bi bi-calendar3-range text-warning fs-4"></i>
            <span className="fw-bold">IntelliSched AI</span>
            <span className="badge bg-primary text-uppercase" style={{ fontSize: '0.65rem' }}>MCA Department</span>
          </a>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-secondary">CSP Engine v1.0</span>
            {loading ? (
              <span className="badge bg-warning text-dark"><i className="bi bi-arrow-repeat spin"></i> Connecting...</span>
            ) : error ? (
              <span className="badge bg-danger"><i className="bi bi-x-circle"></i> Server Offline</span>
            ) : (
              <span className="badge bg-success"><i className="bi bi-check-circle"></i> API Online</span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="container py-4 flex-grow-1">
        {/* Hero Banner */}
        <div className="p-4 mb-4 rounded-3 bg-white shadow-sm border-start border-primary border-4">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h2 className="fw-bold text-dark mb-1">Explainable AI Timetable Optimizer</h2>
              <p className="text-muted mb-0">
                Department Timetable Scheduler utilizing <strong>Constraint Satisfaction Problem (CSP)</strong> techniques with Dynamic Rescheduling.
              </p>
            </div>
            <span className="badge bg-light text-dark border p-2">
              Academic Year 2026-27
            </span>
          </div>
        </div>

        {/* System Health / API Verification Card */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center gap-2">
                  <i className="bi bi-cpu text-primary"></i> System Verification Status
                </h5>
                {loading && <p className="text-muted mb-0">Pinging backend at <code>http://localhost:5000/api/health</code>...</p>}
                {error && (
                  <div className="alert alert-warning mb-0">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Backend server is not reachable yet.</strong> Make sure to start the server via <code>npm run dev</code> in the <code>server</code> directory.
                  </div>
                )}
                {serverHealth && (
                  <div className="alert alert-success d-flex justify-content-between align-items-center mb-0">
                    <div>
                      <i className="bi bi-check-circle-fill me-2"></i>
                      <strong>Backend Connected Successfully!</strong> Status: <code>{serverHealth.status}</code> | Service: <code>{serverHealth.service}</code>
                    </div>
                    <small className="text-muted">{new Date(serverHealth.timestamp).toLocaleTimeString()}</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Module Blueprint Cards */}
        <h4 className="fw-bold mb-3 text-secondary">
          <i className="bi bi-grid-fill me-2"></i> System Modules (Setup Roadmap)
        </h4>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="card h-100 p-3">
              <div className="text-primary mb-2 fs-3"><i className="bi bi-person-workspace"></i></div>
              <h6 className="fw-bold">Faculty Management</h6>
              <p className="text-muted small mb-0">Workload, course mapping, leaves & availability constraints.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 p-3">
              <div className="text-success mb-2 fs-3"><i className="bi bi-book-half"></i></div>
              <h6 className="fw-bold">Course Management</h6>
              <p className="text-muted small mb-0">Core theory, MCA labs, weekly credits & teacher assignments.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 p-3">
              <div className="text-info mb-2 fs-3"><i className="bi bi-door-open"></i></div>
              <h6 className="fw-bold">Classroom & Lab Allocation</h6>
              <p className="text-muted small mb-0">Room capacities, computer lab constraints, projector facilities.</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card h-100 p-3">
              <div className="text-warning mb-2 fs-3"><i className="bi bi-people"></i></div>
              <h6 className="fw-bold">Student Batches</h6>
              <p className="text-muted small mb-0">MCA Semester batches & elective student group divisions.</p>
            </div>
          </div>
        </div>

        {/* Core Intelligence Preview */}
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="card h-100 border-primary p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-gear-wide-connected fs-4 text-primary"></i>
                <h6 className="fw-bold mb-0">CSP Engine</h6>
              </div>
              <p className="text-muted small mb-0">
                Backtracking + Forward Checking (FC) + Minimum Remaining Values (MRV) heuristic for zero-clash schedules.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-info p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-chat-left-dots fs-4 text-info"></i>
                <h6 className="fw-bold mb-0">Explainable AI (XAI)</h6>
              </div>
              <p className="text-muted small mb-0">
                Generates clear, natural language explanations for slot allocations and why-not conflict rejections.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-warning p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-arrow-repeat fs-4 text-warning"></i>
                <h6 className="fw-bold mb-0">Dynamic Rescheduling</h6>
              </div>
              <p className="text-muted small mb-0">
                Instantly repairs schedules on sudden faculty absence or room unavailability with minimal displacement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-center text-muted small">
        <div className="container">
          <span>IntelliSched AI &copy; 2026 — MCA Academic Project — Department Timetable Optimizer</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
