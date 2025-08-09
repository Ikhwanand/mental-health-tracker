import { useState } from "react";
import { putData } from "../utils/api";
import { toast } from "react-toastify";

const ProfileEditForm = ({ profile, onSave, onCancel }) => {
  const [form, setForm] = useState({
    ...profile,
    gender: profile.gender || "Male"
  });
  const [photo, setPhoto] = useState(profile.photo || null);
  const [photoPreview, setPhotoPreview] = useState(profile.photo || null);

  const [dragActive, setDragActive] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      // if (photo && photo instanceof File) {
      //   // If there a new photo, use formData
      //   dataToSend = new FormData();
      //   dataToSend.append("file", photo);
      //   dataToSend.append("full_name", form.name);
      //   dataToSend.append("email", form.email);
      //   dataToSend.append("username", form.username);
      //   dataToSend.append("gender", form.gender);
      //   dataToSend.append("birth_date", form.birthdate);
      // } else {
      //   // If there no new photo, send JSON data
      //   dataToSend = {
      //     full_name: form.name,
      //     email: form.email,
      //     username: form.username,
      //     gender: form.gender,
      //     birth_date: form.birthdate,
      //   };
      // }
      dataToSend.append("full_name", form.name);
      dataToSend.append("email", form.email);
      dataToSend.append("username", form.username);
      dataToSend.append("gender", form.gender);
      dataToSend.append("birth_date", form.birthdate);
      if (photo && photo instanceof File) {
        dataToSend.append("file", photo);
      }
      const response = await putData("/account/profile", dataToSend);
      if (onSave) {
        onSave({ ...form, photo: photoPreview || form.photo });
        toast.success("Profile updated successfully");
        
      }

      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <div>
        <label className="block text-sm font-semibold mb-1">
          Profile Photo
        </label>
        <div
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors duration-200 cursor-pointer ${
            dragActive
              ? "border-purple-700 bg-purple-50"
              : "border-gray-300 bg-gray-100 hover:border-purple-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("profile-photo-input").click()}
          style={{ minHeight: 100 }}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover border shadow mb-2"
            />
          ) : (
            <span className="text-gray-400 text-sm">
              Drag & drop or click to select photo
            </span>
          )}
          <input
            id="profile-photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Full Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Username</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Gender</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Birthdate</label>
        <input
          type="date"
          className="w-full border rounded px-3 py-2"
          value={form.birthdate}
          onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
