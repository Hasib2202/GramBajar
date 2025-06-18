// components/Footer.js
import { useState } from 'react';

// Simple icon components
const FiLeaf = () => <span>🌱</span>;
const FiMail = () => <span>📧</span>;
const FiPhone = () => <span>📞</span>;
const FiMapPin = () => <span>📍</span>;
const FiFacebook = () => <span>📘</span>;
const FiTwitter = () => <span>🐦</span>;
const FiInstagram = () => <span>📷</span>;

export default function Footer({ darkMode }) {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  return (
    <footer className={`py-16 px-4 ${darkMode ? 'bg-gray-900' : 'bg-green-900'}`}>
      <div className="mx-auto max-w-7xl">
        {/* Newsletter Section */}
        <div className={`rounded-2xl p-8 mb-12 ${darkMode ? 'bg-gray-800' : 'bg-green-800'}`}>
          <div className="mb-6 text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">Subscribe to Our Newsletter</h3>
            <p className="text-green-200">Stay updated with our latest offers, new products, and healthy recipe ideas.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex max-w-md gap-4 mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 font-medium text-white transition-colors bg-green-500 rounded-lg hover:bg-green-600"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="mr-2 text-2xl text-green-400"><FiLeaf /></div>
              <h3 className="text-2xl font-bold text-white">GramBajar</h3>
            </div>
            <p className="mb-6 text-green-200">
              Your trusted partner for fresh, organic produce delivered right to your doorstep.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-green-200">
                <FiMapPin />
                <span className="ml-2">123 Grocery Street, Food City</span>
              </div>
              <div className="flex items-center text-green-200">
                <FiPhone />
                <span className="ml-2">+880 123 456 789</span>
              </div>
              <div className="flex items-center text-green-200">
                <FiMail />
                <span className="ml-2">info@grambajar.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">About Us</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Our Products</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Categories</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Categories</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Fresh Vegetables</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Organic Fruits</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Fish & Meat</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Milk & Eggs</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Cooking Essentials</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-6 text-lg font-semibold text-white">Customer Service</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Track Your Order</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Return Policy</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-green-300 transition-colors hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Special Offers Banner */}
        <div className={`rounded-2xl p-6 mb-8 text-center ${darkMode ? 'bg-gradient-to-r from-green-700 to-green-600' : 'bg-gradient-to-r from-green-600 to-green-500'}`}>
          <h3 className="mb-2 text-xl font-bold text-white">Limited Offer - Special Deal!</h3>
          <p className="mb-4 text-green-100">Get up to 30% off on all fresh fruits and vegetables</p>
          <button className="px-6 py-2 font-medium text-green-600 transition-colors bg-white rounded-lg hover:bg-green-50">
            Shop Now
          </button>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 border-t border-green-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 text-center text-green-300 md:text-left md:mb-0">
              © {new Date().getFullYear()} GramBajar. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="text-xl text-green-300 transition-colors hover:text-white">
                <FiFacebook />
              </a>
              <a href="#" className="text-xl text-green-300 transition-colors hover:text-white">
                <FiTwitter />
              </a>
              <a href="#" className="text-xl text-green-300 transition-colors hover:text-white">
                <FiInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}