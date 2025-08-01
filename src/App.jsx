import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import TableOrder from './pages/TableOrder/TableOrder';
import Cart from './pages/Cart/Cart';
import MenuManager from './pages/Admin/MenuManager/MenuManager';
import TableManager from './pages/Admin/TableManager/TableManager';
import InvoiceManager from './pages/Admin/InvoiceManager/InvoiceManager';
import StaffManager from './pages/Admin/StaffManager/StaffManager';
import { TableProvider } from './context/TableContext';

function App() {
  return (
    <TableProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
      
          <Route path="/table-order/:tableId" element={<TableOrder />} />
          <Route path="/cart/:tableId" element={<Cart />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/menus" element={<MenuManager />} />
          <Route path="/admin/tables" element={<TableManager />} />
          <Route path="/admin/invoices" element={<InvoiceManager />} />
          <Route path="/admin/staff" element={<StaffManager />} />

        </Routes>
      </BrowserRouter>
    </TableProvider>
  );
}

export default App;
