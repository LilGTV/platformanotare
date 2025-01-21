import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/profile.css";

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    nume: user?.nume || "",
    prenume: user?.prenume || "",
    email: user?.email || "",
    parola: user?.parola || "",
  });
  const [editableFields, setEditableFields] = useState({
    nume: false,
    prenume: false,
    email: false,
    parola: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFormData((prevData) => ({
          ...prevData,
          parola: response.data.user.parola,
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      // Aici poți adăuga logica pentru încărcarea imaginii pe server
    }
  };

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const updatedData = {
        nume: formData.nume,
        prenume: formData.prenume,
        email: formData.email,
        parola: formData.parola,
        userId: user.id,
        rol: user.rol,
      };

      console.log("Date trimise către server:", updatedData);
      console.log("URL:", "http://localhost:3001/api/user/profile");

      const response = await axios.put(
        "http://localhost:3001/api/user/profile",
        { updatedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Actualizăm datele în localStorage
        const updatedUser = {
          ...user,
          ...updatedData,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Resetăm starea de editare
        setEditableFields({
          nume: false,
          prenume: false,
          email: false,
          parola: false,
        });

        alert("Datele au fost salvate cu succes!");
      }
    } catch (error) {
      console.log("Detalii complete eroare:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      console.error("Eroare la salvare:", error);
      alert(error.response?.data?.message || "Eroare la salvarea datelor");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-image" />
            ) : (
              <div className="default-profile-icon">👤</div>
            )}
            <label className="edit-image-button">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
              ✏️ Modifică
            </label>
          </div>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <div className="input-with-edit">
              <input
                type="text"
                value={formData.nume}
                onChange={(e) =>
                  setFormData({ ...formData, nume: e.target.value })
                }
                readOnly={!editableFields.nume}
              />
              <button
                className="edit-button"
                onClick={() => toggleEdit("nume")}
              >
                ✏️ Modifică
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-edit">
              <input
                type="text"
                value={formData.prenume}
                onChange={(e) =>
                  setFormData({ ...formData, prenume: e.target.value })
                }
                readOnly={!editableFields.prenume}
              />
              <button
                className="edit-button"
                onClick={() => toggleEdit("prenume")}
              >
                ✏️ Modifică
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-edit">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                readOnly={!editableFields.email}
              />
              <button
                className="edit-button"
                onClick={() => toggleEdit("email")}
              >
                ✏️ Modifică
              </button>
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-edit">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.parola}
                  onChange={(e) =>
                    setFormData({ ...formData, parola: e.target.value })
                  }
                  readOnly={!editableFields.parola}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁️
                </button>
              </div>
              <div className="button-group">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => toggleEdit("parola")}
                >
                  ✏️ Modifică
                </button>
              </div>
            </div>
          </div>

          <button className="save-button" onClick={handleSave}>
            💾 Salvare date
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
