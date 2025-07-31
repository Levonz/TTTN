import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StaffManager.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/staff';
const initialForm = {
  username: '',
  name: '',
  role: 'staff',
  phone: '',
  password: '',
};

const StaffManager = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStaffList(res.data);
    } catch (err) {
      alert('Không lấy được danh sách nhân viên');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openAddModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  // Khi sửa thì hiện modal và set giá trị form
  const openEditModal = (staff) => {
    setForm({
      username: staff.username,
      name: staff.name,
      role: staff.role,
      phone: staff.phone,
      password: '',
    });
    setEditingId(staff.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  // Khi nhập trên form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Thêm hoặc sửa nhân viên
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { password, ...dataToUpdate } = form;
        await axios.put(`${API_URL}/${editingId}`, dataToUpdate);
      } else {
        await axios.post(API_URL, form);
      }
      fetchStaff();
      closeModal();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        alert(err.response.data.detail);
      } else {
        alert('Thao tác thất bại!');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStaff();
      } catch (err) {
        alert('Xóa không thành công');
      }
    }
  };

  return (
    <div className="staff-manager-container">
      <div className="staff-manager-header">
        <h1>Quản lý Nhân viên</h1>
        <button
          className="staff-manager-back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Quay lại
        </button>
      </div>
      <button className="staff-manager-add-btn" onClick={openAddModal}>
        + Thêm nhân viên
      </button>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="staff-manager-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Tên NV</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr key={s.id}>
                <td>{s.username}</td>
                <td>{s.name}</td>
                <td>{s.role === 'admin' ? 'Quản trị' : 'Nhân viên'}</td>
                <td>{s.phone}</td>
                <td>
                  {s.created_at
                    ? new Date(s.created_at).toLocaleDateString()
                    : ''}
                </td>
                <td className="staff-manager-actions">
                  <button onClick={() => openEditModal(s)}>Sửa</button>
                  <button onClick={() => handleDelete(s.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div className="staff-manager-modal-overlay" onClick={closeModal}>
          <div
            className="staff-manager-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeModal} title="Đóng">
              &times;
            </button>
            <h2>{editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Tài khoản đăng nhập"
                required
                disabled={!!editingId}
              />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tên nhân viên"
                required
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị</option>
              </select>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
              />
              {!editingId && (
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  required
                />
              )}
              <div className="modal-btn-row">
                <button className="submit-btn" type="submit">
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={closeModal}
                >
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
