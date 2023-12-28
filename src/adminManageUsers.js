import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './adminDashboard';
import { Link } from 'react-router-dom';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userIdToUpdate, setUserIdToUpdate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/fetchUsers.php');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/deleteUsers.php', {
        data: {
          userId: userId
        }
      });

      console.log(response.data);

      if (response.data.message === "User deleted successfully") {
        const updatedUsers = users.filter(user => user.user_id !== userId);
        setUsers(updatedUsers);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleAddUser = async () => {
    if (!username || !email || !password) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/sign_up.php', {
        username: username,
        email: email,
        password: password
      });

      console.log(response.data);

      if (response.data.message === 'User signed up successfully') {
        setUsername('');
        setEmail('');
        setPassword('');
        setShowForm(false); // Hide the form after adding the user
        fetchUsers(); // Refresh the users list after adding a new user
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const payload = {
        username: username,
        email: email,
        password: password,
        user_id: userIdToUpdate
      };

      const response = await axios.put('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/updateUser.php', payload);

      console.log(response.data);

      if (response.data.message === "User updated successfully") {
        const updatedUsers = users.map(user => {
          if (user.user_id === userIdToUpdate) {
            return { ...user, username: username, email: email, password: password };
          }
          return user;
        });
        setUsers(updatedUsers);
        setUsername('');
        setEmail('');
        setPassword('');
        setUserIdToUpdate(null);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = (user) => {
    setUsername(user.username);
    setEmail(user.email);
    setPassword(user.password);
    setUserIdToUpdate(user.user_id);
    setShowForm(true);
  };

  const handleAddUserClick = () => {
    setShowForm(true);
    setUserIdToUpdate(null);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const isUpdateMode = userIdToUpdate !== null;

  return (
    <div>
      <AdminDashboard />
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDelete(user.user_id)}>Delete</button>
                <button onClick={() => handleEditUser(user)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddUserClick}>Add User</button>
      {showForm && (
        <div>
          <h2>{isUpdateMode ? 'Update User' : 'Add User'}</h2>
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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={isUpdateMode ? handleUpdateUser : handleAddUser}>
            {isUpdateMode ? 'Update User' : 'Add User'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
