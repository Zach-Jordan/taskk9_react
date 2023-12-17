import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/post.css';

const CreatePost = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState('');
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }

    // Fetch categories from the backend on component mount
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/categories.php');
      setCategories(response.data || []); // Ensure response.data is set to an array or default to an empty array
    } catch (error) {
      console.error(error);
    }
  };

  const convertToPermalink = (title) => {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date().getTime(); // Get timestamp directly

    try {
      const response = await axios.post('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/post.php', {
        userId,
        category: selectedCategory,
        pageTitle,
        content,
        permalink: convertToPermalink(pageTitle),
        media: media.startsWith('http') ? media : '',
        created_at: timestamp,
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
          type="text"
          placeholder="Media (URL)"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
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
