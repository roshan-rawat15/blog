import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import Fhome from "./Fhome";

function Home({ user }) {
  const [blogs, setBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [editPost, setEditPost] = useState(null); // State for editing a post
  const [activeSection, setActiveSection] = useState("all"); // "all" or "my" for main content
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const blogContainerRef = useRef(null);

  // old-code
  // useEffect(() => {
  //   gsap.fromTo(
  //     pageRef.current,
  //     { opacity: 0 },
  //     { opacity: 1, duration: 1.2, ease: "power2.out" }
  //   );
  //   fetchBlogs();
  // }, []);

 

  // useEffect(() => {
  //   if (displayedBlogs.length > 0) {
  //     gsap.fromTo(
  //       blogContainerRef.current.children,
  //       { opacity: 0, y: 30 },
  //       { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: "power2.out" }
  //     );
  //   }
  // }, [blogs, activeSection, editPost]); // Re-run animation when blogs, activeSection, or editPost changes

 //end

 //
 
 useEffect(() => {
  gsap.fromTo(
    pageRef.current,
    { opacity: 0, x: -50 }, // Start from left (-50px)
    { opacity: 1, x: 0, duration: 1.2, ease: "power2.out" } // Slide in smoothly
  );
  fetchBlogs();
}, []);

useEffect(() => {
  if (displayedBlogs.length > 0) {
    gsap.fromTo(
      blogContainerRef.current.children,
      { opacity: 0, x: -50 }, // Start slightly left
      {
        opacity: 1,
        x: 0,
        stagger: 0.3, // Delay between animations
        duration: 1.2, // Slow animation
        ease: "power3.out",
      }
    );
  }
}, [blogs, activeSection, editPost]);

 //

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blogs");
      if (Array.isArray(res.data)) {
        const sortedBlogs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlogs(sortedBlogs);
        if (user) {
          const userPosts = sortedBlogs.filter(blog => blog.author?._id === user.id);
          setUserBlogs(userPosts);
        }
      } else {
        setBlogs([]);
        setUserBlogs([]);
        setError("Failed to load blogs");
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
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
      setBlogs(blogs.map(b => (b._id === blogId ? res.data : b)));
      setUserBlogs(userBlogs.map(b => (b._id === blogId ? res.data : b)));
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
        setBlogs(blogs.filter(b => b._id !== blogId));
        setUserBlogs(userBlogs.filter(b => b._id !== blogId));
        setEditPost(null);
        setError(null);
      } catch (error) {
        console.error("Error deleting post:", error);
        setError(error.response?.data?.message || "Failed to delete post");
      }
    }
  };

  const displayedBlogs = activeSection === "all" ? blogs : userBlogs;

  return (
    <>
    {/* <Fhome/> */}
    <div ref={pageRef} className="relative min-h-screen bg-sky-100 opacity-0">
      <div className="relative z-10 max-w-7xl mx-auto p-4 pt-20">
        {/* Toggle Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveSection("all")}
            className={`px-6 py-2 cursor-pointer rounded-md font-semibold text-lg transition duration-200 ${
              activeSection === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All Blogs
          </button>
          {user && (
            <button
              onClick={() => setActiveSection("my")}
              className={`px-6 py-2 cursor-pointer rounded-md font-semibold text-lg transition duration-200 ${
                activeSection === "my" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              My Blogs
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {displayedBlogs.length === 0 ? (
          <p className="text-gray-600 text-center">
            {activeSection === "all" ? "No blogs available yet." : "No posts available."}
          </p>
        ) : (
          <div
            ref={blogContainerRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {displayedBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-100 rounded-lg shadow-lg overflow-hidden"
              >
                {activeSection === "my" && editPost && editPost._id === blog._id ? (
                  <div className="p-4">
                    <input
                      type="text"
                      value={editPost.title}
                      onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                      className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Blog Title"
                      required
                    />
                    <textarea
                      value={editPost.content}
                      onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                      className="w-full p-2 border rounded h-20 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Blog Content"
                      required
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(blog._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditPost(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-200"
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
                        className="w-full h-48 object-cover"
                        onError={(e) =>
                          console.error("Image failed to load:", blog.image)
                        }
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    )}
                    <div className="p-4">
                      <h2
                        className="text-xl font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
                        onClick={() => handleCardClick(blog._id)}
                      >
                        {blog.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1 font-bold">
                        By: {blog.author ? `${blog.author.firstName} ${blog.author.lastName}` : "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted on: {new Date(blog.createdAt).toLocaleDateString()} at {new Date(blog.createdAt).toLocaleTimeString()}
                      </p>
                      {activeSection === "my" && user && blog.author?._id === user.id && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPost(blog);
                            }}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(blog._id);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
</>
  );
}


export default Home;