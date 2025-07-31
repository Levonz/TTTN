import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      alert('Bạn không có quyền truy cập trang này.');
      navigate('/');
    }
  }, [navigate]);

  const username = localStorage.getItem('username') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('token'); // nếu có
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    // Có thể remove thêm các thông tin khác nếu có lưu
    navigate('/'); // hoặc '/' tuỳ theo flow
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Xin chào, {username}</h1>
        <button
          className="logout-btn"
          onClick={handleLogout}
          style={{
            background: 'var(--primary-color, #e61f26)',
            color: '#fff',
            border: 'none',
            padding: '7px 16px',
            borderRadius: '7px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Đăng xuất
        </button>
      </div>

      <div className="admin-section">
        <Link to="/admin/tables" className="admin-card">
          <h3>Quản lý bàn ăn</h3>
          <p>Thêm, sửa, xóa bàn và trạng thái đặt</p>
        </Link>

        <Link to="/admin/menus" className="admin-card">
          <h3>Quản lý món ăn</h3>
          <p>Cập nhật danh sách món, giá, loại</p>
        </Link>

        <Link to="/admin/invoices" className="admin-card">
          <h3>Quản lý hóa đơn</h3>
          <p>Xem lịch sử hóa đơn theo ngày, bàn</p>
        </Link>

        <Link to="/admin/staff" className="admin-card">
          <h3>Quản lý nhân viên</h3>
          <p>Thêm tài khoản, gán quyền, reset mật khẩu</p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
