// pages/profile.js
import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiCamera,
  FiShoppingBag,
  FiEdit,
  FiLogOut,
  FiChevronRight,
} from "react-icons/fi";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import Head from "next/head";

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
  const [currentView, setCurrentView] = useState("profile");
  const router = useRouter();

  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
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

    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profileDetails`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
          confirmPassword: "",
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      } catch (err) {
        console.error(err);
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

      if (file.size > 5 * 1024 * 1024) {
        setError("Image file size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedImage(file);

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
            Authorization: `Bearer ${token}`,
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

      if (selectedImage) {
        newImageUrl = await uploadImage(token);
      }

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
            image: newImageUrl,
          }),
        }
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.message || "Failed to update profile");
      }

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

      const updatedUser = {
        ...storedUser,
        name: formData.name,
        email: formData.email,
        image: newImageUrl || profileData.user?.image,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSelectedImage(null);
      setSuccess("Profile updated successfully");
      setCurrentView("profile");

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setError(
        error.message || "An error occurred while updating your profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImagePreview("");
    if (user?.image) {
      const updatedUser = { ...user, image: "" };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading your profile...
        </p>
      </div>
    );
  }

  // Format join date
  const joinDate = new Date(user.createdAt || new Date());
  const formattedJoinDate = joinDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Head>
        <title>Profile - GramBajar | Fresh Groceries Online</title>
        <meta
          name="description"
          content="Manage your GramBajar account and preferences"
        />
      </Head>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <div className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text">
            Your Profile
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div
              className={`rounded-2xl shadow-xl overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="relative h-32 bg-gradient-to-r from-green-400 to-blue-500"></div>

              <div className="px-6 pb-6 -mt-16">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 overflow-hidden border-4 border-white rounded-full dark:border-gray-800">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={user.name || "Profile"}
                          className="object-cover w-full h-full"
                          onError={handleImageError}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200 border-2 border-dashed rounded-full dark:bg-gray-700">
                          <FiUser
                            size={32}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer dark:bg-gray-700">
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                        disabled={imageLoading}
                      />
                      <FiCamera className="text-blue-600 dark:text-blue-400" />
                    </label>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold">{user.name || "User"}</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>

                  <div className="flex items-center justify-center mt-2">
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-100">
                      Premium Member
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <button
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      currentView === "profile"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setCurrentView("profile")}
                  >
                    <FiUser className="mr-3" />
                    <span>Profile</span>
                  </button>

                  <button
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      currentView === "edit"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setCurrentView("edit")}
                  >
                    <FiEdit className="mr-3" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      currentView === "password"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setCurrentView("password")}
                  >
                    <FiLock className="mr-3" />
                    <span>Password</span>
                  </button>

                  <button
                    className={`flex items-center w-full p-3 rounded-xl transition-all ${
                      currentView === "orders"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setCurrentView("orders")}
                  >
                    <FiShoppingBag className="mr-3" />
                    <span>Orders</span>
                  </button>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="flex items-center justify-center w-full p-3 text-red-600 transition-all rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`mt-6 rounded-2xl shadow-xl p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl dark:bg-blue-900/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold">Account Verified</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your account is secured
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {currentView === "profile" && (
              <div
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Manage your personal details and account settings
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Information Card */}
                    <div
                      className={`p-5 rounded-xl ${
                        darkMode ? "bg-gray-700/50" : "bg-gray-50"
                      }`}
                    >
                      <h3 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">
                        Basic Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Full Name
                          </label>
                          <p className="text-lg font-medium">
                            {user.name || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Email Address
                          </label>
                          <p className="text-lg font-medium">{user.email}</p>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Account Type
                          </label>
                          <p className="text-lg font-medium">Google</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Details Card */}
                    <div
                      className={`p-5 rounded-xl ${
                        darkMode ? "bg-gray-700/50" : "bg-gray-50"
                      }`}
                    >
                      <h3 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">
                        Account Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Account Status
                          </label>
                          <div className="flex items-center">
                            <p className="text-lg font-medium">
                              Premium Member
                            </p>
                            <span className="px-2 py-1 ml-2 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-100">
                              Active
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Member Since
                          </label>
                          <p className="text-lg font-medium">
                            {formattedJoinDate}
                          </p>
                        </div>

                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Orders Completed
                          </label>
                          <p className="text-lg font-medium">0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="mb-4 text-lg font-semibold">
                      Recent Orders
                    </h3>

                    <div className="overflow-hidden border border-gray-200 rounded-xl dark:border-gray-700">
                      <div className="grid grid-cols-4 px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800/50">
                        <div>Order ID</div>
                        <div>Date</div>
                        <div>Status</div>
                        <div>Total</div>
                      </div>

                      <div className="p-8 text-center">
                        <FiShoppingBag className="mx-auto mb-4 text-4xl text-gray-400" />
                        <p className="text-lg font-medium">No orders yet</p>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          Your completed orders will appear here
                        </p>
                        <button
                          onClick={() => router.push("/")}
                          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors"
                        >
                          Start Shopping
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === "edit" && (
              <div
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">Edit Profile</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Update your personal information
                  </p>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-xl dark:bg-green-900/30 dark:text-green-200">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiUser className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full py-3.5 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiMail className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full py-3.5 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        className="px-6 py-3 mr-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setCurrentView("profile")}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || imageLoading}
                        className="px-6 py-3 font-medium text-white transition-all shadow-md bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70"
                      >
                        {loading || imageLoading ? (
                          <>
                            <svg
                              className="inline w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {currentView === "password" && (
              <div
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">Change Password</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Update your account password
                  </p>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-200">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-xl dark:bg-green-900/30 dark:text-green-200">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid max-w-2xl grid-cols-1 gap-6">
                      <div>
                        <label className="block mb-2 text-sm font-medium">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiLock className="w-5 h-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className="w-full py-3.5 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            placeholder="Enter current password"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                          <label className="block mb-2 text-sm font-medium">
                            New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiLock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full py-3.5 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                              placeholder="Enter new password"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-2 text-sm font-medium">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FiLock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="w-full py-3.5 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        className="px-6 py-3 mr-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                        onClick={() => setCurrentView("profile")}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 font-medium text-white transition-all shadow-md bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <svg
                              className="inline w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {currentView === "orders" && (
              <div
                className={`rounded-2xl shadow-xl overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold">Your Orders</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    View your order history and track current orders
                  </p>
                </div>

                <div className="p-6">
                  <div className="overflow-hidden border border-gray-200 rounded-xl dark:border-gray-700">
                    <div className="grid grid-cols-4 px-4 py-3 text-sm font-medium bg-gray-50 dark:bg-gray-800/50">
                      <div>Order ID</div>
                      <div>Date</div>
                      <div>Status</div>
                      <div>Total</div>
                    </div>

                    <div className="p-8 text-center">
                      <FiShoppingBag className="mx-auto mb-4 text-4xl text-gray-400" />
                      <p className="text-lg font-medium">No orders yet</p>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Your completed orders will appear here
                      </p>
                      <button
                        onClick={() => router.push("/")}
                        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors"
                      >
                        Start Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default ProfilePage;
