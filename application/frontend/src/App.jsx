import { useState } from "react";
import Main from "./pages/Main";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import { ToastContainer } from 'react-toastify';
import Tracker from "./pages/Tracker";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import useAuth from "./utils/useAuth";


function App() {
  const [page, setPage] = useState("home");
  const [navOpen, setNavOpen] = useState(false);
  const isAuthenticated = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col">
        <Navbar page={page} setPage={setPage} navOpen={navOpen} setNavOpen={setNavOpen} />
        {/* Mobile nav menu */}
        {navOpen && (
          <nav className="md:hidden bg-white shadow p-4 flex flex-col space-y-2 z-10">
            <Link
              className={`font-semibold ${
                page === "home" ? "text-purple-700 " : "text-gray-600"
              }`}
              onClick={() => {
                setPage("home");
                setNavOpen(false);
              }}
              to={"/"}
            >
              Home
            </Link>
            <Link
              className={`font-semibold ${
                page === "tracker" ? "text-purple-700 " : "text-gray-600"
              }`}
              onClick={() => {
                setPage("tracker");
                setNavOpen(false);
              }}
              to={"/tracker"}
            >
              Tracker
            </Link>
            <Link
              className={`font-semibold ${
                page === "profile" ? "text-purple-700 " : "text-gray-600"
              }`}
              onClick={() => {
                setPage("profile");
                setNavOpen(false);
              }}
              to={"/profile"}
            >
              Profile
            </Link>
          </nav>
        )}
        <main className="flex-1 p-4 md:p-6 flex flex-col items-stretch justify-center">
          <Routes>
            <Route path="/" element={<Main page={page} setPage={setPage} />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/tracker" element={isAuthenticated ? <Tracker /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <ToastContainer />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
