import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/login.php', {
        username,
        password,
      });

      const { userId, role } = response.data || {}; // Destructure userId and role from the response, set default to empty object

      if (userId) {
        sessionStorage.setItem('userId', userId); // Store userId in sessionStorage
        sessionStorage.setItem('role', role); // Store role in sessionStorage
        localStorage.setItem('isLoggedIn', 'true'); // Set isLoggedIn to 'true'

        
          navigate('/home');
        
        window.location.reload(); // Refresh the page after login
      } else {
        const { message, error } = response.data;
        console.log(message || error); // Log any error or message received from the backend
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
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
