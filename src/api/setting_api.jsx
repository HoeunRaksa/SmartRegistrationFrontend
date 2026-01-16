import API from '../api/index';
// User Settings API
export const userSettingsApi = {
  // Get user profile
  getProfile: () => API.get('/user/profile'),

  // Update name
  updateName: (name) => API.put('/user/update-name', { name }),

  // Update email
  updateEmail: (email, currentPassword) => 
    API.put('/user/update-email', { email, current_password: currentPassword }),

  // Change password
  changePassword: (currentPassword, newPassword, newPasswordConfirmation) =>
    API.put('/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    }),

  // Upload profile picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    return API.post('/user/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete profile picture
  deleteProfilePicture: () => API.delete('/user/delete-profile-picture'),

  // Delete account
  deleteAccount: (password) => API.delete('/user/delete-account', { 
    data: { password } 
  }),
};

export default userSettingsApi;