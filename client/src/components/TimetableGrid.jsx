import React, { useState, useMemo } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = [
  { num: 1, time: '09:00 - 10:00' },
  { num: 2, time: '10:00 - 11:00' },
  { num: 3, time: '11:15 - 12:15' },
  { num: 'LUNCH', time: '12:15 - 01:15' },
  { num: 4, time: '01:15 - 02:15' },
  { num: 5, time: '02:15 - 03:15' },
  { num: 6, time: '03:15 - 04:15' },
];

function TimetableGrid({ timetable, facultyList = [], classrooms = [], studentGroups = [] }) {
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [selectedRoom, setSelectedRoom] = useState('ALL');

  // Filter grid entries based on selected filters
  const filteredGrid = useMemo(() => {
    if (!timetable || !timetable.grid) return [];

    return timetable.grid.filter(entry => {
      const course = entry.course || {};
      const faculty = entry.faculty || {};
      const room = entry.classroom || {};
      const group = entry.studentGroup || {};

      // Semester Filter
      if (selectedSemester !== 'ALL' && course.semester !== Number(selectedSemester)) {
        return false;
      }

      // Student Group Filter
      if (selectedGroup !== 'ALL') {
        const groupId = group.groupId || (typeof group === 'string' ? group : '');
        if (groupId !== selectedGroup) return false;
      }

      // Faculty Filter
      if (selectedFaculty !== 'ALL') {
        const fId = faculty.facultyId || faculty._id || '';
        if (fId !== selectedFaculty) return false;
      }

      // Room Filter
      if (selectedRoom !== 'ALL') {
        const rId = room.roomId || room._id || '';
        if (rId !== selectedRoom) return false;
      }

      return true;
    });
  }, [timetable, selectedSemester, selectedGroup, selectedFaculty, selectedRoom]);

  // Helper to get sessions at a specific Day & Period
  const getSessionsAt = (day, period) => {
    return filteredGrid.filter(e => e.day === day && e.period === period);
  };

  const getCourseBadgeColor = (type) => {
    switch (type) {
      case 'Lab': return 'bg-success text-white';
      case 'Elective': return 'bg-warning text-dark';
      case 'Seminar': return 'bg-info text-dark';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <div className="card shadow-sm border-0 bg-white p-3 mb-4">
      {/* Controls & Filter Bar */}
      <div className="row g-2 align-items-center mb-3 pb-3 border-bottom">
        <div className="col-auto">
          <span className="fw-bold text-secondary d-flex align-items-center gap-1">
            <i className="bi bi-funnel-fill text-primary"></i> Filters:
          </span>
        </div>

        {/* Semester Filter */}
        <div className="col-md-2">
          <select
            className="form-select form-select-sm"
            value={selectedSemester}
            onChange={e => {
              setSelectedSemester(e.target.value);
              setSelectedGroup('ALL'); // Reset group when sem changes
            }}
          >
            <option value="ALL">All Semesters</option>
            <option value="1">MCA Semester 1</option>
            <option value="3">MCA Semester 3</option>
          </select>
        </div>

        {/* Student Group Filter */}
        <div className="col-md-2">
          <select
            className="form-select form-select-sm"
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
          >
            <option value="ALL">All Batches / Groups</option>
            {studentGroups
              .filter(g => selectedSemester === 'ALL' || g.semester === Number(selectedSemester))
              .map(g => (
                <option key={g.groupId} value={g.groupId}>
                  {g.name}
                </option>
              ))}
          </select>
        </div>

        {/* Faculty Filter */}
        <div className="col-md-3">
          <select
            className="form-select form-select-sm"
            value={selectedFaculty}
            onChange={e => setSelectedFaculty(e.target.value)}
          >
            <option value="ALL">Filter by Faculty (All)</option>
            {facultyList.map(f => (
              <option key={f.facultyId} value={f.facultyId}>
                {f.name} ({f.designation})
              </option>
            ))}
          </select>
        </div>

        {/* Classroom Filter */}
        <div className="col-md-3">
          <select
            className="form-select form-select-sm"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
          >
            <option value="ALL">Filter by Room / Lab (All)</option>
            {classrooms.map(r => (
              <option key={r.roomId} value={r.roomId}>
                {r.name} ({r.type}, Cap: {r.capacity})
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <div className="col-auto ms-auto">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setSelectedSemester('ALL');
              setSelectedGroup('ALL');
              setSelectedFaculty('ALL');
              setSelectedRoom('ALL');
            }}
            title="Reset all filters"
          >
            <i className="bi bi-x-circle me-1"></i> Reset
          </button>
        </div>
      </div>

      {/* Main Timetable Table Grid */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle mb-0 text-center" style={{ tableLayout: 'fixed' }}>
          <thead className="table-dark text-nowrap">
            <tr>
              <th style={{ width: '10%' }}>Day / Period</th>
              {PERIODS.map((p, idx) => (
                <th key={idx} style={{ width: p.num === 'LUNCH' ? '8%' : '14%' }}>
                  <div className="fw-bold">{p.num === 'LUNCH' ? 'LUNCH' : `Period ${p.num}`}</div>
                  <div className="small fw-normal text-light opacity-75" style={{ fontSize: '0.72rem' }}>
                    {p.time}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day} style={{ minHeight: '90px' }}>
                <td className="bg-light fw-bold text-secondary text-uppercase border-end">
                  <div className="py-2">{day}</div>
                </td>

                {PERIODS.map((p, pIdx) => {
                  if (p.num === 'LUNCH') {
                    return (
                      <td key={pIdx} className="bg-light text-muted small fw-semibold text-center" style={{ letterSpacing: '2px', writingMode: 'vertical-lr', textOrientation: 'upright' }}>
                        RECESS
                      </td>
                    );
                  }

                  const sessions = getSessionsAt(day, p.num);

                  return (
                    <td key={pIdx} className="p-1 align-top" style={{ backgroundColor: sessions.length > 0 ? '#fafbfc' : 'transparent', height: '110px' }}>
                      {sessions.length === 0 ? (
                        <div className="h-100 d-flex align-items-center justify-content-center text-muted opacity-25">
                          <i className="bi bi-dash-lg"></i>
                        </div>
                      ) : (
                        <div className="d-flex flex-column gap-1">
                          {sessions.map((sess, sIdx) => {
                            const course = sess.course || {};
                            const faculty = sess.faculty || {};
                            const room = sess.classroom || {};
                            const group = sess.studentGroup || {};

                            return (
                              <div
                                key={sIdx}
                                className="p-2 rounded text-start shadow-sm border"
                                style={{
                                  backgroundColor: '#ffffff',
                                  borderLeft: '4px solid var(--bs-primary)',
                                  fontSize: '0.8rem'
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <span className="fw-bold text-dark text-truncate" title={course.name}>
                                    {course.courseCode || 'CRS'}
                                  </span>
                                  <span className={`badge ${getCourseBadgeColor(course.courseType)}`} style={{ fontSize: '0.65rem' }}>
                                    {course.courseType || 'Theory'}
                                  </span>
                                </div>

                                <div className="text-secondary fw-semibold text-truncate small" title={course.name}>
                                  {course.name}
                                </div>

                                <div className="d-flex align-items-center gap-1 text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                                  <i className="bi bi-person-fill text-primary"></i>
                                  <span className="text-truncate">{faculty.name || 'Faculty'}</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                  <span className="text-truncate" title={room.name}>
                                    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                                    {room.roomId || 'Room'}
                                  </span>
                                  <span className="badge bg-light text-dark border">
                                    {group.groupId || 'Group'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid Summary Footer */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-2 text-muted small border-top">
        <div>
          Showing <strong>{filteredGrid.length}</strong> scheduled periods matching current filter criteria.
        </div>
        <div className="d-flex gap-3">
          <span className="d-flex align-items-center gap-1">
            <span className="badge bg-primary">&nbsp;</span> Theory Class
          </span>
          <span className="d-flex align-items-center gap-1">
            <span className="badge bg-success">&nbsp;</span> MCA Lab
          </span>
          <span className="d-flex align-items-center gap-1">
            <span className="badge bg-warning text-dark">&nbsp;</span> Elective
          </span>
          <span className="d-flex align-items-center gap-1">
            <span className="badge bg-info text-dark">&nbsp;</span> Seminar
          </span>
        </div>
      </div>
    </div>
  );
}

export default TimetableGrid;
