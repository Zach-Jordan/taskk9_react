import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/dashboard.css';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/manageIndex.php?userId=${userId}`);
        setPosts(response.data.posts || []); // Set empty array if response.data.posts is undefined
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

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <Link to="/dashboardCreate"><button>Create Post</button></Link>
      <div className="posts_list">
        {posts && posts.length === 0 ? (
          <p>No posts available. Create a Post!</p>
        ) : (
          posts.map((post) => (
            <div key={post.post_id} className="dashboard_content">
              <h2>{post.page_title}</h2>
              <p className='username'>{post.username}</p>
              <p>{post.content.substring(0, 100)}</p>
              <div className="dashboard_content_buttons">
                <Link to={`/post/${post.permalink}`}><button>View Post</button></Link>
                <button onClick={() => handleDelete(post.post_id)}>Delete</button>
                <Link to={{
                  pathname: `/dashboardEdit/${post.post_id}`,
                  state: { postData: post } 
                }}>
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

