import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ setUser }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        email,
        firstName,
        lastName,
        password,
      });
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-300">
        <h2 className="text-3xl font-bold text-black text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-400 bg-gray-100 text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-400 bg-gray-100 text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 outline-none"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-400 bg-gray-100 text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-400 bg-gray-100 text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-400 bg-gray-100 text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 outline-none"
            required
          />
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
