import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { motion } from 'framer-motion';

function DashboardCharts({ timetable, facultyList }) {
  if (!timetable || !timetable.grid) return null;

  const data = useMemo(() => {
    const typeCount = { Theory: 0, Lab: 0, Elective: 0, Seminar: 0 };
    const facultyLoad = {};

    timetable.grid.forEach(entry => {
      // Course Type
      const type = entry.course?.courseType || 'Theory';
      if (typeCount[type] !== undefined) typeCount[type]++;

      // Faculty Workload
      const facultyName = entry.faculty?.name || 'Unknown';
      facultyLoad[facultyName] = (facultyLoad[facultyName] || 0) + 1;
    });

    const pieData = Object.keys(typeCount).map(key => ({
      name: key,
      value: typeCount[key]
    })).filter(d => d.value > 0);

    const barData = Object.keys(facultyLoad).map(key => ({
      name: key.split(' ').slice(-1)[0], // Use last name for brevity
      sessions: facultyLoad[key]
    })).sort((a, b) => b.sessions - a.sessions);

    return { pieData, barData };
  }, [timetable, facultyList]);

  const COLORS = {
    Theory: '#1e3a8a',
    Lab: '#0d9488',
    Elective: '#f59e0b',
    Seminar: '#0284c7'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="row g-3 mb-4"
    >
      {/* Session Distribution Pie Chart */}
      <div className="col-md-4">
        <div className="card bg-white shadow-sm h-100 p-3">
          <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-pie-chart-fill me-2"></i>Session Distribution</h6>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Faculty Workload Bar Chart */}
      <div className="col-md-8">
        <div className="card bg-white shadow-sm h-100 p-3">
          <h6 className="fw-bold text-secondary mb-3"><i className="bi bi-bar-chart-fill me-2"></i>Faculty Weekly Workload (Periods)</h6>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardCharts;
