import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-buttons">
        <Link to="/adminManageUsers">Manage Users</Link>
        <Link to="/adminManagePosts">Manage Posts</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
