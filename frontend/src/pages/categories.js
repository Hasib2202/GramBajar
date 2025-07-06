// pages/categories.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '@/context/ThemeContext';

export default function CategoriesPage() {
    const router = useRouter();
    // const [darkMode, setDarkMode] = useState(false);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const { darkMode } = useTheme();

    // Sample categories data - in a real app, this would come from an API
    const sampleCategories = [
        { _id: '1', name: 'Fish', image: '', productCount: 25 },
        { _id: '2', name: 'Meat', image: '', productCount: 30 },
        { _id: '3', name: 'Vegetables', image: '', productCount: 50 },
        { _id: '4', name: 'Milk and Egg', image: '', productCount: 15 },
        { _id: '5', name: 'Fruits', image: '', productCount: 40 },
        { _id: '6', name: 'Cooking Essentials', image: '', productCount: 35 },
        { _id: '7', name: 'Bakery', image: '', productCount: 27 },
        { _id: '8', name: 'Beverages', image: '', productCount: 48 },
        { _id: '9', name: 'Snacks', image: '', productCount: 65 },
        { _id: '10', name: 'Organic Products', image: '', productCount: 32 },
        { _id: '11', name: 'Dairy Alternatives', image: '', productCount: 22 },
        { _id: '12', name: 'Frozen Foods', image: '', productCount: 38 },
        { _id: '13', name: 'Spices', image: '', productCount: 45 },
        { _id: '14', name: 'Canned Goods', image: '', productCount: 52 },
        { _id: '15', name: 'Condiments', image: '', productCount: 41 },
        { _id: '16', name: 'Grains & Rice', image: '', productCount: 37 },
    ];

    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.documentElement.classList.toggle('dark', newMode);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/categories`
            );
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
                setFilteredCategories(data.categories);
            } else {
                // Fallback if API fails
                setCategories(sampleCategories);
                setFilteredCategories(sampleCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback data if API fails
            setCategories(sampleCategories);
            setFilteredCategories(sampleCategories);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Filter categories based on search term
        if (searchTerm) {
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(filtered);
            setCurrentPage(1); // Reset to first page when searching
        } else {
            setFilteredCategories(categories);
        }
    }, [searchTerm, categories]);

    // const navigateToProducts = (categoryId) => {
    //     // Fixed navigation to ensure products page loads correctly
    //     router.push({
    //         pathname: '/products',
    //         query: { category: categoryId }
    //     });
    // };

    const navigateToProducts = (categoryId = null) => {
        const url = categoryId ? `/products?category=${categoryId}` : '/products';
        window.location.href = url;
    };

    // Calculate paginated categories
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
                <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
                <div className="px-4 py-16 mx-auto max-w-7xl">
                    {/* Search Skeleton */}
                    <div className={`max-w-2xl mx-auto mb-16 rounded-xl h-16 animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-white'}`}></div>

                    {/* Categories Grid Skeleton */}
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-xl h-64 animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
                            >
                                <div className={`h-40 rounded-t-xl ${darkMode ? 'bg-slate-700' : 'bg-emerald-100'}`}></div>
                                <div className="p-4">
                                    <div className={`h-6 w-3/4 rounded mb-2 ${darkMode ? 'bg-slate-700' : 'bg-emerald-100'}`}></div>
                                    <div className={`h-4 w-1/2 rounded ${darkMode ? 'bg-slate-700' : 'bg-emerald-100'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer darkMode={darkMode} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
            <Head>
                <title>Product Categories - GramBajar | Fresh Groceries Online</title>
                <meta name="description" content="Browse our wide selection of fresh grocery categories at GramBajar" />
            </Head>

            <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

            {/* Hero Section */}
            <section
                className={`
    relative overflow-hidden py-16 px-4 text-white
    ${darkMode
                        ? 'bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900'
                        : 'bg-gradient-to-br from-green-400 via-green-500 to-green-600'}
  `}
            >
                {/* Subtle overlay circles for depth */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 -translate-x-1/2 rounded-full left-1/2 w-80 h-80 bg-white/10 blur-2xl"></div>
                    <div className="absolute bottom-0 rounded-full right-1/3 w-96 h-96 bg-white/5 blur-3xl"></div>
                </div>

                <div className="relative mx-auto text-center max-w-7xl">
                    <h1 className="mb-6 text-3xl font-extrabold md:text-5xl">
                        Browse Our Categories
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg opacity-90">
                        Explore our carefully curated selection of fresh grocery categories
                    </p>
                </div>
            </section>

            {/* Search Section */}
            <section className={`py-8 px-4 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="mx-auto max-w-7xl">
                    <div className={`flex rounded-xl overflow-hidden shadow-md ${darkMode ? 'bg-slate-700' : 'bg-white border border-emerald-100'
                        }`}>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className={`flex-1 py-4 px-6 focus:outline-none ${darkMode ? 'bg-slate-700 text-white' : 'text-slate-800'
                                }`}
                        />
                        <button className={`px-6 py-4 ${darkMode ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-500 hover:bg-emerald-400'
                            } text-white font-bold`}>
                            Search
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Showing {filteredCategories.length} categories
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Page {currentPage} of {totalPages}
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="px-4 py-12">
                <div className="mx-auto max-w-7xl">
                    {filteredCategories.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mb-6 text-5xl">🔍</div>
                            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                No categories found
                            </h3>
                            <p className={`mb-8 max-w-xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                We couldn't find any categories matching your search. Try different keywords.
                            </p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className={`px-6 py-3 rounded-lg font-bold ${darkMode
                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                    : 'bg-emerald-500 hover:bg-emerald-400 text-white'
                                    }`}
                            >
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {currentCategories.map((category) => (
                                    <div
                                        key={category._id}
                                        onClick={() => navigateToProducts(category._id)}
                                        className={`group rounded-xl overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:shadow-xl'
                                            }`}
                                    >
                                        {/* Category Image */}
                                        <div className="relative h-48">
                                            <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-slate-700' : 'bg-emerald-50'
                                                }`}>
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <span className="text-5xl">
                                                        {category.name.includes('Fish') && '🐟'}
                                                        {category.name.includes('Meat') && '🥩'}
                                                        {category.name.includes('Vegetables') && '🥦'}
                                                        {category.name.includes('Milk') && '🥛'}
                                                        {category.name.includes('Fruits') && '🍎'}
                                                        {category.name.includes('Cooking') && '🧂'}
                                                        {category.name.includes('Bakery') && '🥖'}
                                                        {category.name.includes('Beverages') && '🥤'}
                                                        {category.name.includes('Snacks') && '🍿'}
                                                        {category.name.includes('Organic') && '🌿'}
                                                        {category.name.includes('Dairy') && '🥛'}
                                                        {category.name.includes('Frozen') && '❄️'}
                                                        {category.name.includes('Spices') && '🌶️'}
                                                        {category.name.includes('Canned') && '🥫'}
                                                        {category.name.includes('Condiments') && '🍶'}
                                                        {category.name.includes('Grains') && '🌾'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-sm font-bold ${darkMode ? 'bg-emerald-600' : 'bg-emerald-500 text-white'
                                                }`}>
                                                {category.productCount || 0} items
                                            </div>
                                        </div>

                                        {/* Category Info */}
                                        <div className="p-6">
                                            <h3 className={`text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors ${darkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-800'
                                                }`}>
                                                {category.name}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm ${darkMode ? 'text-emerald-400' : 'text-emerald-600'
                                                    }`}>
                                                    View Products
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-5 w-5 transform transition-transform group-hover:translate-x-1 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'
                                                        }`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className={`flex justify-center mt-16 py-6 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white shadow-sm'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode
                                                ? 'bg-slate-700 hover:bg-slate-600 disabled:opacity-50'
                                                : 'bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50'
                                                }`}
                                        >
                                            &lt;
                                        </button>

                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handlePageChange(index + 1)}
                                                className={`w-10 h-10 rounded-lg ${currentPage === index + 1
                                                    ? darkMode
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'bg-emerald-500 text-white'
                                                    : darkMode
                                                        ? 'bg-slate-700 hover:bg-slate-600'
                                                        : 'bg-emerald-100 hover:bg-emerald-200'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode
                                                ? 'bg-slate-700 hover:bg-slate-600 disabled:opacity-50'
                                                : 'bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50'
                                                }`}
                                        >
                                            &gt;
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section
                className={`
    relative overflow-hidden py-16 px-4 text-white
    ${darkMode
                        ? 'bg-gradient-to-tr from-teal-900 via-emerald-800 to-green-900'
                        : 'bg-gradient-to-tr from-green-500 via-green-600 to-emerald-500'}
  `}
            >
                {/* Subtle overlay shapes */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute rounded-full top-1/4 right-1/4 w-72 h-72 bg-white/10 blur-2xl"></div>
                    <div className="absolute w-64 h-64 rounded-full bottom-1/3 left-1/3 bg-white/5 blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="mb-6 text-3xl font-extrabold">
                        Can't find what you're looking for?
                    </h2>
                    <p className="max-w-2xl mx-auto mb-10 opacity-90">
                        Contact our support team for assistance with special orders or product requests.
                    </p>
                    <button
                        className={`
        px-8 py-4 font-bold rounded-lg transition-transform duration-200
        ${darkMode
                                ? 'bg-green-700 hover:bg-green-600 border-2 border-green-500'
                                : 'bg-white text-green-700 hover:bg-green-50 border-2 border-green-100'}
        transform hover:scale-105
      `}
                    >
                        Contact Support
                    </button>
                </div>
            </section>

            <Footer darkMode={darkMode} />
        </div>
    );
}