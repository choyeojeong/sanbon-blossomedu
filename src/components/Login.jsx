// src/components/Login.jsx
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (id === 'blossom' && pw === '471466') {
      navigate('/dashboard');
    } else {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} style={{ width: '300px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>산본 블라썸에듀 로그인</h2>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            required
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '0.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px' }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
