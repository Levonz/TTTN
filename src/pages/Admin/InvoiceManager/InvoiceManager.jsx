import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InvoiceManager.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api/invoices';

const InvoiceManager = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setInvoices(res.data);
    } catch (err) {
      alert('Không lấy được danh sách hóa đơn');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Xem chi tiết hóa đơn
  const handleViewDetail = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setDetail(res.data);
      setShowDetail(true);
    } catch (err) {
      alert('Không lấy được chi tiết hóa đơn');
    }
  };

  const closeDetail = () => {
    setShowDetail(false);
    setDetail(null);
  };

  // Xóa hóa đơn
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa hóa đơn này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchInvoices();
      } catch (err) {
        alert('Xóa không thành công');
      }
    }
  };

  return (
    <div className="invoice-manager-container">
      <div className="invoice-manager-header">
        <h1>Quản lý Hóa đơn</h1>
        <button
          className="invoice-manager-back-btn"
          onClick={() => navigate('/admin')}
        >
          ← Quay lại
        </button>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="invoice-manager-table">
          <thead>
            <tr>
              <th>Bàn</th>
              <th>Tổng tiền</th>
              <th>Ngày giờ</th>
              <th>Nhân viên</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.table}</td>
                <td>{Number(inv.total).toLocaleString()} đ</td>
                <td>
                  {inv.created_at
                    ? new Date(inv.created_at).toLocaleString()
                    : ''}
                </td>
                <td>{inv.staff || 'N/A'}</td>
                <td>
                  <button onClick={() => handleViewDetail(inv.id)}>Xem</button>
                  <button onClick={() => handleDelete(inv.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showDetail && detail && (
        <div className="invoice-manager-modal-overlay" onClick={closeDetail}>
          <div
            className="invoice-manager-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeDetail} title="Đóng">
              &times;
            </button>
            <h2>Chi tiết hóa đơn</h2>
            <p>
              <b>Bàn:</b> {detail.table}
            </p>
            <p>
              <b>Thời gian:</b>{' '}
              {detail.created_at
                ? new Date(detail.created_at).toLocaleString()
                : ''}
            </p>
            <p>
              <b>Nhân viên:</b> {detail.staff || 'N/A'}
            </p>
            <table>
              <thead>
                <tr>
                  <th>Món</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {detail.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{Number(item.price).toLocaleString()} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{ marginTop: 18, fontWeight: 'bold', fontSize: '1.07rem' }}
            >
              Tổng tiền: {Number(detail.total).toLocaleString()} đ
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManager;
