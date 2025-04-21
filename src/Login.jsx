import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await fetch(`http://161.35.203.118/student?username=${credentials.username}&password=${credentials.password}`);
      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      setUser(credentials);

      // ✅ Store faculty in localStorage for correct scheduling
      if (data["Study Group"]) {
        localStorage.setItem("faculty", data["Study Group"]);
      }

      navigate("/dashboard"); // Redirects to Dashboard instead of /welcome
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center text-gray-900 dark:text-gray-100"
      >
        {/* ✅ GUC Logo above the text */}
        <img 
          src="https://www.guc.edu.eg/20years/img/emblem-guc.png" 
          alt="GUC Logo" 
          className="h-12 mx-auto mb-2"
        />

        <h2 className="text-lg font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          autoComplete="username"
          className="border p-2 w-full mb-2 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          className="border p-2 w-full mb-2 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* ✅ Credits to you at the bottom */}
      <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">Developed by Seif</p>
    </div>
  );
}
