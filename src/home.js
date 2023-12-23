import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './styles/home.css';
import './styles/permalink_content.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = 'http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/index.php';

        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }

        if (selectedUser) {
          url += `${selectedCategory ? '&' : '?'}user=${selectedUser}`;
        }

        const response = await axios.get(url);
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/categories.php');
        setCategories(response.data || []); // Ensure the response data is an array of categories with 'category_id' and 'category_name'
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/fetchUsers.php');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isLoggedIn) {
      fetchPosts();
      fetchCategories();
      fetchUsers();
    }
  }, [isLoggedIn, selectedCategory, selectedUser]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="home_container">
      <div className="filter_section">
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
        <select value={selectedUser} onChange={handleUserChange}>
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div className="home_header">
        <h1>What's New</h1>
      </div>
      <div className="posts_list">
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="permalink_content">
              <h2 className='post_title'>{post.page_title}</h2>
              <p className="username">{post.username}</p>
              <div className="content" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150)}} />
              <Link to={`/post/${post.permalink}`}>
                <button>View Post</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}