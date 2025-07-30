import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import TableOrder from './pages/TableOrder/TableOrder';
import TableReservation from './pages/TableReservation/TableReservation';
import Cart from './pages/Cart/Cart';
import { TableProvider } from './context/TableContext';

function App() {
  return (
    <TableProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/reserve-table/:tableId"
            element={<TableReservation />}
          />
          <Route path="/table-order/:tableId" element={<TableOrder />} />
          <Route path="/cart/:tableId" element={<Cart />} />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </TableProvider>
  );
}

export default App;
