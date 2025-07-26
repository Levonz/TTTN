import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

var user = { username: "admin", password: "admin" };

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === user.username && password === user.password) {
      alert("Đăng nhập thành công");
      navigate("/home");
    } else {
      alert("Đăng nhập thất bại");
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
