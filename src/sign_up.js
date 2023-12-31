import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/sign_up.css'

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle signup 
  const handleSignUp = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      alert("Passwords don't match. Please re-enter.");
      return
    }

    // Sends sign-up data to the server
    try {
      const response = await axios.post('http://taskk9.byethost7.com/php_backend/sign_up.php', {
        username,
        email,
        password,
      });

      console.log(response.data);
      if (response.data.message === 'User signed up successfully') {
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handles email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <form className="sign_upForm" onSubmit={handleSignUp}>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
        title="Please enter a valid email address"
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
