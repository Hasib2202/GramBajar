// pages/profile.js
import { useState, useEffect } from "react";
import { FiUser, FiMail, FiLock, FiSave, FiCamera } from "react-icons/fi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/router";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        currentPassword: "",
        password: "",
        confirmPassword: "",
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    useEffect(() => {
        // 1️⃣ Immediate check for token in localStorage
        const stored = localStorage.getItem("user");
        if (!stored) {
            router.replace("/login");
            return;
        }
        const { token } = JSON.parse(stored);
        if (!token) {
            router.replace("/login");
            return;
        }

        // 2️⃣ Fetch profile
        (async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profileDetails`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (!res.ok) {
                    throw new Error("Not authorized");
                }
                const data = await res.json();
                setUser(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    currentPassword: "",
                    password: "",
                    confirmPassword: ""
                });
                if (data.image) {
                    setImagePreview(data.image);
                }
            } catch (err) {
                console.error(err);
                // 3️⃣ On any error (401, network), clear and redirect
                localStorage.removeItem("user");
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        })();
    }, [router]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image file size must be less than 5MB");
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please select a valid image file");
                return;
            }

            setSelectedImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (token) => {
        if (!selectedImage) return null;

        setImageLoading(true);
        const formDataImg = new FormData();
        formDataImg.append("profileImage", selectedImage);

        try {
            const uploadResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formDataImg,
                }
            );

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.message || "Failed to upload profile image");
            }

            return uploadData.image;
        } catch (error) {
            throw new Error(error.message || "Failed to upload image");
        } finally {
            setImageLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            const token = storedUser?.token;

            if (!token) {
                throw new Error("No authentication token found");
            }

            let newImageUrl = user.image;

            // Upload image first if selected
            if (selectedImage) {
                newImageUrl = await uploadImage(token);
            }

            // Update basic profile info
            const profileResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        image: newImageUrl // Include image in profile update
                    }),
                }
            );

            const profileData = await profileResponse.json();

            if (!profileResponse.ok) {
                throw new Error(profileData.message || "Failed to update profile");
            }

            // Update password if provided
            if (formData.password && formData.currentPassword) {
                const passwordResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/password`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            currentPassword: formData.currentPassword,
                            newPassword: formData.password,
                        }),
                    }
                );

                const passwordData = await passwordResponse.json();

                if (!passwordResponse.ok) {
                    throw new Error(passwordData.message || "Failed to update password");
                }
            }

            // Update user in localStorage with the response from server
            const updatedUser = {
                ...storedUser,
                name: formData.name,
                email: formData.email,
                image: newImageUrl || profileData.user?.image
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setSelectedImage(null);
            setSuccess('Profile updated successfully');

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                password: "",
                confirmPassword: ""
            }));

        } catch (error) {
            setError(error.message || "An error occurred while updating your profile");
        } finally {
            setLoading(false);
        }
    };

    // Image error handler
    const handleImageError = () => {
        setImagePreview("");
        // Optionally update user data to remove broken image URL
        if (user?.image) {
            const updatedUser = { ...user, image: "" };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <p className="ml-4">Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="mb-12 text-3xl font-bold text-center text-gray-900 dark:text-white">
                    Your Profile
                </h1>

                <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 rounded-2xl">
                    {/* Profile Header */}
                    <div className="relative h-48 bg-gradient-to-r from-green-500 to-blue-600">
                        <div className="absolute -bottom-16 left-8">
                            <div className="relative">
                                <div className="w-32 h-32 overflow-hidden bg-white border-4 border-white rounded-full dark:border-gray-800 dark:bg-gray-800">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt={user.name || "Profile"}
                                            className="object-cover w-full h-full"
                                            onError={handleImageError}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-400 bg-gray-200 border-2 border-dashed rounded-full">
                                            <FiUser size={48} />
                                        </div>
                                    )}

                                    {/* Loading overlay for image upload */}
                                    {imageLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                                            <div className="w-8 h-8 border-b-2 border-white rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute p-2 transition-colors bg-white rounded-full shadow-md cursor-pointer bottom-2 right-2 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        disabled={imageLoading}
                                    />
                                    <FiCamera className="text-gray-700 dark:text-gray-300" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-8 mt-20">
                        {/* Alerts */}
                        {error && (
                            <Alert variant="error" className="mb-6">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert variant="success" className="mb-6">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <FiUser className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FiMail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                    Change Password (Optional)
                                </h2>

                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <FiLock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <FiLock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || imageLoading}
                                className="flex items-center justify-center w-full px-6 py-3 font-medium text-white rounded-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;