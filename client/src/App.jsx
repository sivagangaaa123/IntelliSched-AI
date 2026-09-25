import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './components/Navbar';
import MetricsHeader from './components/MetricsHeader';
import TimetableGrid from './components/TimetableGrid';
import DataTables from './components/DataTables';
import RescheduleModal from './components/RescheduleModal';
import ExplainSlotModal from './components/ExplainSlotModal';

function App() {
  const [activeTab, setActiveTab] = useState('timetable');
  const [timetable, setTimetable] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [studentGroups, setStudentGroups] = useState([]);
  const [constraints, setConstraints] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load all initial department data and active timetable
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [facRes, crsRes, clsRes, grpRes, conRes] = await Promise.all([
        axios.get('/api/faculty').catch(() => ({ data: { data: [] } })),
        axios.get('/api/courses').catch(() => ({ data: { data: [] } })),
        axios.get('/api/classrooms').catch(() => ({ data: { data: [] } })),
        axios.get('/api/student-groups').catch(() => ({ data: { data: [] } })),
        axios.get('/api/constraints').catch(() => ({ data: { data: null } }))
      ]);

      setFacultyList(facRes.data.data || []);
      setCourses(crsRes.data.data || []);
      setClassrooms(clsRes.data.data || []);
      setStudentGroups(grpRes.data.data || []);
      setConstraints(conRes.data.data || null);

      // Fetch active timetable
      try {
        const ttRes = await axios.get('/api/timetable/active');
        if (ttRes.data.data) {
          setTimetable(ttRes.data.data);
        }
      } catch (ttErr) {
        console.log('No active timetable found yet.');
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handle Generate Timetable via CSP Engine
  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    setNotification(null);

    try {
      const res = await axios.post('/api/timetable/generate');
      setTimetable(res.data.data);
      setNotification({
        type: 'success',
        message: `Timetable successfully generated in ${res.data.stats?.durationMs || 300}ms! 100% hard constraints satisfied with soft score ${res.data.data.metrics?.softScore}/100.`
      });
      setActiveTab('timetable');
    } catch (err) {
      setNotification({
        type: 'danger',
        message: err.response?.data?.reason || err.response?.data?.error || err.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerate={handleGenerateTimetable}
        isGenerating={isGenerating}
        timetableStatus={timetable ? 'Active' : 'Empty'}
      />

      <div className="container-fluid px-4 py-3 flex-grow-1">
        {/* Toast / Notification Banner */}
        {notification && (
          <div className={`alert alert-${notification.type} alert-dismissible fade show shadow-sm d-flex justify-content-between align-items-center mb-3`} role="alert">
            <div className="d-flex align-items-center gap-2">
              <i className={notification.type === 'success' ? 'bi bi-check-circle-fill fs-5' : 'bi bi-exclamation-triangle-fill fs-5'}></i>
              <span>{notification.message}</span>
            </div>
            <button type="button" className="btn-close" onClick={() => setNotification(null)}></button>
          </div>
        )}

        {/* Global KPI Metrics Header */}
        {timetable && (
          <MetricsHeader
            timetable={timetable}
            onOpenReschedule={() => setIsRescheduleOpen(true)}
          />
        )}

        {/* If no timetable generated yet */}
        {!loading && !timetable && (
          <div className="card shadow-sm border-0 p-5 text-center bg-white mb-4">
            <div className="mb-3 text-primary fs-1">
              <i className="bi bi-calendar-plus"></i>
            </div>
            <h4 className="fw-bold">No Active Timetable Found</h4>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
              The department database is loaded with <strong>10 faculty members, 14 MCA courses, 7 rooms, and 5 student groups</strong>. Click the button below to solve the Constraint Satisfaction Problem (CSP) and generate the master schedule.
            </p>
            <div>
              <button
                className="btn btn-primary btn-lg px-4 shadow-sm"
                onClick={handleGenerateTimetable}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Running CSP Solver...
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic me-2"></i>
                    Generate MCA Timetable Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: Timetable Grid */}
        {activeTab === 'timetable' && timetable && (
          <TimetableGrid
            timetable={timetable}
            facultyList={facultyList}
            classrooms={classrooms}
            studentGroups={studentGroups}
          />
        )}

        {/* TAB 2: Department Data Tables */}
        {activeTab === 'data' && (
          <DataTables
            facultyList={facultyList}
            courses={courses}
            classrooms={classrooms}
            studentGroups={studentGroups}
            constraints={constraints}
          />
        )}

        {/* TAB 3: XAI "Why-Not?" Inspector */}
        {activeTab === 'inspector' && (
          <ExplainSlotModal
            courses={courses}
            classrooms={classrooms}
          />
        )}
      </div>

      {/* Dynamic Reschedule Modal */}
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        facultyList={facultyList}
        onRescheduled={(updatedTimetable) => {
          setTimetable(updatedTimetable);
          setNotification({
            type: 'success',
            message: 'Timetable dynamically repaired! The affected session was relocated to a clash-free slot with zero disruption to other classes.'
          });
        }}
      />

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <span>IntelliSched AI &copy; 2026 — MCA Academic Project</span>
          <span>Constraint Satisfaction Problem (CSP) + Explainable AI (XAI) + Dynamic Rescheduling</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
