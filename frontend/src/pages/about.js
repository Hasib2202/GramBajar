// pages/about.js
import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
      <Head>
        <title>About Us - GramBajar | Fresh Groceries Online</title>
        <meta name="description" content="Learn about GramBajar's mission to deliver fresh groceries directly from farms to your doorstep." />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white' : 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            <div className="space-y-8 lg:w-1/2">
              <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
                Our <span className="text-transparent bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">Story</span>
              </h1>
              <p className="text-xl leading-relaxed lg:text-2xl opacity-90">
                Founded in 2023, GramBajar began with a simple mission: to connect local farmers directly with consumers, ensuring freshness while supporting sustainable agriculture.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className={`px-8 py-4 font-bold transition-all duration-300 rounded-xl ${
                  darkMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl' 
                    : 'bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl'
                } transform hover:scale-105`}>
                  Meet Our Farmers
                </button>
                <button className={`px-8 py-4 font-bold transition-all duration-300 border-2 rounded-xl ${
                  darkMode 
                    ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900' 
                    : 'border-white text-white hover:bg-white hover:text-green-600'
                } transform hover:scale-105`}>
                  Our Mission
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:w-1/2">
              <div className="relative">
                <div className={`w-72 h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border-4 transform rotate-3 ${
                  darkMode 
                    ? 'border-green-400 bg-gradient-to-br from-green-600 to-emerald-700' 
                    : 'border-white bg-gradient-to-br from-green-400 to-emerald-500'
                } shadow-2xl`}>
                </div>
                <div className={`absolute -bottom-6 -right-6 w-36 h-36 lg:w-48 lg:h-48 rounded-2xl overflow-hidden border-4 transform -rotate-6 ${
                  darkMode 
                    ? 'border-emerald-300 bg-gradient-to-br from-emerald-500 to-teal-600' 
                    : 'border-white bg-gradient-to-br from-emerald-300 to-teal-400'
                } shadow-xl`}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className={`mb-6 text-4xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Mission & Values
            </h2>
            <div className="w-32 h-1.5 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {[
              { 
                title: "Farm Fresh", 
                desc: "We deliver produce within 24 hours of harvest, ensuring maximum freshness and nutrition.",
                icon: "🌱",
                gradient: "from-green-400 to-emerald-500"
              },
              { 
                title: "Farmer Support", 
                desc: "70% of our revenue goes directly to farmers, helping sustain local agriculture.",
                icon: "👨‍🌾",
                gradient: "from-emerald-400 to-teal-500"
              },
              { 
                title: "Zero Waste", 
                desc: "Our packaging is 100% biodegradable and we donate unsold produce to food banks.",
                icon: "♻️",
                gradient: "from-teal-400 to-green-500"
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`p-8 lg:p-10 rounded-2xl transition-all duration-300 hover:shadow-2xl group transform hover:-translate-y-2 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 hover:from-white hover:to-green-50 border border-green-100 hover:border-green-200'
                }`}
              >
                <div className={`text-6xl mb-8 transition-transform duration-300 group-hover:scale-110 ${
                  darkMode ? 'filter brightness-110' : ''
                }`}>
                  {item.icon}
                </div>
                <h3 className={`mb-6 text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.desc}
                </p>
                <div className={`w-full h-1 mt-6 bg-gradient-to-r ${item.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'}`}>
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <h2 className={`mb-6 text-4xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Meet Our Team
            </h2>
            <p className={`max-w-3xl mx-auto text-xl ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Passionate individuals working together to revolutionize the grocery industry
            </p>
            <div className="w-32 h-1.5 mx-auto mt-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Ayesha Rahman", role: "Founder & CEO", bio: "Former agricultural economist with 10+ years experience" },
              { name: "Rahim Ahmed", role: "CTO", bio: "Tech entrepreneur focused on sustainable supply chains" },
              { name: "Fatima Khan", role: "Head of Farmer Relations", bio: "Grew up on a farm, passionate about farmer welfare" },
              { name: "Karim Hossain", role: "Logistics Director", bio: "Expert in cold chain management and efficient delivery" }
            ].map((member, index) => (
              <div 
                key={index} 
                className={`rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 group ${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl border border-gray-700' 
                    : 'bg-white shadow-lg hover:shadow-2xl border border-green-100'
                }`}
              >
                <div className={`h-56 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                    : 'bg-gradient-to-br from-green-200 to-emerald-300'
                } relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className={`mb-3 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                  </h3>
                  <p className={`font-semibold mb-4 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {member.role}
                  </p>
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 px-4 ${
        darkMode 
          ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white' 
          : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 text-white'
      }`}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: "2500+", label: "Happy Customers" },
              { value: "120+", label: "Local Farmers" },
              { value: "98%", label: "Freshness Rating" },
              { value: "24h", label: "Delivery Time" }
            ].map((stat, index) => (
              <div key={index} className="p-8 group">
                <div className="mb-4 text-5xl font-bold transition-transform duration-300 lg:text-6xl group-hover:scale-110">
                  {stat.value}
                </div>
                <div className="text-lg lg:text-xl opacity-90">{stat.label}</div>
                <div className="w-16 h-1 mx-auto mt-4 transition-all duration-300 rounded-full bg-white/30 group-hover:w-24 group-hover:bg-white/50"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className={`mb-8 text-4xl lg:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Join Our <span className="text-transparent bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text">Freshness Revolution</span>
          </h2>
          <p className={`max-w-3xl mx-auto mb-12 text-xl leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Experience farm-fresh groceries delivered to your doorstep while supporting sustainable farming practices.
          </p>
          <button className="px-10 py-5 font-bold text-white transition-all duration-300 transform shadow-xl rounded-xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 hover:scale-105 hover:shadow-2xl">
            Shop Fresh Produce Now
          </button>
        </div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  );
}