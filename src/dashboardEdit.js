import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './styles/post.css';

const DashboardEdit = () => {
  const location = useLocation();
  const { postData } = location.state || {};
  const { postId } = useParams();
  const [content, setContent] = useState('');
  const [post, setPost] = useState({
    category: '',
    page_title: '',
    content: '',
    media: '',
  });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [newImage, setNewImage] = useState(null);


  // Fetchs post data based on postId or from location state
  useEffect(() => {
    if (postData) {
      setPost({
        ...postData,
        category: postData.category_id,
        media: postData.media,
      });
      if (postData.media) {
        setSelectedImage(postData.media);
      }
    } else {
      axios
        .get(`http://taskk9.byethost7.com/php_backend/getEditPost.php?postId=${postId}`)
        .then((response) => {
          const fetchedPost = response.data;
          setPost({
            ...fetchedPost,
            category: fetchedPost.category_id,
            media: fetchedPost.media,
          });
          if (fetchedPost.media) {
            setSelectedImage(fetchedPost.media);
          }
        })
        .catch((error) => {
          console.error('Error fetching post data:', error);
        });
    }
  }, [postId, postData]);

  // Fetchs categories from backend
  useEffect(() => {
    axios
      .get('http://taskk9.byethost7.com/php_backend/categories.php')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Converts title to permalink format
  const convertToPermalink = (title) => {
    return title.trim().toLowerCase().replace(/\s+/g, '-');
  };

  // Handles form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { category, page_title, content, media } = post;
    const generatedPermalink = convertToPermalink(page_title);

    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('category', category);
    formData.append('pageTitle', page_title);
    formData.append('content', content);
    formData.append('media',media);
    formData.append('permalink', generatedPermalink);

    if (removeImage) {
      formData.append('removeImage', 'on');
    }

    try {
      const response = await axios.post('http://taskk9.byethost7.com/php_backend/edit.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  // Handles input changes
  const handleInputChange = (e) => {
    const { name, type } = e.target;
    if (type === 'file') {
      const file = e.target.files[0];
      setPost((prevPost) => ({
        ...prevPost,
        [name]: file,
      }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setNewImage(event.target.result);
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      const { value } = e.target;
      setPost((prevPost) => ({
        ...prevPost,
        [name]: value,
      }));
    }
  };

  // Handles removing image
  const handleCheckboxChange = (e) => {
    setRemoveImage(e.target.checked);
    if (e.target.checked) {
      setNewImage(null);
      setSelectedImage(null);
    }
  };

  // Handles Quill editor changes
  const handleQuillChange = (value) => {
    setPost((prevPost) => ({
      ...prevPost,
      content: value,
    }));
  };

  return (
    <div className='postPage'>
      <div className="edit_header">
        <h1>What's New</h1>
      </div>
      <form className='editPostForm' onSubmit={handleFormSubmit}>
        <input
          className='title_input'
          type='text'
          name='page_title'
          placeholder='Page Title'
          value={post.page_title || ''}
          onChange={handleInputChange}
          required
        />
        <ReactQuill
          className='quill'
          value={post.content || ''}
          onChange={handleQuillChange}
          placeholder='Content'
          required
        />
        {(post.media || newImage) && (
          <img
            src={newImage || `http://taskk9.byethost7.com/php_backend/${post.media}`}
            alt='Selected Image'
            className='selected-image'
          />
        )}
        <label>
          Remove Image
          <input
            type='checkbox'
            name='removeImage'
            onChange={handleCheckboxChange}
          />
        </label>
        <div className="bottom_form">
          <input type='file' name='media' onChange={handleInputChange} />
          <label htmlFor="category">Category:</label>
          <select
            name='category'
            value={post.category}
            onChange={handleInputChange}
            required
          >
            <option value=''>Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
        <button className="submit_button" type='submit'>Update Data</button>
      </form>
    </div>
  );
};

export default DashboardEdit;
