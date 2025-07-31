import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TableManager.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/tables';

const TableManager = () => {
  const [tableList, setTableList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: '', capacity: 4, status: 'empty' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTableList(res.data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openAddModal = () => {
    setForm({ label: '', capacity: 4, status: 'empty' });
    setEditingId(null);
    setShowModal(true);
    setError('');
  };

  // Chỉnh thông tin bàn
  const openEditModal = (t) => {
    setForm({
      label: t.label,
      capacity: t.capacity,
      status: t.status,
    });
    setEditingId(t.id);
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ label: '', capacity: 4, status: 'empty' });
    setError('');
  };

  // Khi nhập trên form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'capacity' ? Number(value) : value });
  };

  // Thêm/sửa bàn
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) {
      setError('Chưa nhập tên bàn');
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchTables();
      closeModal();
    } catch (err) {
      setError('Có lỗi xảy ra, thử lại sau');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa bàn này luôn?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTables();
      } catch (err) {}
    }
  };

  return (
    <div className="table-manager-container">
      <button
        className="table-manager-back-btn"
        onClick={() => navigate('/admin')}
      >
        ← Quay lại
      </button>
      <div className="table-manager-header">
        <div>
          <h1>Quản lý bàn ăn</h1>
          <p>Thêm, sửa, xóa bàn, đổi trạng thái</p>
        </div>
        <button className="table-manager-add-btn" onClick={openAddModal}>
          + Thêm bàn
        </button>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="table-manager-table">
          <thead>
            <tr>
              <th>Tên bàn</th>
              <th>Số người</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tableList.map((t) => (
              <tr key={t.id}>
                <td>{t.label}</td>
                <td>{t.capacity}</td>
                <td>{t.status === 'empty' ? 'Trống' : 'Đã đặt'}</td>
                <td className="table-manager-actions">
                  <button onClick={() => openEditModal(t)}>Sửa</button>
                  <button onClick={() => handleDelete(t.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showModal && (
        <div className="table-manager-modal-overlay" onClick={closeModal}>
          <div
            className="table-manager-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeModal}>
              &times;
            </button>
            <h2>{editingId ? 'Cập nhật bàn' : 'Thêm bàn mới'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Tên bàn"
                required
                autoFocus
              />
              <select
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
              >
                <option value={4}>Bàn 4 người</option>
                <option value={6}>Bàn 6 người</option>
              </select>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="empty">Trống</option>
                <option value="reserved">Đã đặt</option>
              </select>
              {error && (
                <div style={{ color: '#e61f26', marginTop: 6 }}>{error}</div>
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

export default TableManager;
