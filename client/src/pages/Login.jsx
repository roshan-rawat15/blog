import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
        isAdminLogin,
      });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      setError(null);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="backdrop-blur-lg bg-white p-8 rounded-2xl shadow-xl border border-gray-700 max-w-md w-full text-white">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-black">Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300 text-black"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300 text-black"
              required
            />
          </div>

          {/* Admin Login Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adminLogin"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
              className="w-5 h-5 border border-gray-500 rounded-md bg-transparent checked:bg-blue-500 checked:border-blue-600 transition-all duration-300 cursor-pointer"
            />
            <label htmlFor="adminLogin" className="text-gray-900 text-sm">
              Login as Admin
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:opacity-80 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
