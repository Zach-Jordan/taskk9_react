import { React, useEffect, useState }from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Navbar from './navbar';
import SignUp from './sign_up';
import Welcome from './welcome';
import Home from './home';
import Login from './login';
import CreatePost from './dashboardCreate';
import DashboardEdit from './dashboardEdit';
import Dashboard from './dashboard';
import FullPost from './fullPost';
import AdminDashboard from './adminDashboard';
import ManagePosts from './adminManagePosts';
import ManageUsers from './adminManageUsers';

function App() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('userId') !== null;

    if (!isLoggingIn && !isLoggedIn) {
      localStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userId');
    }
  }, [isLoggingIn]);


  return (
    <div className="App">
      <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboardCreate" element={<CreatePost />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboardEdit/:postId" element={<DashboardEdit />} />
          <Route path="/post/:post_id/:permalink" element={<FullPost />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/adminManagePosts" element={<ManagePosts />} />
          <Route path="/adminManageUsers" element={<ManageUsers />} />
        </Routes>
    </div>
  );
}


export default App;
