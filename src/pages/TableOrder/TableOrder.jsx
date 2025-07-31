import './TableOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTables } from '../../context/TableContext';

const categories = [
  { key: 'Món chính', label: 'Món chính' },
  { key: 'Đồ uống', label: 'Đồ uống' },
  { key: 'Tráng miệng', label: 'Tráng miệng' },
  { key: 'Món khai vị', label: 'Món khai vị' },
];

const TableOrder = () => {
  const { tableId } = useParams();
  const {
    tables,
    getTableById,
    addItemToCart,
    refreshTables,
    getCartByTableId,
  } = useTables();
  const [activeCategory, setActiveCategory] = useState('Món chính');
  const [menus, setMenus] = useState([]);
  const navigate = useNavigate();
  const cartItems = getCartByTableId(tableId) || [];
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  useEffect(() => {
    // Lấy menu mỗi 30s tự refresh
    const fetchMenus = () => {
      fetch('http://localhost:8000/api/menus')
        .then((res) => res.json())
        .then((data) => setMenus(data))
        .catch((err) => {});
    };
    fetchMenus();
    const interval = setInterval(fetchMenus, 30000);
    return () => clearInterval(interval);
  }, []);

  const reservedTables = tables.filter((table) => table.status === 'reserved');
  const table = getTableById(tableId);

  const handleCancelTable = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy bàn này?')) return;
    try {
      const res = await fetch(
        `http://localhost:8000/api/tables/${tableId}/cancel`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error('Hủy bàn thất bại!');
      alert('Bàn đã được hủy!');
      await refreshTables();
      navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!table) {
    return (
      <div>
        <h2>Không tìm thấy bàn!</h2>
        <Link to="/home">Quay về trang chủ</Link>
      </div>
    );
  }

  const filteredMenus = menus.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div className="table-order-page">
      <div className="table-order-header">
        <div className="table-order-header-first-line">
          <div className="table-order-header-navbar-wrapper">
            <Link to="/home" className="table-order-header-navbar-home-btn">
              HOME
            </Link>
            <div className="table-order-header-navbar-scroll">
              {reservedTables.map((reservedTable) => (
                <Link
                  key={reservedTable.id}
                  to={`/table-order/${reservedTable.id}`}
                  className={`table-nav-btn ${
                    reservedTable.id === tableId ? 'table-nav-btn--active' : ''
                  }`}
                >
                  {reservedTable.label}
                </Link>
              ))}
            </div>
          </div>
          <Link to={`/cart/${tableId}`} className="cart">
            <FontAwesomeIcon icon={faCartShopping} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
        <div className="table-order-header-third-line">
          {categories.map((category) => (
            <a
              key={category.key}
              href="#"
              className={`menu-category-section ${
                activeCategory === category.key
                  ? 'menu-category-section--active'
                  : ''
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </a>
          ))}
        </div>
      </div>
      <div className="table-order-current-table-label">
        {table && <span>{table.label}</span>}
      </div>
      <div className="table-order-page-content">
        <div className="table-order-section">
          <div className="table-order-section-content">
            {filteredMenus.length === 0 && <div>Không có món nào!</div>}
            {filteredMenus.map((item) => (
              <div key={item.id} className="table-order-section-item">
                <div className="item-img">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="img-placeholder">No Image</div>
                  )}
                </div>
                <p className="item-name">{item.name}</p>
                <div className="item-addition-container">
                  <p className="item-price">{item.price?.toLocaleString()} đ</p>
                  <div
                    className="item-add-btn"
                    onClick={() => addItemToCart(tableId, item)}
                  >
                    +
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleCancelTable} className="cancel-table-btn">
        Hủy bàn
      </button>
    </div>
  );
};

export default TableOrder;
