// fullPost.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/fullPost.css';

function FullPost() {
  const [post, setPost] = useState(null);
  const { post_id, permalink } = useParams();

  useEffect(() => {
    const fetchPostByParams = async () => {
      try {
        const response = await axios.get(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/permalink.php?post_id=${post_id}&permalink=${permalink}`);
        setPost(response.data.post); 
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchPostByParams();
  }, [post_id, permalink]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="fullContent">
      <h1>{post.page_title}</h1>
      <img src={`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/${post.media}`} alt="Unable to load image" />
      <p>{post.content}</p>
    </div>
  );
}

export default FullPost;
