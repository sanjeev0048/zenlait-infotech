import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid login details");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin";
    } catch {
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-6 w-80">
        <h2 className="text-xl font-bold text-center mb-4">Admin Login</h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
