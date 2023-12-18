import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/post.css';

const CreatePost = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); // Store file as state
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }

    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/categories.php');
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const convertToPermalink = (title) => {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().getTime();

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('category', selectedCategory);
      formData.append('pageTitle', pageTitle);
      formData.append('content', content);
      formData.append('permalink', convertToPermalink(pageTitle));
      formData.append('created_at', timestamp);
      formData.append('media', media); // Append file to FormData

      const response = await axios.post('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/post.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='postPage'>
      <form className="postForm" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Page Title"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          type="file" 
          onChange={handleMediaUpload}
          accept="image/*"
          required
        />
        <label htmlFor="category">Category:</label>
        {Array.isArray(categories) && categories.length > 0 ? (
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        ) : (
          <p>No categories available</p>
        )}
        <button type="submit">Add Data</button>
      </form>
    </div>
  );
};

export default CreatePost;
