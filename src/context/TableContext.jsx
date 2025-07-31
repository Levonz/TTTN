import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TableContext = createContext();

export const useTables = () => {
  return useContext(TableContext);
};

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [carts, setCarts] = useState({});

  // Lấy lại danh sách bàn từ backend
  const refreshTables = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tables');
      setTables(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    // gọi api lấy danh sách bàn khi vào trang
    const fetchTables = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/tables');
        setTables(res.data);
      } catch (err) {}
    };
    fetchTables();
  }, []);

  // tìm bàn theo id
  const getTableById = (tableId) => {
    return tables.find((table) => table.id === tableId);
  };

  // Đổi trạng thái bàn thành reserved, dùng khi đặt bàn
  const reserveTable = (tableId, customerInfo) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? { ...table, status: 'reserved', customerInfo }
          : table
      )
    );
  };

  // Thêm món vào giỏ của từng bàn
  const addItemToCart = (tableId, itemToAdd) => {
    setCarts((prevCarts) => {
      const currentCart = prevCarts[tableId] || [];
      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === itemToAdd.id
      );
      let updatedCart;
      if (existingItemIndex > -1) {
        // nếu có rồi thì tăng số lượng
        updatedCart = currentCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // chưa có thì thêm mới
        updatedCart = [...currentCart, { ...itemToAdd, quantity: 1 }];
      }
      return {
        ...prevCarts,
        [tableId]: updatedCart,
      };
    });
  };

  // Lấy giỏ hàng của từng bàn
  const getCartByTableId = (tableId) => {
    return carts[tableId] || [];
  };

  // Khi thanh toán xong thì clear giỏ và đặt lại trạng thái bàn
  const checkoutAndClearCart = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? { ...table, status: 'empty', customerInfo: undefined }
          : table
      )
    );
    setCarts((prevCarts) => {
      const newCarts = { ...prevCarts };
      delete newCarts[tableId];
      return newCarts;
    });
  };

  const value = {
    tables,
    getTableById,
    reserveTable,
    addItemToCart,
    getCartByTableId,
    checkoutAndClearCart,
    refreshTables,
  };

  return (
    <TableContext.Provider value={value}>{children}</TableContext.Provider>
  );
};
