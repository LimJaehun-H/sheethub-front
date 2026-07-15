import { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function MyComments() {
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyComments = async () => {
      try {
        const res = await api.get('/sheetHub/members/comments');
        setComments(res.data);
      } catch (e) {
        alert('댓글 조회 실패');
      }
    };
    fetchMyComments();
  }, []);

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/sheets')}>← 목록으로</button>
      <h2>내 댓글 모아보기</h2>

      {comments.length === 0 ? (
        <p style={{ color: '#888' }}>작성한 댓글이 없습니다.</p>
      ) : (
        comments.map(c => (
          <div key={c.commentId} style={styles.card}>
            <p style={styles.comment}>{c.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '40px auto', padding: '0 16px' },
  backButton: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: 14, marginBottom: 16 },
  card: { padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 },
  comment: { margin: 0 },
};