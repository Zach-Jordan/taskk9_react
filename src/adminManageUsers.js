import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './adminDashboard';

export default function ManageUsers () {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/fetchUsers.php');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

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
            <th>Full Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.fullname}</td> 
              <td><button onClick={() => handleDelete(user.user_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
