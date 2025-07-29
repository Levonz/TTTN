import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này.');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Trang quản trị</h1>
      <p>Chào mừng admin!</p>
    </div>
  );
};

export default Admin;
