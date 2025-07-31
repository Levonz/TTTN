import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TableManager.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/tables';
const initialForm = { label: '', capacity: 4, status: 'empty' };

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTables(res.data);
    } catch (err) {
      alert('Không lấy được danh sách bàn');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openAddModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (table) => {
    setForm({
      label: table.label,
      capacity: table.capacity,
      status: table.status,
    });
    setEditingId(table.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'capacity' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...form,
      capacity: parseInt(form.capacity, 10), // Ép về số nguyên
    };
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, submitData);
      } else {
        await axios.post(API_URL, submitData);
      }
      fetchTables();
      closeModal();
    } catch (err) {
      alert('Thao tác thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bàn này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchTables();
      } catch (err) {
        alert('Xóa không thành công');
      }
    }
  };

  return (
    <div className="table-manager-container">
      <div className="table-manager-header">
        <h1>Quản lý Bàn ăn</h1>
        <button
          className="table-manager-back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Quay lại
        </button>
      </div>
      <button className="table-manager-add-btn" onClick={openAddModal}>
        + Thêm bàn ăn
      </button>
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
            {tables.map((table) => (
              <tr key={table.id}>
                <td>{table.label}</td>
                <td>{table.capacity}</td>
                <td>{table.status === 'reserved' ? 'Đã đặt' : 'Trống'}</td>
                <td>
                  <div className="table-manager-actions">
                    <button onClick={() => openEditModal(table)}>Sửa</button>
                    <button onClick={() => handleDelete(table.id)}>Xóa</button>
                  </div>
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
            <button className="close-modal" onClick={closeModal} title="Đóng">
              &times;
            </button>
            <h2>{editingId ? 'Cập nhật bàn ăn' : 'Thêm bàn ăn mới'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="Tên bàn"
                required
              />
              <select
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                required
              >
                <option value="">Chọn số người</option>
                <option value={4}>Bàn 4 người</option>
                <option value={6}>Bàn 6 người</option>
              </select>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="empty">Trống</option>
                <option value="reserved">Đã đặt</option>
              </select>
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
