import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import AuthPage from "./AuthPage";
import GiftStore from "./components/GiftStore";
import { LogOut } from "lucide-react";

export default function AppIndex() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not in guest mode, show auth page
  if (!isAuthenticated() && !guestMode) {
    return (
      <AuthPage
        onGuestClick={() => setGuestMode(true)}
      />
    );
  }

  // If authenticated or guest mode, show the main app
  return (
    <div>
      {/* Header with user info and logout */}
      {isAuthenticated() && (
        <div className="bg-white shadow-md border-b-4 border-pink-400 py-3 px-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-bold text-gray-800">
                  {user.name} ({user.role === "admin" ? "🔐 Admin" : "👤 Customer"})
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setGuestMode(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Guest Mode Header */}
      {guestMode && !isAuthenticated() && (
        <div className="bg-blue-50 border-b-4 border-blue-400 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-blue-800 font-bold">
              👤 Browsing as Guest • Shopping features limited
            </p>
            <div className="space-x-4 flex">
              <button
                onClick={() => setGuestMode(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
              >
                Login/Register
              </button>
              <button
                onClick={() => setGuestMode(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App */}
      <GiftStore userRole={isAuthenticated() ? user?.role : "guest"} />
    </div>
  );
}