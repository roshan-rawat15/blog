import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";


function BlogDetails({ user }) {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get blog ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/blogs/${id}`); // Fetch single blog
      setBlog(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog details");
    }
  };

  const handleLike = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/blogs/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlog();
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async (content) => {
    if (!user) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/blogs/${id}/comment`,
        { content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchBlog();
    } catch (error) {
      console.error("Error commenting on blog:", error);
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-7xl mx-auto p-4 mt-20">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{blog.title}</h1>
      {blog.image ? (
        <img
          src={`http://localhost:5000${blog.image}`}
          alt={blog.title}
          className="w-full max-w-full rounded-md mb-6"
          onError={(e) => console.error("Image failed to load:", blog.image)}
        />
      ) : (
        <p className="text-gray-500 mb-6">No image available</p>
      )}
      <p className="text-gray-600 mb-4">{blog.content}</p>
      <p className="text-sm text-gray-500 mb-4">
        By:{" "}
        {blog.author
          ? `${blog.author.firstName} ${blog.author.lastName}`
          : "Unknown"}{" "}
        | Posted on: {new Date(blog.createdAt).toLocaleDateString()}
      </p>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleLike}
          className="text-blue-600 hover:text-blue-800"
        >
          Like ({blog.likes.length})
        </button>
        <button
          onClick={() => {
            const content = prompt("Enter your comment:");
            if (content) handleComment(content);
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          Comment ({blog.comments.length})
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Comments</h3>
        {blog.comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          blog.comments.map((comment) => (
            <div key={comment._id} className="text-sm text-gray-600 mb-2">
              <p>{comment.content}</p>
              <p className="text-gray-500">
                - {comment.user?.username || "Unknown"} |{" "}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
      <button
      onClick={() => navigate("/")}
      className="mt-6 px-5 py-2 border cursor-pointer border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </button>
    </div>
  );
}

export default BlogDetails;
