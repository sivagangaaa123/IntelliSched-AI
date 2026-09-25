import React from 'react';

function Navbar({ activeTab, setActiveTab, onGenerate, isGenerating, timetableStatus }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-2 shadow-sm sticky-top">
      <div className="container-fluid px-4">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#!">
          <i className="bi bi-calendar3-range text-warning fs-4"></i>
          <div>
            <div className="fw-bold fs-5 leading-none">IntelliSched AI</div>
            <div className="text-muted text-uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.5px' }}>
              Explainable MCA Timetable Optimizer
            </div>
          </div>
        </a>

        <div className="d-flex align-items-center gap-3">
          <ul className="navbar-nav d-flex flex-row gap-1">
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'timetable' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setActiveTab('timetable')}
              >
                <i className="bi bi-grid-3x3 me-1"></i> Timetable Grid
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'data' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setActiveTab('data')}
              >
                <i className="bi bi-table me-1"></i> Department Tables
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn btn-sm ${activeTab === 'inspector' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setActiveTab('inspector')}
              >
                <i className="bi bi-question-circle me-1"></i> XAI "Why-Not" Inspector
              </button>
            </li>
          </ul>

          <div className="border-start border-secondary ps-3 d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-success d-flex align-items-center gap-1 shadow-sm px-3"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  Solving CSP...
                </>
              ) : (
                <>
                  <i className="bi bi-play-circle-fill"></i>
                  <span>Generate Timetable</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
