import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MenuManager.css';

const API_URL = 'http://localhost:8000/api/menus';

const initialForm = {
  name: '',
  category: '',
  price: '',
  image: '',
};

const MenuManager = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setMenus(res.data);
    } catch (err) {
      alert('Không lấy được danh sách món ăn');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const openAddModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (menu) => {
    setForm({
      name: menu.name,
      category: menu.category,
      price: menu.price,
      image: menu.image,
    });
    setEditingId(menu.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchMenus();
      closeModal();
    } catch (err) {
      alert('Thao tác thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMenus();
      } catch (err) {
        alert('Xóa không thành công');
      }
    }
  };

  return (
    <div className="menu-manager-container">
      <div className="menu-manager-header">
        <h1>Quản lý Món ăn</h1>
        <button
          className="menu-manager-back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Quay lại
        </button>
      </div>
      <button className="menu-manager-add-btn" onClick={openAddModal}>
        + Thêm món ăn
      </button>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="menu-manager-table">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id}>
                <td>{menu.name}</td>
                <td>{menu.category}</td>
                <td>{menu.price}</td>
                <td>
                  {menu.image ? (
                    <img src={menu.image} alt="img" width={60} />
                  ) : (
                    'Không có ảnh'
                  )}
                </td>
                <td>
                  <div className="menu-manager-actions">
                    <button onClick={() => openEditModal(menu)}>Sửa</button>
                    <button onClick={() => handleDelete(menu.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="menu-manager-modal-overlay" onClick={closeModal}>
          <div
            className="menu-manager-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeModal} title="Đóng">
              &times;
            </button>
            <h2>{editingId ? 'Cập nhật món ăn' : 'Thêm món ăn mới'}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tên món ăn"
                required
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Danh mục</option>
                <option value="Món chính">Món chính</option>
                <option value="Đồ uống">Đồ uống</option>
                <option value="Tráng miệng">Tráng miệng</option>
                <option value="Món khai vị">Món khai vị</option>
              </select>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Giá"
                type="number"
                min="0"
                required
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Link ảnh (tuỳ chọn)"
              />
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

export default MenuManager;
