// pages/orders/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiShoppingBag, FiCheck, FiX, FiClock } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";
import Head from "next/head";

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      setError("");
      
      try {
        const stored = localStorage.getItem("user");
        if (!stored) {
          router.replace("/login");
          return;
        }

        const { token } = JSON.parse(stored);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        // Handle the API response structure - extract the order from the response
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, router]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return <FiCheck className="text-green-500" />;
      case "cancelled":
        return <FiX className="text-red-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

  // Helper function to safely get price value
  const getPrice = (priceObj) => {
    if (typeof priceObj === 'number') return priceObj;
    if (priceObj && priceObj.$numberDecimal) return parseFloat(priceObj.$numberDecimal);
    return 0;
  };

  // Helper function to get the actual item price (fallback to product price if item price is 0)
  const getItemPrice = (item) => {
    const itemPrice = getPrice(item.price);
    if (itemPrice > 0) return itemPrice;
    
    // Fallback to product price if item price is 0
    if (item.productId && item.productId.price) {
      return getPrice(item.productId.price);
    }
    
    return 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
        <p className="mt-4 text-lg font-medium">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-6 text-center">
          <FiX className="mx-auto mb-4 text-4xl text-red-500" />
          <p className="text-xl font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order || !order._id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="p-6 text-center">
          <FiShoppingBag className="mx-auto mb-4 text-4xl text-gray-400" />
          <p className="text-xl font-medium">Order not found</p>
          <button
            onClick={() => router.push("/")}
            className="mt-6 px-5 py-2.5 bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
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
        <title>Order #{order._id.substring(0, 8)} - GramBajar</title>
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <div className="flex-1 w-full max-w-4xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </button>
        </div>

        <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Order #{order._id.substring(0, 8)}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="mr-2">{getStatusIcon(order.status)}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status.toLowerCase() === "completed" || order.status.toLowerCase() === "paid"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : order.status.toLowerCase() === "cancelled"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Order Summary */}
          <div
            className={`rounded-2xl shadow-xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(
                    order.products.reduce(
                      (sum, item) => sum + getItemPrice(item) * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600 dark:text-green-400">
                  {formatCurrency(
                    order.products.reduce(
                      (sum, item) => {
                        const originalPrice = getPrice(item.originalPrice) || getItemPrice(item);
                        const currentPrice = getItemPrice(item);
                        return sum + Math.max(0, (originalPrice - currentPrice) * item.quantity);
                      },
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {formatCurrency(
                    order.totalAmount || 
                    order.products.reduce(
                      (sum, item) => sum + getItemPrice(item) * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div
            className={`rounded-2xl shadow-xl p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="mb-4 text-xl font-bold">Shipping Information</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-600 dark:text-gray-400">Contact</h3>
                <p>{order.contact}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-600 dark:text-gray-400">Address</h3>
                <p>{order.address}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-600 dark:text-gray-400">Order Date</h3>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              {order.updatedAt && (
                <div>
                  <h3 className="font-medium text-gray-600 dark:text-gray-400">Last Updated</h3>
                  <p>{formatDate(order.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          className={`mt-8 rounded-2xl shadow-xl p-6 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="mb-4 text-xl font-bold">Order Items</h2>
          <div className="space-y-6">
            {order.products.map((item) => (
              <div
                key={item._id}
                className="flex pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
              >
                <div className="w-24 h-24 mr-4 overflow-hidden rounded-lg">
                  {item.productId?.images?.[0] ? (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200 border-2 border-dashed rounded-lg">
                      <FiShoppingBag className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.productId?.title || 'Product'}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Quantity: {item.quantity}
                  </p>
                  <div className="flex justify-between mt-2">
                    <div>
                      <span className="font-medium">
                        {formatCurrency(getItemPrice(item))}
                      </span>
                      {item.originalPrice && getPrice(item.originalPrice) > getItemPrice(item) && (
                        <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                          {formatCurrency(getPrice(item.originalPrice))}
                        </span>
                      )}
                    </div>
                    <div className="font-medium">
                      {formatCurrency(getItemPrice(item) * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
};

export default OrderDetailsPage;