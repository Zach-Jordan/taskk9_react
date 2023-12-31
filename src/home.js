import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './styles/home.css';
import './styles/permalink_content.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // Fetches posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = 'http://taskk9.byethost7.com/php_backend/index.php';

        // Appends selected category to URL if present
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }

        // Appends selected user to URL if present
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

    // Function to fetch categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://taskk9.byethost7.com/php_backend/categories.php');
        setCategories(response.data || []); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Fetchs users
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://taskk9.byethost7.com/php_backend/fetchUsers.php');
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

  // handles category change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handles user change
  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  // Extracts year-month-day
  const formatDate = (timestamp) => {
    return timestamp.split(' ')[0]; 
  };

  // Renders timestamp
  const renderTimestamp = (post) => {
    if (post.updated_at === null) {
      return <p className="timestamp">{formatDate(post.created_at)}</p>;
    } else {
      return <p className="timestamp">{formatDate(post.updated_at)}</p>;
    }
  };

  // Function to sort posts by timestamp
  const sortPostsByTimestamp = () => {
    return posts.sort((a, b) => {
      const dateA = a.updated_at || a.created_at; 
      const dateB = b.updated_at || b.created_at;
  
      if (dateA === dateB) {
        // If the timestamps are the same, sort by post_id to prioritize newer posts
        return b.post_id - a.post_id;
      }
  
      return new Date(dateB) - new Date(dateA);
    });
  };

  return (
    <div className="home_container">
      <div className="home_header">
        <h1>What's New</h1>
      </div>
      <div className="filter_section">
        <Select
          className="select_component"
          value={selectedCategory === '' ? null : categories.find((cat) => cat.value === selectedCategory)}
          onChange={(selectedOption) => setSelectedCategory(selectedOption.value)}
          options={[
            { value: '', label: 'All Categories' }, 
            ...categories.map((category) => ({
              value: category.category_id,
              label: category.category_name,
            })),
          ]}
          placeholder="All Categories"
        />

        <Select
          className="select_component"
          value={selectedUser === '' ? null : users.find((usr) => usr.value === selectedUser)}
          onChange={(selectedOption) => setSelectedUser(selectedOption.value)}
          options={[
            { value: '', label: 'All Users' }, 
            ...users.map((user) => ({
              value: user.user_id,
              label: user.username,
            })),
          ]}
          placeholder="All Users"
        />
      </div>
      <div className="posts_list">
        {loading ? (
          <p>Loading...</p>
        ) : posts.length === 0 ? (
          <p>No posts available.</p>
        ) : ( 
          sortPostsByTimestamp().map((post) => (
            <div key={post.post_id} className="permalink_content">
            {renderTimestamp(post)} {/* Render timestamp conditionally */}
            <h2 className='post_title'>{post.page_title}</h2>
            <p className="username">{post.username}</p>
            <div className="content" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150)}} />
            <div className="permalink_content_buttons">
              <Link to={`/${post.post_id}/${post.permalink}`}>
                <button>Full Post</button>
              </Link>
            </div>
          </div>  
          ))
        )}
      </div>
    </div>
  );
}