import React, { useState } from 'react';
import axios from 'axios';

function RescheduleModal({ isOpen, onClose, facultyList = [], onRescheduled }) {
  const [facultyId, setFacultyId] = useState(facultyList[0]?.facultyId || 'FAC008');
  const [day, setDay] = useState('Tuesday');
  const [period, setPeriod] = useState(2);
  const [reason, setReason] = useState('Medical Leave / Conference');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleReschedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await axios.post('/api/timetable/reschedule', {
        facultyId,
        day,
        period: Number(period),
        reason
      });

      setResult(res.data);
      if (res.data.modified && onRescheduled) {
        onRescheduled(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.reason || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow border-0">
          <div className="modal-header bg-warning text-dark py-3">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <i className="bi bi-lightning-charge-fill"></i> Dynamic Timetable Rescheduler
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleReschedule}>
            <div className="modal-body p-4">
              <p className="text-muted small mb-3">
                Simulate sudden faculty unavailability or leave. The CSP engine will isolate only affected classes, hold all other 40+ sessions fixed, and find an optimal alternative slot.
              </p>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Select Faculty Member:</label>
                  <select
                    className="form-select"
                    value={facultyId}
                    onChange={e => setFacultyId(e.target.value)}
                    required
                  >
                    {facultyList.map(f => (
                      <option key={f.facultyId} value={f.facultyId}>
                        {f.name} ({f.facultyId})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Day of Absence:</label>
                  <select
                    className="form-select"
                    value={day}
                    onChange={e => setDay(e.target.value)}
                    required
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Period Number:</label>
                  <select
                    className="form-select"
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6].map(p => (
                      <option key={p} value={p}>Period {p}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">Disruption Reason / Explanation:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="e.g. Urgent Department Meeting, Medical Leave, External Viva Duty"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 small">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Success Result & Audit Log */}
              {result && (
                <div className={`alert ${result.modified ? 'alert-success' : 'alert-info'} small mt-3`}>
                  <div className="fw-bold mb-1 d-flex align-items-center gap-2">
                    <i className={result.modified ? "bi bi-check-circle-fill text-success" : "bi bi-info-circle-fill"}></i>
                    {result.message}
                  </div>

                  {result.auditLogs && result.auditLogs.map((log, idx) => (
                    <div key={idx} className="mt-2 p-2 bg-white rounded border">
                      <div className="text-secondary fw-semibold">
                        <span className="badge bg-danger me-1">Was: {log.originalSlot}</span>
                        <i className="bi bi-arrow-right mx-1"></i>
                        <span className="badge bg-success">Moved to: {log.newSlot}</span>
                      </div>
                      <div className="text-muted small mt-1">
                        <strong>XAI Rationale:</strong> {log.justification}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer bg-light py-2">
              <button type="button" className="btn btn-sm btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="submit"
                className="btn btn-sm btn-warning text-dark fw-bold px-3 d-flex align-items-center gap-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Running Local CSP Repair...
                  </>
                ) : (
                  <>
                    <i className="bi bi-arrow-repeat"></i>
                    <span>Execute Reschedule</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RescheduleModal;
