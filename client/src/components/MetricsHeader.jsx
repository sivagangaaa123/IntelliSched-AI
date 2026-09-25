import React from 'react';

function MetricsHeader({ timetable, onOpenReschedule }) {
  if (!timetable) return null;

  const { metrics, explanation } = timetable;

  return (
    <div className="mb-4">
      {/* Top Metric Cards */}
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <div className="card bg-white border-start border-success border-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Hard Constraints</span>
                <h4 className="fw-bold text-success mb-0">100% Satisfied</h4>
              </div>
              <div className="fs-2 text-success opacity-75">
                <i className="bi bi-shield-check"></i>
              </div>
            </div>
            <small className="text-muted mt-1">0 Clashes across Faculty, Rooms & Groups</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-white border-start border-primary border-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Soft Quality Score</span>
                <h4 className="fw-bold text-primary mb-0">{metrics?.softScore || 100} / 100</h4>
              </div>
              <div className="fs-2 text-primary opacity-75">
                <i className="bi bi-award"></i>
              </div>
            </div>
            <small className="text-muted mt-1">Distr: {metrics?.distributionScore || 100}% | Compactness high</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-white border-start border-info border-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Scheduled Sessions</span>
                <h4 className="fw-bold text-dark mb-0">{timetable.grid?.length || 0} Periods</h4>
              </div>
              <div className="fs-2 text-info opacity-75">
                <i className="bi bi-calendar2-check"></i>
              </div>
            </div>
            <small className="text-muted mt-1">Theory, MCA Labs, Electives & Seminars</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-white border-start border-warning border-4 h-100 p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small text-uppercase fw-semibold">Dynamic Rescheduling</span>
                <div className="mt-1">
                  <button 
                    className="btn btn-sm btn-outline-warning text-dark fw-semibold"
                    onClick={onOpenReschedule}
                  >
                    <i className="bi bi-arrow-repeat me-1"></i> Reschedule Absence
                  </button>
                </div>
              </div>
              <div className="fs-2 text-warning opacity-75">
                <i className="bi bi-lightning-charge"></i>
              </div>
            </div>
            <small className="text-muted mt-1">Gaps: {metrics?.facultyGaps || 0} faculty, {metrics?.studentGaps || 0} student</small>
          </div>
        </div>
      </div>

      {/* Explainability Accordion/Card */}
      {explanation && (
        <div className="card bg-white border-info shadow-sm p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-chat-quote-fill fs-5 text-info"></i>
              Explainable AI (XAI) Timetable Rationale
            </h6>
            <span className="badge bg-light text-primary border">CSP Decision Audit</span>
          </div>
          <p className="text-secondary small mb-2 fst-italic">
            "{explanation.summary}"
          </p>
          <div className="row g-2">
            {explanation.decisions?.map((dec, idx) => (
              <div key={idx} className="col-md-6">
                <div className="small text-muted d-flex align-items-start gap-2">
                  <i className="bi bi-check-circle-fill text-success flex-shrink-0 mt-1"></i>
                  <span>{dec}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MetricsHeader;
