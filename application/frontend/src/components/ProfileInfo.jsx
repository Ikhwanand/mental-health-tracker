import {
  FaUser,
  FaEnvelope,
  FaUserTag,
  FaVenusMars,
  FaBirthdayCake,
  FaEdit,
  FaTrashAlt,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { deleteData, logout } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import DeleteAccountModal from "./DeleteAccountModal";

const ProfileInfo = ({ profile, onEdit }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/tracker/export`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to export data");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tracker_data.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Data exported successfully!");
    } catch (err) {
      toast.error("Failed to export data");
    }
  };

  
  const handleDelete = async () => {
     try {
      await deleteData("/account/profile");
      toast.success("Account deleted!");
      logout();
      navigate("/");
      window.location.reload();
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full bg-purple-200 flex items-center justify-center text-7xl text-purple-700 mb-4">
        {profile.profile_image ? (
          <img
            src={profile.profile_image}
            alt={profile.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <FaUser />
        )}
      </div>
      <div className="w-full bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
          <FaUser className="text-purple-500" />
          <span className="font-semibold">{profile.name || "No Name"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaEnvelope className="text-purple-500" />
          <span>{profile.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaUserTag className="text-purple-500" />
          <span>{profile.username}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaVenusMars className="text-purple-500" />
          <span>{profile.gender || "No Gender"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaBirthdayCake className="text-purple-500" />
          <span>{profile.birthdate || "No Birthdate"}</span>
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded mt-4 transition-colors"
          onClick={onEdit}
        >
          <FaEdit /> Edit Profile
        </button>
      </div>
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-4 mt-20">
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-200 w-full sm:w-auto"
          onClick={handleExport}
        >
          <FaDownload /> Export Data
        </button>
        <button
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-200 w-full sm:w-auto"
          onClick={() => setShowModal(true)}
        >
          <FaTrashAlt /> Delete Account
        </button>
      </div>
      <DeleteAccountModal 
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          handleDelete();
        }}
      />
    </div>
  );
};

export default ProfileInfo;
