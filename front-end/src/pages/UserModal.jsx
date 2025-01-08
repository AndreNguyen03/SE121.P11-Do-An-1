import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const UserModal = ({ onClose, user, updateUser }) => {
    const [name, setName] = useState(user?.name || 'Unnamed');
    const [avatar, setAvatar] = useState(user?.image || '../assets/default.png');
    const [croppedImage, setCroppedImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const cropperRef = useRef(null);
    const avatarInputRef = useRef(null);
  
    const handleAvatarChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setAvatar(URL.createObjectURL(file));
        setShowCropModal(true);
      }
    };
  
    const handleCrop = () => {
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
        setCroppedImage(cropper.getCroppedCanvas().toDataURL());
        setShowCropModal(false);
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const updatedUserData = { walletAddress: user.walletAddress, name };
        await updateUser(updatedUserData, croppedImage);
        alert('Profile updated successfully!');
        onClose();
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 cursor-pointer" onClick={() => avatarInputRef.current.click()}>
              <img
                src={croppedImage || avatar}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
              />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-medium mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
          <input
            type="file"
            ref={avatarInputRef}
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
  
        {showCropModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-60">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <Cropper
                src={avatar}
                ref={cropperRef}
                style={{ height: 400, width: '100%' }}
                initialAspectRatio={1}
                guides={false}
              />
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={handleCrop}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Crop Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

export default UserModal;
