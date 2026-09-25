import React, { useState } from 'react';
import axios from 'axios';

function ExplainSlotModal({ courses = [], classrooms = [] }) {
  const [courseId, setCourseId] = useState(courses[0]?.courseId || 'CRS301');
  const [classroomId, setClassroomId] = useState(classrooms[0]?.roomId || 'CR-101');
  const [day, setDay] = useState('Monday');
  const [period, setPeriod] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInspect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await axios.post('/api/timetable/explain-slot', {
        courseId,
        classroomId,
        day,
        period: Number(period)
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 bg-white p-4 mb-4">
      <div className="border-bottom pb-3 mb-3">
        <h5 className="fw-bold text-primary d-flex align-items-center gap-2 mb-1">
          <i className="bi bi-question-diamond-fill text-info"></i>
          Explainable AI (XAI): "Why-Not?" Constraint Diagnostic Inspector
        </h5>
        <p className="text-muted small mb-0">
          Select any Course, Classroom, Day, and Period to test constraint validity. The XAI engine will explain in plain English whether that assignment is feasible or which specific hard constraint blocks it.
        </p>
      </div>

      <form onSubmit={handleInspect}>
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label small fw-bold">Select Course:</label>
            <select
              className="form-select form-select-sm"
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              required
            >
              {courses.map(c => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseCode}: {c.name} ({c.courseType})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-bold">Target Classroom / Lab:</label>
            <select
              className="form-select form-select-sm"
              value={classroomId}
              onChange={e => setClassroomId(e.target.value)}
              required
            >
              {classrooms.map(r => (
                <option key={r.roomId} value={r.roomId}>
                  {r.roomId}: {r.name} (Cap: {r.capacity})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small fw-bold">Day:</label>
            <select
              className="form-select form-select-sm"
              value={day}
              onChange={e => setDay(e.target.value)}
              required
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small fw-bold">Period:</label>
            <select
              className="form-select form-select-sm"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              required
            >
              {[1, 2, 3, 4, 5, 6].map(p => (
                <option key={p} value={p}>Period {p}</option>
              ))}
            </select>
          </div>

          <div className="col-md-1 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-sm btn-primary w-100 fw-bold"
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Check'}
            </button>
          </div>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className={`alert ${result.canSchedule ? 'alert-success' : 'alert-danger'} mt-2 mb-0 p-3 shadow-sm`}>
          <div className="d-flex align-items-start gap-2">
            <div className="fs-4 mt-n1">
              <i className={result.canSchedule ? "bi bi-check-circle-fill text-success" : "bi bi-x-octagon-fill text-danger"}></i>
            </div>
            <div>
              <h6 className="fw-bold mb-1">
                {result.canSchedule ? 'Slot Assignment Feasible!' : 'Constraint Collision Detected (Slot Blocked)'}
              </h6>
              <p className="mb-1">{result.explanation}</p>
              {!result.canSchedule && result.constraintViolated && (
                <span className="badge bg-danger text-uppercase" style={{ fontSize: '0.65rem' }}>
                  Violated Rule: {result.constraintViolated}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-2 mb-0 small">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {error}
        </div>
      )}
    </div>
  );
}

export default ExplainSlotModal;
