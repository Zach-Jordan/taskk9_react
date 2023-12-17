import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const DashboardEdit = () => {
    const location = useLocation();
    const { postData } = location.state || {};
  const { postId } = useParams();
  const [post, setPost] = useState({
    category: '',
    page_title: '',
    content: '',
    media: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (postData) {
      setPost(postData);
    } else {
      axios.get(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/getEditPost.php?postId=${postId}`)
        .then(response => {
          setPost(response.data);
        })
        .catch(error => {
          console.error('Error fetching post data:', error);
        });
    }
  }, [postId, postData]);
  const convertToPermalink = (title) => {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { category, page_title, content, media } = post;
    const generatedPermalink = convertToPermalink(page_title); 

    try {
      const response = await axios.put(`http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/edit.php?postId=${postId}`, {
        category,
        page_title,
        content,
        media,
        permalink: generatedPermalink, 
      });

      console.log(response.data); 

      // Handle success or do any necessary actions after updating data
      navigate('/dashboard'); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };
  return (
    <div className='editPostPage'>
      <form className='editPostForm' onSubmit={handleFormSubmit}>
        <input
          type='text'
          name='page_title'
          placeholder='Page Title'
          value={post.page_title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name='content'
          placeholder='Content'
          value={post.content}
          onChange={handleInputChange}
          required
        ></textarea>
        <input
          type='text'
          name='media'
          placeholder='Media'
          value={post.media}
          onChange={handleInputChange}
          required
        />
        <input
          type='text'
          name='category'
          placeholder='Category'
          value={post.category}
          onChange={handleInputChange}
          required
        />
        <button type='submit'>Update Data</button>
      </form>
    </div>
  );
};

export default DashboardEdit;
