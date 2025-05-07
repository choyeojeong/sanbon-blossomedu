// src/pages/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const goToStudentList = () => {
    navigate('/dashboard/students');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', fontWeight: 'bold' }}>산본 블라썸에듀 대시보드</h2>
      <button
        onClick={goToStudentList}
        style={{ padding: '0.75rem 2rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem' }}
      >
        학생 목록 보기
      </button>
    </div>
  );
}

export default DashboardPage;
