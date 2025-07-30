import './TableOrder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleUser,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTables } from '../../context/TableContext';
import tomYumImg from './img/tomyum.jpg'; // 1. Import ảnh

// Dữ liệu mẫu cho các món ăn

// Danh sách các danh mục để dễ dàng render
const categories = [
  { key: 'beef', label: 'Thịt bò' },
  { key: 'pork', label: 'Thịt heo' },
  { key: 'chicken', label: 'Thịt gà' },
  { key: 'dessert', label: 'Tráng miệng' },
];

const TableOrder = () => {
  const { tableId } = useParams();
  const { tables, getTableById, addItemToCart } = useTables(); // Lấy thêm hàm addItemToCart và danh sách bàn
  const [activeMenuType, setActiveMenuType] = useState('food');
  const [activeCategory, setActiveCategory] = useState('beef');
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/menus')
      .then((res) => res.json())
      .then((data) => setMenus(data))
      .catch((err) => console.error('Lỗi lấy menu:', err));
  }, []);

  // Lọc ra các bàn đã được đặt
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

  return (
    <div className="table-order-page">
      <div className="table-order-header">
        <div className="table-order-header-first-line">
          <div className="table-order-header-navbar">
            <Link to="/home" className="table-order-header-navbar-home-btn">
              HOME
            </Link>
            {/* Hiển thị các nút chuyển đổi giữa các bàn đã đặt */}
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
        <div className="table-order-header-second-line">
          {/* Tab chọn loại món: food hoặc Trả tiền */}
          <a
            href="#"
            className={`menu-type-section ${
              activeMenuType === 'food' ? 'menu-type-section--active' : ''
            }`}
            onClick={() => setActiveMenuType('food')}
          >
            Đồ ăn
          </a>
          <a
            href="#"
            className={`menu-type-section ${
              activeMenuType === 'drink' ? 'menu-type-section--active' : ''
            }`}
            onClick={() => setActiveMenuType('drink')}
          >
            Đồ uống
          </a>
        </div>
        <div className="table-order-header-third-line">
          {/* Tab chọn danh mục món ăn */}
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
      <div className="table-order-page-content">
        <div className="table-order-section">
          <div className="table-order-section-content">
            {/* Lọc và hiển thị các món ăn dựa trên tab đã chọn */}
            {menus
              .filter(
                (item) =>
                  item.type === activeMenuType &&
                  item.category === activeCategory
              )
              .map((item) => (
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
