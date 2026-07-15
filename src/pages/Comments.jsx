import { useState, useEffect } from 'react';
import api from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function Comments() {
  const { sheetId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const res = await api.get(`/sheetHub/sheets/${sheetId}/comments`);
      setComments(res.data);
    } catch (e) {
      alert('댓글 조회 실패');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/sheetHub/sheets/${sheetId}/comments`, { comment: newComment });
      setNewComment('');
      fetchComments();
    } catch (e) {
      alert(e.response?.data || '댓글 등록 실패');
    }
  };

  const handleUpdate = async (commentId) => {
    try {
      await api.put(`/sheetHub/sheets/${sheetId}/comments/${commentId}`, { comment: editContent });
      setEditId(null);
      fetchComments();
    } catch (e) {
      alert(e.response?.data || '수정 실패');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await api.delete(`/sheetHub/sheets/${sheetId}/comments/${commentId}`);
      fetchComments();
    } catch (e) {
      alert(e.response?.data || '삭제 실패');
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/sheets')}>← 목록으로</button>
      <h2>댓글</h2>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          disabled={editId !== null}
        />
        <button style={{...styles.button, opacity: editId !== null ? 0.4 : 1}} onClick={handleAdd} disabled={editId !== null}>등록</button>
      </div>

      {comments.length === 0 ? (
        <p style={{ color: '#888' }}>댓글이 없습니다.</p>
      ) : (
        comments.map(c => (
          <div key={c.id} style={styles.card}>
            {editId === c.id ? (
              <div style={styles.editRow}>
                <input
                  style={styles.input}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                />
                <button style={styles.button} onClick={() => handleUpdate(c.id)}>저장</button>
                <button style={styles.cancelButton} onClick={() => setEditId(null)}>취소</button>
              </div>
            ) : (
              <>
                <div>
                  <p style={styles.name}>{c.name}</p>
                  <p style={styles.comment}>{c.comment}</p>
                </div>
                <div style={styles.cardButtons}>
                  <button style={styles.editButton} onClick={() => { setEditId(c.id); setEditContent(c.comment); }}>수정</button>
                  <button style={styles.deleteButton} onClick={() => handleDelete(c.id)}>삭제</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 700, margin: '40px auto', padding: '0 16px' },
  backButton: { background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: 14, marginBottom: 16 },
  inputRow: { display: 'flex', gap: 8, marginBottom: 24 },
  editRow: { display: 'flex', gap: 8, flex: 1 },
  input: { flex: 1, padding: 10, fontSize: 16, borderRadius: 6, border: '1px solid #ccc' },
  button: { padding: '10px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  cancelButton: { padding: '10px 16px', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' },
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 },
  cardButtons: { display: 'flex', gap: 8 },
  name: { fontWeight: 'bold', fontSize: 14, margin: 0, color: '#4f46e5' },
  comment: { margin: '4px 0 0' },
  editButton: { padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  deleteButton: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
};