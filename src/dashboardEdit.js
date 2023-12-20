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
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        axios.get('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/categories.php')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const convertToPermalink = (title) => {
        return title.trim().toLowerCase().replace(/\s+/g, '-');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const { category, page_title, content, media } = post;
        const generatedPermalink = convertToPermalink(page_title);

        const formData = new FormData();
        formData.append('postId', postId);
        formData.append('category', category);
        formData.append('pageTitle', page_title);
        formData.append('content', content);
        formData.append('media', media);
        formData.append('permalink', generatedPermalink);

        try {
            const response = await axios.post('http://localhost:31/Web_Dev_2/Assignments/TaskK9/php_backend/edit.php', formData, {
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

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
    
        if (type === 'file') {
            setPost({ ...post, [name]: e.target.files[0] });
        } else {
            setPost({ ...post, [name]: value });
        }
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
                    type='file'
                    name='media'
                    onChange={handleInputChange}
                    required
                />
                <select
                    name='category'
                    value={post.category}
                    onChange={handleInputChange}
                    required
                >
                    <option value=''>Select Category</option>
                    {categories.map(category => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
                <button type='submit'>Update Data</button>
            </form>
        </div>
    );
};

export default DashboardEdit;
