import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const TableContext = createContext();

export const useTables = () => {
  return useContext(TableContext);
};

export const TableProvider = ({ children }) => {
  const [tables, setTables] = useState([]);
  const [carts, setCarts] = useState({});
  const refreshTables = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Không thể làm mới danh sách bàn:', err);
    }
  };

  // ✅ Lấy danh sách bàn từ server
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/tables');
        setTables(res.data);
      } catch (err) {
        console.error('Không thể tải danh sách bàn:', err);
      }
    };

    fetchTables();
  }, []);

  const getTableById = (tableId) => {
    return tables.find((table) => table.id === tableId);
  };

  const reserveTable = (tableId, customerInfo) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? { ...table, status: 'reserved', customerInfo }
          : table
      )
    );
  };

  const addItemToCart = (tableId, itemToAdd) => {
    setCarts((prevCarts) => {
      const currentCart = prevCarts[tableId] || [];

      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === itemToAdd.id
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        updatedCart = currentCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...currentCart, { ...itemToAdd, quantity: 1 }];
      }

      return {
        ...prevCarts,
        [tableId]: updatedCart,
      };
    });
  };

  const getCartByTableId = (tableId) => {
    return carts[tableId] || [];
  };

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
