import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/sign_up.css';

const AdminUpdateUser = ({ user }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match. Please re-enter.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/updateUsers.php?id=${user.user_id}`, {
        username,
        email,
        password,
      });

      console.log(response.data);
      if (response.data.message === 'User updated successfully') {
        navigate('/adminManageUsers');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Edit User</h1>
      <form className="sign_upFrom" onSubmit={handleUpdateUser}>
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
        <button type="submit">Update User</button>
      </form>
    </>
  );
};

export default AdminUpdateUser;
