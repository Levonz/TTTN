import './Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTables } from '../../context/TableContext';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const {
    getCartByTableId,
    checkoutAndClearCart,
    getTableById,
    refreshTables,
  } = useTables();

  const table = getTableById(tableId);
  const tableLabel = table ? table.label : tableId;
  const cartItems = getCartByTableId(tableId);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [activeTab, setActiveTab] = useState('cart');
  const [orders, setOrders] = useState([]);
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  // Lấy danh sách món đã gửi bếp (order)
  useEffect(() => {
    fetchOrders();
  }, [tableId]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/orders/${tableId}`);
      const data = await res.json();
      setOrders(data.filter((order) => !order.paid));
    } catch (err) {
      // lỗi lấy order
    }
  };

  // Gửi món đi
  const handleSendToKitchen = async () => {
    if (cartItems.length === 0) {
      alert('Chưa có món nào trong giỏ hàng. Hãy chọn món để gọi!');
      return navigate(`/table-order/${tableId}`);
    }
    try {
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table_id: tableId, items: cartItems }),
      });
      if (!response.ok) throw new Error('Gọi món thất bại!');
      alert('Gọi món thành công!');
      checkoutAndClearCart(tableId);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  // Thanh toán toàn bộ order chưa thanh toán của bàn
  const handlePayAll = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/invoices/${tableId}`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Thanh toán thất bại!');
      const data = await response.json();
      alert(`Đã thanh toán hóa đơn ${data.total.toLocaleString('vi-VN')} đ`);
      await refreshTables();
      navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  // Định dạng giờ hiển thị lượt order
  const formatTime = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Tổng tiền các món đã order
  const totalOrdered = orders.reduce((sum, order) => {
    return (
      sum +
      order.items.reduce((oSum, item) => oSum + item.price * item.quantity, 0)
    );
  }, 0);

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
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>

        <div className="cart-header-second-line">
          <h2>Gọi món bàn {tableLabel}</h2>
        </div>

        <div className="cart-header-third-line">
          <button
            className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            Giỏ đồ ăn
          </button>
          <button
            className={`tab-btn ${activeTab === 'ordered' ? 'active' : ''}`}
            onClick={() => setActiveTab('ordered')}
          >
            Món đã gọi
          </button>
        </div>
      </div>

      <div className="cart-page-content">
        {activeTab === 'cart' ? (
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <p>Chưa có món nào trong giỏ.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">
                      {item.price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <div className="cart-item-quantity">
                    Số lượng: {item.quantity}
                  </div>
                </div>
              ))
            )}
            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  Tạm tính: {totalPrice.toLocaleString('vi-VN')} đ
                </div>
                <div className="cart-buttons">
                  <button
                    className="checkout-btn"
                    onClick={handleSendToKitchen}
                  >
                    Gọi món ngay
                  </button>
                  <button className="checkout-btn" onClick={handlePayAll}>
                    Thanh toán
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="ordered-list">
            {orders.length === 0 ? (
              <p>Chưa gửi món nào.</p>
            ) : (
              <>
                {orders.map((order, index) => (
                  <div key={index} className="order-block">
                    <h4>
                      Lượt {orders.length - index} - Giờ{' '}
                      {formatTime(order.timestamp)}
                    </h4>
                    {order.items.map((item, i) => (
                      <div key={i} className="ordered-item">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="status">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}{' '}
                          đ
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="cart-footer">
                  <div className="cart-total">
                    Tổng cộng: {totalOrdered.toLocaleString('vi-VN')} đ
                  </div>
                  <button className="checkout-btn" onClick={handlePayAll}>
                    Thanh toán
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
