import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/login.php', {
        username,
        password,
      });

      const { userId, role, error: loginError, message } = response.data || {};

      if (userId) {
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', role);
        localStorage.setItem('isLoggedIn', 'true');

        setSuccessMessage('Login successful');

        setTimeout(() => {
          navigate('/home');
          window.location.reload();
        }, 3000); 
      } else if (loginError === 'User not found' && password) {
        setError('Invalid username or password');
      } else {
        setError(loginError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="loginForm" onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
