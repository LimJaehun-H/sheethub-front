import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Join from './pages/Join';
import Sheets from './pages/Sheets';
import AddSheet from './pages/AddSheet';
import Comments from './pages/Comments';
import MyComments from './pages/MyComments';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/sheets" element={<PrivateRoute><Sheets /></PrivateRoute>} />
        <Route path="/sheets/new" element={<PrivateRoute><AddSheet /></PrivateRoute>} />
        <Route path="/sheets/:sheetId/comments" element={<PrivateRoute><Comments /></PrivateRoute>} />
        <Route path="/my-comments" element={<PrivateRoute><MyComments /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}