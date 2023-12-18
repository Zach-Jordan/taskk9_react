import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/fullPost.css';

function FullPost() {
  const [post, setPost] = useState(null);
  const { permalink } = useParams();

  useEffect(() => {
    const fetchPostByPermalink = async () => {
      try {
        const response = await axios.get(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/permalink.php?permalink=${permalink}`);
        setPost(response.data.post); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostByPermalink();
  }, [permalink]);

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