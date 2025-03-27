import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreateBlog({ user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // New state for image file
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Use FormData for multipart upload
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image); // Append image if selected
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/blogs', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' // Required for file uploads
        }
      });
      setError(null);
      navigate('/');
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error.response?.data?.message || 'Failed to create blog');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-18 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Blog</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 mb-2">Upload Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;