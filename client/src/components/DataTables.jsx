import React, { useState } from 'react';

function DataTables({ facultyList = [], courses = [], classrooms = [], studentGroups = [], constraints = null }) {
  const [subTab, setSubTab] = useState('faculty');

  return (
    <div className="card shadow-sm border-0 bg-white p-3 mb-4">
      {/* Sub-tab Navigation */}
      <ul className="nav nav-pills mb-3 border-bottom pb-2">
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${subTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setSubTab('faculty')}
          >
            <i className="bi bi-people-fill me-1"></i> Faculty ({facultyList.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${subTab === 'courses' ? 'active' : ''}`}
            onClick={() => setSubTab('courses')}
          >
            <i className="bi bi-book-half me-1"></i> Courses ({courses.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${subTab === 'classrooms' ? 'active' : ''}`}
            onClick={() => setSubTab('classrooms')}
          >
            <i className="bi bi-door-open-fill me-1"></i> Classrooms & Labs ({classrooms.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${subTab === 'groups' ? 'active' : ''}`}
            onClick={() => setSubTab('groups')}
          >
            <i className="bi bi-person-badge-fill me-1"></i> Student Groups ({studentGroups.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn-sm ${subTab === 'constraints' ? 'active' : ''}`}
            onClick={() => setSubTab('constraints')}
          >
            <i className="bi bi-sliders me-1"></i> CSP Constraint Rules
          </button>
        </li>
      </ul>

      {/* 1. Faculty Table */}
      {subTab === 'faculty' && (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle small">
            <thead className="table-light text-secondary">
              <tr>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Max Hours</th>
                <th>Unavailable Periods / Leaves (Hard CSP Constraint)</th>
                <th>Time Preference</th>
              </tr>
            </thead>
            <tbody>
              {facultyList.map(f => (
                <tr key={f.facultyId}>
                  <td><code>{f.facultyId}</code></td>
                  <td className="fw-semibold">{f.name}</td>
                  <td><span className="badge bg-light text-dark border">{f.designation}</span></td>
                  <td>{f.email}</td>
                  <td>{f.maxWeeklyHours} hrs/wk</td>
                  <td>
                    {f.unavailableSlots && f.unavailableSlots.length > 0 ? (
                      <div className="d-flex flex-wrap gap-1">
                        {f.unavailableSlots.map((u, i) => (
                          <span key={i} className="badge bg-danger-subtle text-danger border border-danger-subtle" title={u.reason}>
                            {u.day} P{u.period}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">Full Availability</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary text-capitalize">
                      {f.preferences?.preferredTime || 'any'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Courses Table */}
      {subTab === 'courses' && (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle small">
            <thead className="table-light text-secondary">
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Semester</th>
                <th>Type</th>
                <th>Weekly Periods</th>
                <th>Assigned Faculty</th>
                <th>Student Group</th>
                <th>Required Room</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.courseId}>
                  <td><code>{c.courseCode}</code></td>
                  <td className="fw-semibold">{c.name}</td>
                  <td>Sem {c.semester}</td>
                  <td>
                    <span className={`badge ${
                      c.courseType === 'Lab' ? 'bg-success' :
                      c.courseType === 'Elective' ? 'bg-warning text-dark' :
                      c.courseType === 'Seminar' ? 'bg-info text-dark' : 'bg-primary'
                    }`}>
                      {c.courseType}
                    </span>
                  </td>
                  <td><strong>{c.weeklyPeriods}</strong> periods</td>
                  <td>{c.faculty?.name || 'Unassigned'}</td>
                  <td><span className="badge bg-light text-dark border">{c.studentGroup?.name || 'Group'}</span></td>
                  <td><span className="badge bg-secondary">{c.requiredRoomType}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Classrooms & Labs Table */}
      {subTab === 'classrooms' && (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle small">
            <thead className="table-light text-secondary">
              <tr>
                <th>Room ID</th>
                <th>Room / Laboratory Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Facilities</th>
                <th>Maintenance / Reserved Slots</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map(r => (
                <tr key={r.roomId}>
                  <td><code>{r.roomId}</code></td>
                  <td className="fw-semibold">{r.name}</td>
                  <td>
                    <span className={`badge ${r.type.includes('Lab') ? 'bg-success' : 'bg-primary'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td><span className="badge bg-dark">{r.capacity} seats</span></td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {r.facilities?.map((fac, i) => (
                        <span key={i} className="badge bg-light text-dark border">{fac}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    {r.unavailableSlots && r.unavailableSlots.length > 0 ? (
                      r.unavailableSlots.map((u, i) => (
                        <span key={i} className="badge bg-danger-subtle text-danger border" title={u.reason}>
                          {u.day} P{u.period} ({u.reason})
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">Always Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Student Groups Table */}
      {subTab === 'groups' && (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle small">
            <thead className="table-light text-secondary">
              <tr>
                <th>Group ID</th>
                <th>Batch / Section Name</th>
                <th>Semester</th>
                <th>Student Count</th>
                <th>Program</th>
                <th>Elective Group Status</th>
              </tr>
            </thead>
            <tbody>
              {studentGroups.map(g => (
                <tr key={g.groupId}>
                  <td><code>{g.groupId}</code></td>
                  <td className="fw-semibold">{g.name}</td>
                  <td>Sem {g.semester}</td>
                  <td><span className="badge bg-primary">{g.studentCount} students</span></td>
                  <td>{g.program}</td>
                  <td>
                    {g.isElectiveGroup ? (
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-diagram-3-fill me-1"></i> Elective Sub-group (Parent: {g.parentGroupId?.name || 'Section A'})
                      </span>
                    ) : (
                      <span className="badge bg-success">Main Cohort</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Constraints Table */}
      {subTab === 'constraints' && (
        <div className="row g-3">
          <div className="col-md-6">
            <div className="card h-100 border p-3">
              <h6 className="fw-bold text-danger d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-shield-fill-x"></i> Hard Constraints (Strictly 100% Satisfied)
              </h6>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Faculty Clash:</strong> Faculty cannot teach 2 classes at once</span>
                  <span className="badge bg-success">Enforced</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Room Clash:</strong> Classroom cannot host 2 sessions simultaneously</span>
                  <span className="badge bg-success">Enforced</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Student Clash:</strong> Group cannot attend 2 lectures at once</span>
                  <span className="badge bg-success">Enforced</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Capacity Feasibility:</strong> Room capacity &ge; Student count</span>
                  <span className="badge bg-success">Enforced</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Lab Type Matching:</strong> Labs strictly in Computer Labs</span>
                  <span className="badge bg-success">Enforced</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Faculty Leaves:</strong> No assignment during unavailable periods</span>
                  <span className="badge bg-success">Enforced</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border p-3">
              <h6 className="fw-bold text-primary d-flex align-items-center gap-2 mb-3">
                <i className="bi bi-sliders2-vertical"></i> Soft Constraints (Quality Optimization Weights)
              </h6>
              <ul className="list-group list-group-flush small">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Balanced Daily Distribution:</strong> Spread courses across days</span>
                  <span className="badge bg-primary">Weight: 25</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Minimize Faculty Gaps:</strong> Keep faculty schedule contiguous</span>
                  <span className="badge bg-primary">Weight: 20</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Minimize Student Gaps:</strong> Compact student daily hours</span>
                  <span className="badge bg-primary">Weight: 20</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Consecutive Period Control:</strong> Max 2 hours for theory</span>
                  <span className="badge bg-primary">Weight: 15</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span><strong>Faculty Preferences:</strong> Morning vs afternoon preference</span>
                  <span className="badge bg-primary">Weight: 10</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTables;
