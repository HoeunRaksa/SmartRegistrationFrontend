import API from "./index";

const userSettingsApi = {
  getProfile: async () => {
    return await API.get("/user/profile");
  },

  updateName: async (name) => {
    return await API.put("/user/update-name", {
      name: String(name ?? "").trim(),
    });
  },

  updateEmail: async (email, currentPassword) => {
    return await API.put("/user/update-email", {
      email: String(email ?? "").trim(),
      current_password: String(currentPassword ?? ""),
    });
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    return await API.put("/user/change-password", {
      current_password: String(currentPassword ?? ""),
      new_password: String(newPassword ?? ""),
      new_password_confirmation: String(confirmPassword ?? ""),
    });
  },

  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    return await API.post("/user/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProfilePicture: async () => {
    return await API.delete("/user/delete-profile-picture");
  },

  deleteAccount: async (password) => {
    return await API.post("/user/delete-account", {
      password: String(password ?? ""),
    });
  },

  logout: async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },
};

export default userSettingsApi;
