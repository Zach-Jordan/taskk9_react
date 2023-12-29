import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import './styles/dashboard.css';
import './styles/permalink_content.css';
import AdminDashboard from './adminDashboard';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]); 
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'; 
  const userId = sessionStorage.getItem('userId'); 
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [selectedUser, setSelectedUser] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const [categories, setCategories] = useState([]); 
  const [users, setUsers] = useState([]); 

  // Fetches posts, categories, and users based on logged-in status and user ID
  useEffect(() => {
    // Fetches posts for a specific user
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/manageIndex.php?userId=${userId}`);
        setPosts(response.data.posts || []);
        console.log(response.data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetches categories
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/categories.php');
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchUsers = async () => {
      // Fetches users
      try {
        const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/fetchUsers.php');
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Fetches data if the user is logged in and has a user ID
    if (isLoggedIn && userId) {
      fetchPosts();
      fetchCategories();
      fetchUsers();
    }
  }, [isLoggedIn, userId]);

  // Handles post deletion
  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/deletePosts.php', {
        data: {
          postId: postId
        }
      });

      console.log(response.data);

      if (response.data.message === 'Post deleted successfully') {
        const updatedPosts = posts.filter(post => post.post_id !== postId);
        setPosts(updatedPosts);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Formats timestamp
  const formatDate = (timestamp) => {
    return timestamp.split(' ')[0]; 
  };

  // Sorts posts by timestamp
  const sortPostsByTimestamp = () => {
    return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  // Handles category change
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };

  // Handles user change
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption.value);
  };

  // Fetches posts based on selected category and user
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

    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn, selectedCategory, selectedUser]);

  return (
    <div className="dashboard">
      <AdminDashboard />
      <h1>Admin Posts</h1>
      <div className="create_post_div">
        <Link to="/dashboardCreate">
          <button className="create_post">Create Post</button>
        </Link>
      </div>
      <div className="filter_section">
        <Select
          className="select_component"
          value={selectedCategory === '' ? null : categories.find((cat) => cat.value === selectedCategory)}
          onChange={handleCategoryChange}
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
          onChange={handleUserChange}
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
              <p className="timestamp">{formatDate(post.created_at)}</p>
              <h2 className="post_title">{post.page_title}</h2>
              <p className="username">{post.username}</p>
              <div className="content" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) }} />
              <div className="permalink_content_buttons">
                <Link to={`/post/${post.post_id}/${post.permalink}`}>
                  <button>Full Post</button>
                </Link>
                <button onClick={() => handleDelete(post.post_id)}>Delete</button>
                <Link to={`/dashboardEdit/${post.post_id}`}>
                  <button>Edit</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
