import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill'; // Import ReactQuill
import 'react-quill/dist/quill.snow.css';
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

  console.log(post.content);
  return (
    <div className="fullContent">
      <h1>{post.page_title}</h1>
      <div className="quill-data" dangerouslySetInnerHTML={{ __html: post.content }} />
      <img src={`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/${post.media}`} alt="Unable to load image" />
    </div>
  );
}

export default FullPost;
