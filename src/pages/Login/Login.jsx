import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        const token = response.data.access_token;
        const role = response.data.role;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role); // (tuỳ chọn) dùng cho các trang khác

        alert('Đăng nhập thành công');

        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        alert('Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Không thể kết nối đến máy chủ.');
    }
  };
  return (
    <div className="login-page">
      <h1 className="login-title">Đăng nhập</h1>
      <div className="login-container">
        <input
          className="login-input"
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Login;
