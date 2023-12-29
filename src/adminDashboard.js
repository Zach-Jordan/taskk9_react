import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/dashboard.css"

const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-buttons">
        <Link to="/adminManageUsers"><button className='manage_buttons'>Manage Users</button></Link>
        <Link to="/adminManagePosts"><button className='manage_buttons'>Manage Posts</button></Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
