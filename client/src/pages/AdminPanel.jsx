import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Error Boundary Component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('ErrorBoundary caught:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <p className="text-red-600">An error occurred. Please try refreshing the page.</p>
      </div>
    );
  }

  return children;
}

function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        navigate('/login');
        return;
      }

      try {
        const usersRes = await axios.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        const blogsRes = await axios.get('/api/blogs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(blogsRes.data);
        console.log('Fetched blogs for admin:', blogsRes.data); // Debug log
        setError(null);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.response?.data?.message || 'Failed to load admin data');
        if (error.response?.status === 403 || error.response?.status === 401) {
          navigate('/');
        }
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user and their posts?')) {
      try {
        console.log('Attempting to delete user:', userId);
        const response = await axios.delete(`/api/auth/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(users.filter(u => u._id !== userId));
        setBlogs(blogs.filter(b => b.author._id !== userId));
        setError(null);
        console.log('User deleted successfully:', response.data.message);
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete user due to server error';
        setError(errorMessage);
      }
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`/api/blogs/${blogId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBlogs(blogs.filter(b => b._id !== blogId));
        setEditBlog(null);
        setError(null);
      } catch (error) {
        console.error('Error deleting blog:', error);
        setError('Failed to delete blog: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleEditBlog = (blog) => {
    setEditBlog({ ...blog });
  };

  const handleSaveEdit = async () => {
    if (!editBlog.title.trim() || !editBlog.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const res = await axios.put(`/api/blogs/${editBlog._id}`, {
        title: editBlog.title,
        content: editBlog.content,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBlogs(blogs.map(b => (b._id === editBlog._id ? res.data : b)));
      setEditBlog(null);
      setError(null);
    } catch (error) {
      console.error('Error editing blog:', error);
      setError('Failed to edit blog: ' + (error.response?.data?.message || error.message));
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

        {/* Users Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Registered Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No users found</p>
          ) : (
            <div className="grid gap-4">
              {users.map(u => (
                <div key={u._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {u.firstName} {u.lastName}</p>
                    <p><strong>Username:</strong> {u.username}</p>
                    <p><strong>Email:</strong> {u.email}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteUser(u._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete User
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Blogs Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">All Blog Posts</h2>
          {blogs.length === 0 ? (
            <p className="text-gray-600">No blogs found</p>
          ) : (
            <div className="grid gap-4">
              {blogs.map(b => (
                <div key={b._id} className="bg-white p-4 rounded-lg shadow-md">
                  {editBlog && editBlog._id === b._id ? (
                    <div>
                      <input
                        type="text"
                        value={editBlog.title}
                        onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Blog Title"
                        required
                      />
                      <textarea
                        value={editBlog.content}
                        onChange={(e) => setEditBlog({ ...editBlog, content: e.target.value })}
                        className="w-full p-2 border rounded h-20 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Blog Content"
                        required
                      />
                      <div className="flex space-x-2">
                        <button 
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={() => setEditBlog(null)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">{b.title}</h3>
                      {b.image ? (
                        <img 
                          src={`http://localhost:5000${b.image}`} // Use full backend URL
                          alt={b.title} 
                          className="w-80 h-50 object-cover rounded-md mt-4" // Updated styling for actual size
                          onError={(e) => console.error('Image failed to load:', b.image)} // Debug errors
                        />
                      ) : (
                        <p className="text-gray-500 mt-4">No image available</p>
                      )}
                      <p className="text-gray-600">{b.content}</p>
                      <p className="text-sm text-gray-500">
                        By: {b.author ? `${b.author.firstName} ${b.author.lastName} (${b.author.username})` : 'Unknown Author'}
                      </p>
                      <div className="mt-4 flex space-x-4">
                        <button 
                          onClick={() => handleEditBlog(b)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                        >
                          Edit Post
                        </button>
                        <button 
                          onClick={() => handleDeleteBlog(b._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
                        >
                          Delete Post
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ErrorBoundary>
  );
}

export default AdminPanel;