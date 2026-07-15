import { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Sheets() {
  const [sheets, setSheets] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

    const handleDownload = async (id) => {
    try {
        const res = await api.get(`/sheetHub/sheets/${id}/file`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `sheet_${id}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (e) {
        alert(e.response?.data || '다운로드 실패');
        }
    };
  
  const fetchSheets = async (searchTitle = '') => {
    try {
      const url = searchTitle ? `/sheetHub/sheets?title=${searchTitle}` : '/sheetHub/sheets';
      const res = await api.get(url);
      setSheets(res.data);
    } catch (e) {
      alert('악보 조회 실패');
    }
  };

  useEffect(() => {
    fetchSheets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await api.delete(`/sheetHub/sheets/${id}`);
      fetchSheets();
    } catch (e) {
      alert(e.response?.data || '삭제 실패');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🥁 SheetHub</h2>
        <div style={styles.headerButtons}>
          <Link to="/my-comments" style={styles.link}>내 댓글</Link>
          <Link to="/sheets/new" style={styles.link}>악보 등록</Link>
          <button style={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <div style={styles.searchBar}>
        <input
          style={styles.input}
          placeholder="제목으로 검색"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button style={styles.button} onClick={() => fetchSheets(title)}>검색</button>
        <button style={styles.resetButton} onClick={() => { setTitle(''); fetchSheets(); }}>전체</button>
      </div>

      {sheets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>등록된 악보가 없습니다.</p>
      ) : (
        sheets.map(sheet => (
          <div key={sheet.id} style={styles.card}>
            <div>
              <p style={styles.title}>{sheet.title}</p>
              <p style={styles.artist}>{sheet.artist}</p>
            </div>
            <div style={styles.cardButtons}>
                <button style={styles.downloadButton} onClick={() => handleDownload(sheet.id)}>다운로드</button>
                <Link to={`/sheets/${sheet.id}/comments`} style={styles.link}>댓글 보기</Link>
                <button style={styles.deleteButton} onClick={() => handleDelete(sheet.id)}>삭제</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
    
  container: { maxWidth: 700, margin: '40px auto', padding: '0 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerButtons: { display: 'flex', gap: 12, alignItems: 'center' },
  searchBar: { display: 'flex', gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' },
  button: { padding: '10px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  resetButton: { padding: '10px 16px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  logoutButton: { padding: '8px 14px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 },
  cardButtons: { display: 'flex', gap: 8, alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 16, margin: 0 },
  artist: { color: '#666', margin: '4px 0 0' },
  link: { color: '#4f46e5', textDecoration: 'none', fontSize: 14 },
  deleteButton: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  downloadButton: { padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }
};