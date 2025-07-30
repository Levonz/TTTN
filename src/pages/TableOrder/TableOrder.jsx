import './TableOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTables } from '../../context/TableContext';

// Danh sách các danh mục đúng với dữ liệu thực tế bạn đã seed
const categories = [
  { key: 'main', label: 'Món chính' },
  { key: 'drink', label: 'Đồ uống' },
  { key: 'dessert', label: 'Tráng miệng' },
];

const TableOrder = () => {
  const { tableId } = useParams();
  const { tables, getTableById, addItemToCart } = useTables();
  // Không cần activeMenuType nữa
  const [activeCategory, setActiveCategory] = useState('main');
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/menus')
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error('Lỗi lấy menu:', err));
  }, []);

  const reservedTables = tables.filter((table) => table.status === 'reserved');
  const table = getTableById(tableId);

  if (!table) {
    return (
      <div>
        <h2>Không tìm thấy bàn!</h2>
        <Link to="/home">Quay về trang chủ</Link>
      </div>
    );
  }

  // Lọc menu chỉ theo category thôi!
  const filteredMenus = menus.filter((item) => item.category === activeCategory);

  return (
    <div className="table-order-page">
      <div className="table-order-header">
        <div className="table-order-header-first-line">
          <div className="table-order-header-navbar">
            <Link to="/home" className="table-order-header-navbar-home-btn">
              HOME
            </Link>
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
          <Link to={`/cart/${tableId}`} className="cart">
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
          <div className="user-info">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
        </div>

        <div className="table-order-header-third-line">
          {categories.map((category) => (
            <a
              key={category.key}
              href="#"
              className={`menu-category-section ${
                activeCategory === category.key ? 'menu-category-section--active' : ''
              }`}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </a>
          ))}
        </div>
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
                  <p className="item-price">
                    {item.price?.toLocaleString()} đ
                  </p>
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
    </div>
  );
};

export default TableOrder;
