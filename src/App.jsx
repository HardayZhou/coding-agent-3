import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import StudentManage from './views/StudentManage';
import Visualization from './views/Visualization';
import { StudentProvider } from './store/StudentContext';

function App() {
  return (
    <StudentProvider>
      <Router>
        <div id="app">
          <nav className="navbar">
            <div className="container">
              <h1 className="logo">学生管理系统</h1>
              <div className="nav-links">
                <NavLink
                  to="/student"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  学生管理
                </NavLink>
                <NavLink
                  to="/visualization"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  数据可视化
                </NavLink>
              </div>
            </div>
          </nav>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<StudentManage />} />
              <Route path="/student" element={<StudentManage />} />
              <Route path="/visualization" element={<Visualization />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StudentProvider>
  );
}

export default App;