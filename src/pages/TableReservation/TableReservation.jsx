import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTables } from '../../context/TableContext';
import { useEffect } from 'react';
import './TableReservation.css';

const TableReservation = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { getTableById, updateTableStatus } = useTables();

  const table = getTableById(tableId);

  // 🔐 Thêm kiểm tra: Nếu bàn đã được đặt, chuyển hướng đến trang order
  useEffect(() => {
    // Nếu tìm thấy bàn và bàn không trống
    if (table && table.status !== 'empty') {
      navigate(`/table-order/${table.id}`, { replace: true });
    }
  }, [table, navigate, tableId]);

  // Nếu không tìm thấy bàn, hiển thị thông báo
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

  const handleReserveTable = () => {
    // 1. Cập nhật trạng thái bàn thành "reserved" thông qua context
    updateTableStatus(table.id, 'reserved');
    // 2. Chuyển hướng đến trang order chính thức
    navigate(`/table-order/${table.id}`);
  };

  return (
    <div className="reservation-page">
      <div className="reservation-container">
        <h1>Xác nhận đặt bàn</h1>
        <h2>{table.label}</h2>
        <p>Bàn này hiện đang trống. Bạn có muốn đặt bàn không?</p>
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
