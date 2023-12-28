import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/post.css';

const CreatePost = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); 
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
  
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); 

    const timestamp = new Date().toISOString();

    const convertToPermalink = (title) => {
      return title.trim().toLowerCase().replace(/\s+/g, '-');
  };

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('category', selectedCategory);
      formData.append('pageTitle', pageTitle);
      formData.append('content', content);
      formData.append('permalink', convertToPermalink(pageTitle));
      formData.append('created_at', timestamp);
      formData.append('media', media);

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
console.log(content)

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
        <ReactQuill
          value={content}
          onChange={setContent}
          placeholder="Content"
          required
        />
        {selectedImage && (
            <img
                src={selectedImage}
                alt='Selected Image'
                className='selected-image'
            />
        )}
        <input
          type='file' 
          name='media'
          onChange={handleMediaUpload}
          accept='image/*'
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
