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

  // Function for handling login 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://taskk9.byethost7.com/php_backend/login.php', {
        username,
        password,
      });

      const { userId, role, error: loginError, message } = response.data || {};

      // Stores user details in session upon successful login
      if (userId) {
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('isLoggedIn', 'true');

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
