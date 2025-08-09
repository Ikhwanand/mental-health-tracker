import React, { useState, useEffect } from "react";
import ProfileEditForm from "../components/ProfileEditForm";
import ProfileInfo from "../components/ProfileInfo";
import {
  FaSignOutAlt,
  FaChartLine,
  FaHistory,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { logout, getData } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import useAuth from "../utils/useAuth";



const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  // const isAuthenticate = useAuth();

  useEffect(() => {
    // Fetch profile data
    getData("/account/profile")
      .then((data) => {
        setProfile({
          name: data.full_name,
          email: data.email,
          username: data.username,
          gender: data.gender,
          birthdate: data.birth_date,
          profile_image: data.profile_image
        });
      })
      .catch((err) => {
        // Handle error, e.g, unauthorized
        if (err && err.status === 401) {
          navigate('/login');
        } else {
          toast.error("Failed to load profile data.");
        }
      });
      // Fetch tracker history jika sudah ada endpointnya
      getData("/tracker/history").then(setHistory);
  }, [navigate]);

  const chartData = {
    labels: history.map((item) => item.date),
    datasets: [
      {
        label: "Mood Score",
        data: history.map((item) => item.mood_score),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139,92,246,0.1)",
        tension: 0.4,
      },
      {
        label: "Stress Level",
        data: history.map((item) => item.stress_level),
        borderColor: "#f59e42",
        backgroundColor: "rgba(245,158,66,0.1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-4 md:p-8 mt-10">
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
        {/* Kiri: Profile Card */}
        <div className="md:w-1/3 w-full flex flex-col">
          <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col gap-4 flex-1">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">Profile</h2>
              <button
                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold px-3 py-2 rounded transition-colors"
                onClick={() => {
                  logout();
                  navigate("/");
                  window.location.reload();
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
            {profile && (editMode ? (
              <ProfileEditForm
                profile={profile}
                onSave={(p) => {
                  setProfile(p);
                  setEditMode(false);
                }}
                onCancel={() => setEditMode(false)}
              />
            ) : (
              <ProfileInfo profile={profile} onEdit={() => setEditMode(true)} />
            ))}
          </div>
        </div>
        {/* Kanan: History & Dashboard */}
        <div className="md:w-2/3 w-full flex flex-col gap-8">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-2 text-purple-700 font-semibold">
              <FaHistory /> Tracker History
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-1 px-2">Date</th>
                    <th className="py-1 px-2">Mood Score</th>
                    <th className="py-1 px-2">Stress Level</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-none">
                      <td className="py-1 px-2">{item.date}</td>
                      <td className="py-1 px-2">{item.mood_score}</td>
                      <td className="py-1 px-2">{item.stress_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-purple-700 font-semibold">
              <FaChartLine /> Dashboard
            </div>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
