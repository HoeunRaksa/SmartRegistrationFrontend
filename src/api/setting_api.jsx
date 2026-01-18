import API from './index';

const userSettingsApi = {
  /**
   * Get current user profile
   */
  getProfile: async () => {
    return await API.get('/user/profile');
  },

  /**
   * Update user name
   */
  updateName: async (name) => {
    return await API.put('/user/update-name', { name });
  },

  /**
   * Update user email
   */
  updateEmail: async (email, currentPassword) => {
    return await API.put('/user/update-email', {
      email,
      current_password: currentPassword
    });
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    return await API.put('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    });
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);

    return await API.post('/user/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },

  /**
   * Delete profile picture
   */
  deleteProfilePicture: async () => {
    return await API.delete('/user/delete-profile-picture');
  },

  /**
   * Delete user account
   */
  deleteAccount: async (password) => {
    return await API.post('/user/delete-account', { password });
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await API.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
};

export default userSettingsApi;