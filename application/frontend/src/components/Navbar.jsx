import { Link } from "react-router-dom";
import Logo from "../assets/Mental-health-logo-update.svg";

function Navbar({ page, setPage, navOpen, setNavOpen }) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img src={Logo} alt="Logo" className="h-15 w-15 object-contain" />
        <h1 className="text-2xl font-bold text-purple-700">Calmora</h1>
      </div>
      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-4">
        <Link
          className={`font-semibold ${page === "home" ? "text-purple-700 " : "text-gray-600"}`}
          onClick={() => setPage("home")}
          to={"/"}
        >
          Home
        </Link>
        <Link
          className={`font-semibold ${page === "tracker" ? "text-purple-700 " : "text-gray-600"}`}
          onClick={() => setPage("tracker")}
          to={"/tracker"}
        >
          Tracker
        </Link>
        <Link
          className={`font-semibold ${page === "profile" ? "text-purple-700 " : "text-gray-600"}`}
          onClick={() => setPage("profile")}
          to={"/profile"}
        >
          Profile
        </Link>
      </nav>
      {/* Mobile nav toggle */}
      <button
        className="md:hidden p-2"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle navigation"
      >
        <span
          className={`block w-6 h-1 bg-purple-700 mb-1 transition-transform duration-300 ${navOpen ? "rotate-45 translate-y-2" : ""}`}
        ></span>
        <span
          className={`block w-6 h-1 bg-purple-700 mb-1 transition-opacity duration-300 ${navOpen ? "opacity-0" : "opacity-100"}`}
        ></span>
        <span
          className={`block w-6 h-1 bg-purple-700 transition-transform duration-300 ${navOpen ? "-rotate-45 -translate-y-2" : ""}`}
        ></span>
      </button>
    </header>
  );
}

export default Navbar;