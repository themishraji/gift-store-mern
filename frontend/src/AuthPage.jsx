import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Gift,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "./AuthContext";

export default function AuthPage({ onGuestClick }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );
      }

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center lg:w-1/2 mb-8">
        <div className="text-center">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-8 rounded-3xl shadow-2xl inline-block mb-8 transform hover:scale-110 transition-transform">
            <Gift className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Happyoffers
          </h1>
          <p className="text-2xl text-gray-600 mb-4">Perfect Gifts for Every Occasion</p>
          <p className="text-lg text-gray-500 max-w-md">
            Join thousands of happy customers shopping for the perfect gifts. Secure, fast, and
            reliable.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-2xl">
              <Gift className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Header */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isLogin ? "Welcome Back!" : "Join Happyoffers"}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            {isLogin
              ? "Login to access your account and continue shopping"
              : "Create an account to get started"}
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-500 transition-all"
                >
                  <option value="user">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t-2 border-gray-300"></div>
            <span className="px-3 text-gray-500">Or</span>
            <div className="flex-1 border-t-2 border-gray-300"></div>
          </div>

          {/* Guest Access */}
          <button
            onClick={onGuestClick}
            className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Continue as Guest
          </button>

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "user",
                  });
                }}
                className="text-pink-600 hover:text-pink-700 font-bold"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-sm font-bold text-blue-800 mb-2">Demo Credentials:</p>
              <p className="text-xs text-blue-700">Email: admin@test.com</p>
              <p className="text-xs text-blue-700">Password: 123456</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap");
        * {
          font-family: "Poppins", sans-serif;
        }
      `}</style>
    </div>
  );
}