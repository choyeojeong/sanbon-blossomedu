// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentDashboard from './components/StudentDashboard';
import StudentList from './components/StudentList'; // 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/students" element={<StudentList />} /> {/* 추가 */}
        <Route path="/students/:id" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
