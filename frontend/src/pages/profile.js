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
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import Head from "next/head";
import { toast } from "react-toastify";

const ProfilePage = () => {
  // State Management
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
  const [currentView, setCurrentView] = useState("profile");
  const [imageUploadSuccess, setImageUploadSuccess] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");

  // Hooks
  const router = useRouter();
  const { darkMode, toggleTheme } = useTheme();

  // Effects
  useEffect(() => {
    const fetchUserProfile = async () => {
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
    };

    fetchUserProfile();
  }, [router]);

  // Event Handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        setError("Image file size must be less than 10MB");
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

  // API Functions
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

  const handleSaveImage = async () => {
    setImageLoading(true);
    setImageUploadError("");
    setImageUploadSuccess("");

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Upload image if selected
      let newImageUrl = user.image;
      if (selectedImage) {
        newImageUrl = await uploadImage(token);
      }

      // Update profile with new image
      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: newImageUrl,
          }),
        }
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.message || "Failed to update profile");
      }

      // Update local storage and state
      const updatedUser = {
        ...storedUser,
        image: newImageUrl || profileData.user?.image,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSelectedImage(null);
      setImageUploadSuccess("Profile picture updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setImageUploadSuccess(""), 3000);
    } catch (error) {
      setImageUploadError(error.message || "Failed to update profile picture");
      // Clear error after 5 seconds
      setTimeout(() => setImageUploadError(""), 5000);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
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

      // Upload image if selected
      let newImageUrl = user.image;
      if (selectedImage) {
        newImageUrl = await uploadImage(token);
      }

      // Update profile
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

      // Update local storage and state
      const updatedUser = {
        ...storedUser,
        name: formData.name,
        email: formData.email,
        image: newImageUrl || profileData.user?.image,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setSelectedImage(null);
      toast.success("Profile updated successfully");
      setCurrentView("profile");

      // Reset password fields
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

  // Component Helpers
  const formatJoinDate = (dateString) => {
    const joinDate = new Date(dateString || new Date());
    return joinDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  // Loading State
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
        {/* Header */}
        <ProfileHeader />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <ProfileSidebar
            user={user}
            imagePreview={imagePreview}
            currentView={currentView}
            setCurrentView={setCurrentView}
            handleImageChange={handleImageChange}
            handleImageError={handleImageError}
            handleLogout={handleLogout}
            imageLoading={imageLoading}
            darkMode={darkMode}
            selectedImage={selectedImage}
            handleSaveImage={handleSaveImage}
            imageUploadSuccess={imageUploadSuccess}
            imageUploadError={imageUploadError}
          />

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {currentView === "profile" && (
              <ProfileView
                user={user}
                router={router}
                darkMode={darkMode}
                formattedJoinDate={formatJoinDate(user.createdAt)}
              />
            )}

            {currentView === "edit" && (
              <EditProfileView
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setCurrentView={setCurrentView}
                loading={loading}
                imageLoading={imageLoading}
                error={error}
                darkMode={darkMode}
              />
            )}

            {currentView === "password" && (
              <PasswordView
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setCurrentView={setCurrentView}
                loading={loading}
                error={error}
                darkMode={darkMode}
              />
            )}

            {currentView === "orders" && (
              <OrdersView router={router} darkMode={darkMode} />
            )}
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

// Sub-components
const ProfileHeader = () => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text">
      Your Profile
    </h1>
    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
      Manage your account settings and preferences
    </p>
  </div>
);

const ProfileSidebar = ({
  user,
  imagePreview,
  currentView,
  setCurrentView,
  handleImageChange,
  handleImageError,
  handleLogout,
  imageLoading,
  darkMode,
  selectedImage,
  handleSaveImage,
  imageUploadSuccess,
  imageUploadError,
}) => (
  <div className="w-full lg:w-1/4">
    {/* Profile Card */}
    <div
      className={`rounded-2xl shadow-xl overflow-hidden ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="relative h-32 bg-gradient-to-r from-green-400 to-blue-500"></div>

      <div className="px-6 pb-6 -mt-16">
        {/* Profile Image */}
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
              ) : user.image ? (
                <img
                  src={user.image}
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

            {/* Camera Button */}
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
            
            {/* Save Picture Button - Only shows when a new image is selected */}
            {selectedImage && (
              <button
                onClick={handleSaveImage}
                disabled={imageLoading}
                className="absolute bottom-0 left-0 p-2 text-white transition-colors bg-green-500 rounded-full shadow-lg hover:bg-green-600"
              >
                {imageLoading ? (
                  <svg
                    className="w-4 h-4 text-white animate-spin"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Image Upload Messages */}
        <div className="text-center mt-2 min-h-[2rem]">
          {imageUploadSuccess && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {imageUploadSuccess}
            </p>
          )}
          {imageUploadError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {imageUploadError}
            </p>
          )}
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold">{user.name || "User"}</h2>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          <div className="flex items-center justify-center mt-2">
            <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-100">
              {user.isBlocked ? "Blocked" : "Active"}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="mt-6 space-y-1">
          {[
            { key: "profile", icon: FiUser, label: "Profile" },
            { key: "edit", icon: FiEdit, label: "Edit Profile" },
            { key: "password", icon: FiLock, label: "Password" },
            { key: "orders", icon: FiShoppingBag, label: "Orders" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              className={`flex items-center w-full p-3 rounded-xl transition-all ${
                currentView === key
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => setCurrentView(key)}
            >
              <Icon className="mr-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
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

    {/* Account Verified Card */}
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
          <h3 className="text-lg font-bold">Account Verification</h3>
          <p className="text-sm text-green-600 rounded dark:text-gray-400 ">
            {user.isVerified ? "Verified" : "Not verified"}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const ProfileView = ({ user, router, darkMode, formattedJoinDate }) => (
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
        <InfoCard title="Basic Information" darkMode={darkMode}>
          <InfoField label="Full Name" value={user.name || "Not provided"} />
          <InfoField label="Email Address" value={user.email} />
          {/* <InfoField label="Account Type" value="Google" /> */}
        </InfoCard>

        {/* Account Details Card */}
        <InfoCard title="Account Details" darkMode={darkMode}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              Account Status
            </label>
            <div className="flex items-center">
              <p className="text-lg font-medium">Consumer</p>
              <span className="px-2 py-1 ml-2 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-100">
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>
          </div>
          <InfoField label="Member Since" value={formattedJoinDate} />
          <InfoField label="Orders Completed" value="0" />
        </InfoCard>
      </div>

      {/* Recent Orders Section */}
      <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="mb-4 text-lg font-semibold">Recent Orders</h3>
        <OrdersTable router={router} />
      </div>
    </div>
  </div>
);

const EditProfileView = ({
  formData,
  handleChange,
  handleSubmit,
  setCurrentView,
  loading,
  imageLoading,
  error,
  darkMode,
}) => (
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
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            icon={FiUser}
            placeholder="Enter your name"
            required
          />

          <InputField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={FiMail}
            placeholder="Enter your email"
            required
          />
        </div>

        <FormActions
          onCancel={() => setCurrentView("profile")}
          loading={loading || imageLoading}
          loadingText="Saving..."
          submitText="Save Changes"
        />
      </form>
    </div>
  </div>
);

const PasswordView = ({
  formData,
  handleChange,
  handleSubmit,
  setCurrentView,
  loading,
  error,
  darkMode,
}) => (
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
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid max-w-2xl grid-cols-1 gap-6">
          <InputField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            icon={FiLock}
            placeholder="Enter current password"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InputField
              label="New Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={FiLock}
              placeholder="Enter new password"
            />

            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={FiLock}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <FormActions
          onCancel={() => setCurrentView("profile")}
          loading={loading}
          loadingText="Updating..."
          submitText="Change Password"
        />
      </form>
    </div>
  </div>
);

const OrdersView = ({ router, darkMode }) => (
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
      <OrdersTable router={router} />
    </div>
  </div>
);

// Utility Components
const InfoCard = ({ title, children, darkMode }) => (
  <div
    className={`p-5 rounded-xl ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
  >
    <h3 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-200 dark:border-gray-700">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoField = ({ label, value }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
      {label}
    </label>
    <p className="text-lg font-medium">{value}</p>
  </div>
);

const InputField = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block mb-2 text-sm font-medium">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        {...props}
        className="w-full py-3.5 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      />
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-xl dark:bg-red-900/30 dark:text-red-200">
    {message}
  </div>
);

const FormActions = ({ onCancel, loading, loadingText, submitText }) => (
  <div className="flex justify-end pt-4">
    <button
      type="button"
      className="px-6 py-3 mr-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      onClick={onCancel}
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        submitText
      )}
    </button>
  </div>
);

const OrdersTable = ({ router }) => (
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
);

export default ProfilePage;