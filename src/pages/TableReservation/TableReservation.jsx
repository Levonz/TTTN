import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTables } from '../../context/TableContext';
import { useState } from 'react';
import './TableReservation.css';

const TableReservation = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { getTableById } = useTables();

  const table = getTableById(tableId);
  const [error, setError] = useState('');

  if (!table) {
    return (
      <div className="reservation-page">
        <div className="reservation-container">
          <h1>Không tìm thấy bàn!</h1>
          <Link to="/home">Quay về trang chủ</Link>
        </div>
      </div>
    );
  }

  const handleReserveTable = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/tables/${table.id}/reserve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), // Gửi rỗng
        }
      );

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.detail || 'Đặt bàn thất bại');
      }

      navigate(`/table-order/${table.id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <h1>Xác nhận đặt bàn</h1>
        <h2>{table.label}</h2>
        <p>Bàn này hiện đang trống. Bạn có muốn đặt bàn không?</p>

        {error && <p className="error-text">{error}</p>}

        <button onClick={handleReserveTable} className="reserve-button">
          Đặt bàn
        </button>
        <button onClick={() => navigate('/home')} className="cancel-button">
          Hủy
        </button>
      </div>
    </div>
  );
};

export default TableReservation;
