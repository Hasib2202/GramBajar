// src/pages/register.js
import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect } from 'react';


export default function RegisterPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Remove localStorage usage
    const isDark = false; // Default to light mode
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    // Remove localStorage usage
    document.documentElement.classList.toggle('dark', newMode);
  };
  return (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <RegisterForm />
      <Footer darkMode={darkMode} />
    </>

  );
}