import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTables } from '../../context/TableContext';

const Home = () => {
  const [sectionActiveStatus, setSectionActiveStatus] = useState('empty');
  const { tables, refreshTables } = useTables();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservationError, setReservationError] = useState('');
  const [isReserving, setIsReserving] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'employee' && role !== 'staff') {
      alert('Bạn không có quyền truy cập trang này.');
      navigate('/');
    }
  }, [navigate]);

  const reservedTables = tables.filter((table) => table.status === 'reserved');

  // Sửa lại: khi click vào bàn trống thì mở modal, bàn đã đặt thì vào TableOrder
  const handleTableClick = (table) => {
    if (table.status === 'empty') {
      setSelectedTable(table);
      setShowReservationModal(true);
      setReservationError('');
    } else {
      navigate(`/table-order/${table.id}`);
    }
  };

  // Đặt bàn bằng modal
  const handleReserveTable = async () => {
    if (!selectedTable) return;
    setIsReserving(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/tables/${selectedTable.id}/reserve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.detail || 'Đặt bàn thất bại');
      }

      setReservationError('');
      setShowReservationModal(false);
      setSelectedTable(null);

      if (typeof refreshTables === 'function') refreshTables();
    } catch (err) {
      setReservationError(err.message);
    }
    setIsReserving(false);
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-header-first-line">
          <div className="home-header-navbar-wrapper">
            <Link to="/home" className="home-header-navbar-home-btn">
              HOME
            </Link>
            <div className="home-header-navbar-scroll">
              {reservedTables.map((table) => (
                <Link
                  key={table.id}
                  to={`/table-order/${table.id}`}
                  className="table-nav-btn"
                >
                  {table.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="user-info-wrapper">
            <div
              className="user-info"
              onClick={() => setShowUserInfo(!showUserInfo)}
            >
              <FontAwesomeIcon icon={faCircleUser} />
            </div>
            {showUserInfo && (
              <div className="user-popup">
                <p>
                  <strong>{username}</strong>
                </p>
                <p>Role: {role}</p>
                <button onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </div>
        </div>

        <div className="home-header-second-line">
          <a
            href="#"
            className={`table-status-section ${
              sectionActiveStatus === 'empty'
                ? 'table-status-section--active'
                : ''
            }`}
            onClick={() => setSectionActiveStatus('empty')}
          >
            Bàn trống
          </a>
          <a
            href="#"
            className={`table-status-section ${
              sectionActiveStatus === 'reserved'
                ? 'table-status-section--active'
                : ''
            }`}
            onClick={() => setSectionActiveStatus('reserved')}
          >
            Bàn đã đặt
          </a>
        </div>
      </div>

      <div className="home-page-content">
        <div className="section" id="4pTable">
          <p className="section-header">Bàn 4 người</p>
          <div className="section-content">
            {tables
              .filter(
                (table) =>
                  table.capacity === 4 && table.status === sectionActiveStatus
              )
              .map((table) => (
                <div
                  key={table.id}
                  className={`section-table-item ${
                    table.status === 'empty'
                      ? 'section-table-item--available'
                      : ''
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  {table.label}
                </div>
              ))}
          </div>
        </div>

        <div className="section" id="6pTable">
          <p className="section-header">Bàn 6 người</p>
          <div className="section-content">
            {tables
              .filter(
                (table) =>
                  table.capacity === 6 && table.status === sectionActiveStatus
              )
              .map((table) => (
                <div
                  key={table.id}
                  className={`section-table-item ${
                    table.status === 'empty'
                      ? 'section-table-item--available'
                      : ''
                  }`}
                  onClick={() => handleTableClick(table)}
                >
                  {table.label}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal đặt bàn */}
      {showReservationModal && selectedTable && (
        <div
          className="reservation-modal-overlay"
          onClick={() => setShowReservationModal(false)}
        >
          <div
            className="reservation-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Xác nhận đặt bàn</h1>
            <h2>{selectedTable.label}</h2>
            <p>Bàn này hiện đang trống. Bạn có muốn đặt bàn không?</p>
            {reservationError && (
              <p className="error-text">{reservationError}</p>
            )}
            <button
              onClick={handleReserveTable}
              className="reserve-button"
              disabled={isReserving}
            >
              {isReserving ? 'Đang đặt...' : 'Đặt bàn'}
            </button>
            <button
              onClick={() => setShowReservationModal(false)}
              className="cancel-button"
              disabled={isReserving}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
