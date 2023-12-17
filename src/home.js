import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './styles/home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/index.php');
        setPosts(response.data.posts || []); // Ensure posts is an array
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false); // Update loading state after fetching data
      }
    };

    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="home_container">
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
            <div key={post.id} className="permalink_content">
              <h2>{post.page_title}</h2>
              <p className='username'>{post.username}</p>
              <p className="content">{post.content.substring(0, 100)}</p>
              <Link to={`/post/${post.permalink}`}><button>View Post</button></Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


