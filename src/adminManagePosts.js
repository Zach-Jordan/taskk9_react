import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/dashboard.css';
import './styles/permalink_content.css'
import AdminDashboard from './adminDashboard';

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/manageIndex.php?userId=${userId}`);
        setPosts(response.data.posts || []); 
        console.log(response.data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    if (isLoggedIn && userId) {
      fetchPosts();
    }
  }, [isLoggedIn, userId]);
  
  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/deletePosts.php', {
        data: {
          postId: postId
        }
      });
  
      console.log(response.data);
  
      if (response.data.message === "Post deleted successfully") {
        const updatedPosts = posts.filter(post => post.post_id !== postId);
        setPosts(updatedPosts);
      } else {
        console.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (timestamp) => {
    return timestamp.split(' ')[0]; // Assuming the timestamp is in the format YYYY-MM-DD HH:MM:SS
  };
 
  const sortPostsByTimestamp = () => {
    return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  return (
    <div className="dashboard">
      <AdminDashboard />
      <h1>Admin Posts</h1>
      <div className="creat_post_div">
        <Link to="/dashboardCreate">
          <button className='create_post'>Create Post</button>
        </Link>
      </div>
      <div className="posts_list">
        {posts && posts.length === 0 ? (
          <p>No posts available. Create a Post!</p>
        ) : (
          sortPostsByTimestamp().map((post) => (
            <div key={post.post_id} className="permalink_content">
              <p className="timestamp">{formatDate(post.created_at)}</p>
              <h2 className='post_title'>{post.page_title}</h2>
              <div className="content" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150)}} />
              <div className="permalink_content_buttons">
              <Link to={`/post/${post.post_id}/${post.permalink}`} className="post-link">
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

