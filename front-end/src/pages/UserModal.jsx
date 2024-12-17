import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const UserModal = ({ onClose, createUser, account }) => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const cropperRef = useRef(null);
    const avatarInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = { walletAddress: account, name };
            await createUser(userData, croppedImage);
            alert('Người dùng đã được tạo thành công!');
            onClose();
        } catch (error) {
            console.error("Error creating user:", error);
            alert('Đã xảy ra lỗi khi tạo người dùng.');
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file)); // Lưu file ảnh vào state và mở modal crop
            setShowCropModal(true); // Mở modal crop khi chọn ảnh
        }
    };

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            setCroppedImage(cropper.getCroppedCanvas().toDataURL());
            setShowCropModal(false); // Đóng modal sau khi crop
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4 text-center">Thông tin người dùng</h2>

                {/* Avatar Section */}
                <div className="flex justify-center mb-6">
                    <div className="relative w-32 h-32 cursor-pointer" onClick={() => avatarInputRef.current.click()}>
                        {croppedImage ? (
                            <img
                                src={croppedImage}
                                alt="Cropped"
                                className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-white">Avatar</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Name Input Section */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block font-medium mb-2">Tên:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Lưu
                        </button>
                    </div>
                </form>

                {/* Hidden input file */}
                <input
                    type="file"
                    ref={avatarInputRef}
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
            </div>

            {/* Modal Crop */}
            {showCropModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-60">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-center">Crop Avatar</h3>
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
                        <div className="flex justify-center mt-4">
                            <button
                                type="button"
                                onClick={() => setShowCropModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserModal;
