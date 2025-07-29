import './Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleUser,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTables } from '../../context/TableContext'; // 1. Import useTables

const Cart = () => {
  const { tableId } = useParams();
  const { getCartByTableId, checkoutAndClearCart } = useTables(); // 2. Lấy hàm từ context
  const navigate = useNavigate();

  const cartItems = getCartByTableId(tableId); // 3. Lấy danh sách món trong giỏ hàng

  // 4. Tính tổng tiền
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Hàm xử lý khi nhấn nút thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }
    checkoutAndClearCart(tableId);
    alert('Đã thanh toán thành công!');
    navigate('/home');
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div className="cart-header-first-line">
          <div className="cart-header-navbar">
            <Link
              to={`/table-order/${tableId}`}
              className="cart-header-navbar-home-btn"
            >
              QUAY LẠI MENU
            </Link>
          </div>
          <div className="cart">
            <FontAwesomeIcon icon={faCartShopping} />
          </div>
          <div className="user-info">
            <FontAwesomeIcon icon={faCircleUser} />
          </div>
        </div>
        <div className="cart-header-second-line">
          <h2>Giỏ hàng của bạn (Bàn {tableId})</h2>
        </div>
      </div>
      <div className="cart-content">
        {/* 5. Hiển thị danh sách món hàng hoặc thông báo giỏ hàng trống */}
        {cartItems.length === 0 ? (
          <p>Chưa có món hàng nào trong giỏ.</p>
        ) : (
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{item.price.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="cart-item-quantity">
                  <span>Số lượng: {item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          {/* 6. Hiển thị tổng tiền đã tính */}
          Tổng cộng: <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
