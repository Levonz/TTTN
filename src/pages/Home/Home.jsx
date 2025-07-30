import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTables } from '../../context/TableContext'; // Lấy hook useTables

const Home = () => {
  const [sectionActiveStatus, setSectionActiveStatus] = useState('empty');
  const navigate = useNavigate();
  const { tables } = useTables(); // Lấy danh sách bàn từ context

  // 🔐 Kiểm tra role trước khi render
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'employee') {
      alert('Bạn không có quyền truy cập trang này.');
      navigate('/');
    }
  }, [navigate]);

  const reservedTables = tables.filter((table) => table.status === 'reserved');

  const handleTableClick = (table) => {
    if (table.status === 'empty') {
      navigate(`/reserve-table/${table.id}`);
    } else {
      navigate(`/table-order/${table.id}`);
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="home-header-first-line">
          <div className="home-header-navbar">
            <Link to="/home" className="home-header-navbar-home-btn">
              HOME
            </Link>
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
          <div className="user-info">
            <FontAwesomeIcon icon={faCircleUser} />
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
                  className="section-table-item"
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
                  className="section-table-item"
                  onClick={() => handleTableClick(table)}
                >
                  {table.label}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
