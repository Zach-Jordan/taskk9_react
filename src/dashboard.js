import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/dashboard.css';
import './styles/permalink_content.css';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const userId = sessionStorage.getItem('userId');

  // Fetchs posts on component mount or when user status changes
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
  
  // handles deletion of a post
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

  // formats timestamp
  const formatDate = (timestamp) => {
    return timestamp.split(' ')[0]; 
  };
 
  // Function to render timestamp based on whether the post was updated or created
  const renderTimestamp = (post) => {
    if (post.updated_at === null) {
      return <p className="timestamp">{formatDate(post.created_at)}</p>;
    } else {
      return <p className="timestamp">{formatDate(post.updated_at)}</p>;
    }
  };

    // Function to sort posts by timestamp (updated or created)
  const sortPostsByTimestamp = () => {
    return posts.sort((a, b) => {
      const dateA = a.updated_at || a.created_at; 
      const dateB = b.updated_at || b.created_at;
  
      return new Date(dateB) - new Date(dateA); 
    });
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <h2>Manage you Posts!</h2>
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
            {renderTimestamp(post)} 
            <h2 className='post_title'>{post.page_title}</h2>
            <p className="username">{post.username}</p>
            <div className="content" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150)}} />
              <div className="permalink_content_buttons">
              <Link to={`/${post.post_id}/${post.permalink}`} className="post-link">
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