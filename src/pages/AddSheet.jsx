import { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AddSheet() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdd = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('file', file);
      await api.post('/sheetHub/sheets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/sheets');
    } catch (e) {
      setError(e.response?.data || '등록 실패');
    }
  };

  return (
    <div style={styles.container}>
      <h2>악보 등록</h2>
      <input style={styles.input} placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} />
      <input style={styles.input} placeholder="아티스트" value={artist} onChange={e => setArtist(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      {error && <p style={styles.error}>{error}</p>}
      <button style={styles.button} onClick={handleAdd}>등록</button>
      <button style={styles.cancelButton} onClick={() => navigate('/sheets')}>취소</button>
    </div>
  );
}

const styles = {
  container: { maxWidth: 400, margin: '100px auto', display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' },
  button: { padding: 10, fontSize: 16, backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  cancelButton: { padding: 10, fontSize: 16, backgroundColor: '#888', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  error: { color: 'red' },
};