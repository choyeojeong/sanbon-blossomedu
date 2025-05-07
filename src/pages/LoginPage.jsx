// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === 'blossom' && password === '471466') {
      navigate('/dashboard');
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', fontWeight: 'bold' }}>산본 블라썸에듀 로그인</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="아이디 입력"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
