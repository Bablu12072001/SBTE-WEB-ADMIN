// src/components/page/AdminLogin.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../components/assets/adminImages/logo_sbte.png";
import loader from "../../components/assets/adminImages/loading-gif.gif";

const AdminLogin = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminRole = localStorage.getItem("adminRole");

    if (adminToken && adminRole === "admin") {
      setTimeout(() => {
        navigate("/admin");
      }, 100);
    } else {
      setIsAuthenticating(false);
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsSigningIn(true);
      const response = await axios.post(
        "/api/admin/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const adminToken = response.data?.body;
      if (response.data?.status === true && adminToken) {
        const decoded = JSON.parse(atob(adminToken.split(".")[1]));

        localStorage.setItem("adminToken", adminToken);
        localStorage.setItem("adminRole", decoded.role || "admin");

        navigate("/admin");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isAuthenticating) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img src={loader} alt="Loading" width={50} height={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="logo"
            height={100}
            width={100}
            className="mb-2"
          />
          <h1 className="text-xl font-semibold text-gray-800">SBTE, Bihar</h1>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Web Control Panel
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Please enter your credentials
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-slate-600 focus:outline-none rounded-lg p-3 text-base"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-slate-600 focus:outline-none rounded-lg p-3 text-base"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg text-lg font-medium transition-all duration-200"
          >
            {isSigningIn ? (
              <div className="flex justify-center">
                <img src={loader} alt="loader" height={25} width={25} />
              </div>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
