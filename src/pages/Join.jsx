import { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Join() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      await api.post('/sheetHub/join', { username, password });
      navigate('/login');
    } catch (e) {
      setError(e.response?.data || '회원가입 실패');
    }
  };

  return (
    <div style={styles.container}>
      <h2>회원가입</h2>
      <input style={styles.input} placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} />
      <input style={styles.input} placeholder="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.button} onClick={handleJoin}>회원가입</button>
      <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: '100px auto', display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' },
  button: { padding: 10, fontSize: 16, backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  error: { color: 'red' },
};
