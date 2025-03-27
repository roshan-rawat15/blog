import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar({ user }) {
  const [allBlogs, setAllBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [activeSection, setActiveSection] = useState("all"); // "all" or "my"
  const [editPost, setEditPost] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [user]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
      if (Array.isArray(res.data)) {
        const sortedBlogs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllBlogs(sortedBlogs);
        if (user) {
          const userPosts = sortedBlogs.filter(blog => blog.author?._id === user.id);
          setUserBlogs(userPosts);
        }
      } else {
        setAllBlogs([]);
        setUserBlogs([]);
        setError("Failed to load blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setAllBlogs([]);
      setUserBlogs([]);
      setError("An error occurred while fetching blogs");
    }
  };

  const handleCardClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleEditPost = (blog) => {
    setEditPost({ ...blog });
  };

  const handleSaveEdit = async (blogId) => {
    if (!editPost.title.trim() || !editPost.content.trim()) {
      setError("Title and content are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/api/blogs/${blogId}/user`, {
        title: editPost.title,
        content: editPost.content,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserBlogs(userBlogs.map(b => (b._id === blogId ? res.data : b)));
      setAllBlogs(allBlogs.map(b => (b._id === blogId ? res.data : b)));
      setEditPost(null);
      setError(null);
    } catch (error) {
      console.error("Error editing post:", error);
      setError(error.response?.data?.message || "Failed to edit post");
    }
  };

  const handleDeletePost = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/blogs/${blogId}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserBlogs(userBlogs.filter(b => b._id !== blogId));
        setAllBlogs(allBlogs.filter(b => b._id !== blogId));
        setEditPost(null);
        setError(null);
      } catch (error) {
        console.error("Error deleting post:", error);
        setError(error.response?.data?.message || "Failed to delete post");
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-gray-100 shadow-lg z-30 p-4 overflow-y-auto">
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-16">Blog Menu</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveSection("all")}
            className={`w-full text-left px-4 py-2 rounded-md font-semibold transition duration-200 ${
              activeSection === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Posts
          </button>
          {user && (
            <button
              onClick={() => setActiveSection("my")}
              className={`w-full text-left px-4 py-2 rounded-md font-semibold transition duration-200 ${
                activeSection === "my" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              My Posts
            </button>
          )}
        </nav>

        <div className="mt-6 flex-1">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {activeSection === "all" ? (
            allBlogs.length === 0 ? (
              <p className="text-gray-600">No posts available.</p>
            ) : (
              allBlogs.map(blog => (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md mb-4 cursor-pointer overflow-hidden"
                  onClick={() => handleCardClick(blog._id)}
                >
                  {blog.image ? (
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{blog.title}</h3>
                    <p className="text-xs text-gray-600 mt-1 truncate">{blog.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      By: {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "Unknown"}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            userBlogs.length === 0 ? (
              <p className="text-gray-600">You haven’t posted yet.</p>
            ) : (
              userBlogs.map(blog => (
                <div key={blog._id} className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
                  {editPost && editPost._id === blog._id ? (
                    <div className="p-3">
                      <input
                        type="text"
                        value={editPost.title}
                        onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Blog Title"
                      />
                      <textarea
                        value={editPost.content}
                        onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                        className="w-full p-2 border rounded h-20 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Blog Content"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(blog._id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditPost(null)}
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {blog.image ? (
                        <img
                          src={`http://localhost:5000${blog.image}`}
                          alt={blog.title}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500">No image</p>
                        </div>
                      )}
                      <div className="p-3">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{blog.title}</h3>
                        <p className="text-xs text-gray-600 mt-1 truncate">{blog.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          By: {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "Unknown"}
                        </p>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(blog);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(blog._id);
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;