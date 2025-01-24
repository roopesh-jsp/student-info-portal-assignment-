import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Import Firebase auth

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      navigate("/login"); // Redirect to login page
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <button onClick={() => navigate("/students")}>Students Page</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Sidebar;
