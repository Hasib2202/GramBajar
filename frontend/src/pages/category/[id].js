// // pages/category/[id].js
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import Navbar from '../../components/Navbar';
// import Footer from '../../components/Footer';

// export default function CategoryPage() {
//   const router = useRouter();
//   const { id } = router.query;
//   const [darkMode, setDarkMode] = useState(false);
//   const [category, setCategory] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sort, setSort] = useState('popular');
//   const [priceRange, setPriceRange] = useState([0, 500]);

//   const toggleTheme = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   useEffect(() => {
//     if (id) {
//       // Simulate fetching category and products
//       setLoading(true);
//       setTimeout(() => {
//         setCategory({
//           _id: id,
//           name: id === 'vegetables' ? 'Fresh Vegetables' : 
//                 id === 'fruits' ? 'Seasonal Fruits' : 
//                 'Organic Products',
//           description: id === 'vegetables' 
//             ? 'Farm-fresh vegetables delivered within 24 hours of harvest' 
//             : id === 'fruits' 
//             ? 'Seasonal fruits at their peak ripeness and flavor' 
//             : 'Organic products sourced from certified farms'
//         });
        
//         // Sample products data
//         setProducts([
//           { id: 1, name: 'Organic Tomatoes', price: 120, discount: 10, rating: 4.5, image: '' },
//           { id: 2, name: 'Fresh Carrots', price: 80, discount: 0, rating: 4.2, image: '' },
//           { id: 3, name: 'Cucumbers', price: 70, discount: 15, rating: 4.7, image: '' },
//           { id: 4, name: 'Bell Peppers', price: 150, discount: 5, rating: 4.3, image: '' },
//           { id: 5, name: 'Spinach Bundle', price: 50, discount: 20, rating: 4.8, image: '' },
//           { id: 6, name: 'Broccoli', price: 100, discount: 0, rating: 4.1, image: '' },
//           { id: 7, name: 'Potatoes (1kg)', price: 60, discount: 10, rating: 4.4, image: '' },
//           { id: 8, name: 'Onions (1kg)', price: 65, discount: 0, rating: 4.6, image: '' }
//         ]);
//         setLoading(false);
//       }, 800);
//     }
//   }, [id]);

//   const handleSortChange = (e) => {
//     setSort(e.target.value);
//   };

//   const handlePriceChange = (min, max) => {
//     setPriceRange([min, max]);
//   };

//   if (loading) {
//     return (
//       <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
//         <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
//         <div className="max-w-6xl px-4 py-12 mx-auto">
//           <div className={`h-12 w-64 rounded-xl animate-pulse mb-10 ${darkMode ? 'bg-slate-800' : 'bg-white'}`}></div>
//           <div className="flex flex-col gap-8 md:flex-row">
//             <div className="space-y-6 md:w-1/4">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className={`h-48 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-white'}`}></div>
//               ))}
//             </div>
//             <div className="md:w-3/4">
//               <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//                 {[...Array(8)].map((_, i) => (
//                   <div key={i} className={`h-64 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-white'}`}></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer darkMode={darkMode} />
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
//       <Head>
//         <title>{category.name} - GramBajar | Fresh Groceries Online</title>
//         <meta name="description" content={category.description} />
//       </Head>

//       <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

//       {/* Category Header */}
//       <section className={`py-12 px-4 ${darkMode ? 'bg-slate-800' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}`}>
//         <div className="max-w-6xl mx-auto">
//           <h1 className="mb-4 text-3xl font-bold md:text-4xl">{category.name}</h1>
//           <p className="max-w-3xl text-lg">{category.description}</p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="px-4 py-12">
//         <div className="max-w-6xl mx-auto">
//           <div className="flex flex-col gap-8 md:flex-row">
//             {/* Filters Sidebar */}
//             <div className="md:w-1/4">
//               <div className={`p-6 rounded-xl sticky top-24 ${darkMode ? 'bg-slate-800' : 'bg-white shadow-md'}`}>
//                 <h2 className="mb-6 text-xl font-bold">Filters</h2>
                
//                 {/* Price Filter */}
//                 <div className="mb-8">
//                   <h3 className="mb-4 font-bold">Price Range</h3>
//                   <div className="px-2">
//                     <input 
//                       type="range" 
//                       min="0" 
//                       max="500" 
//                       value={priceRange[1]}
//                       onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
//                       className="w-full"
//                     />
//                     <div className="flex justify-between mt-2">
//                       <span>৳0</span>
//                       <span>৳{priceRange[1]}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Rating Filter */}
//                 <div className="mb-8">
//                   <h3 className="mb-4 font-bold">Rating</h3>
//                   <div className="space-y-2">
//                     {[4, 3, 2].map(rating => (
//                       <label key={rating} className="flex items-center">
//                         <input type="checkbox" className="mr-2" />
//                         <span className="flex">
//                           {[...Array(5)].map((_, i) => (
//                             <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
//                           ))}
//                           <span className="ml-1">& up</span>
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Discount Filter */}
//                 <div className="mb-8">
//                   <h3 className="mb-4 font-bold">Discount</h3>
//                   <div className="space-y-2">
//                     {['10% or more', '20% or more', '30% or more', '50% or more'].map(discount => (
//                       <label key={discount} className="flex items-center">
//                         <input type="checkbox" className="mr-2" />
//                         {discount}
//                       </label>
//                     ))}
//                   </div>
//                 </div>
                
//                 <button className={`w-full py-3 font-bold rounded-lg ${
//                   darkMode 
//                     ? 'bg-slate-700 hover:bg-slate-600' 
//                     : 'bg-emerald-100 hover:bg-emerald-200'
//                 }`}>
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
            
//             {/* Products Grid */}
//             <div className="md:w-3/4">
//               {/* Sorting Controls */}
//               <div className={`flex flex-wrap items-center justify-between mb-8 p-4 rounded-xl ${
//                 darkMode ? 'bg-slate-800' : 'bg-white shadow-md'
//               }`}>
//                 <p className="mb-4 md:mb-0">
//                   Showing <span className="font-bold">{products.length}</span> products
//                 </p>
//                 <div className="flex items-center">
//                   <span className="mr-3">Sort by:</span>
//                   <select 
//                     value={sort} 
//                     onChange={handleSortChange}
//                     className={`px-4 py-2 rounded-lg ${
//                       darkMode 
//                         ? 'bg-slate-700 text-white' 
//                         : 'bg-emerald-50'
//                     }`}
//                   >
//                     <option value="popular">Most Popular</option>
//                     <option value="price-low">Price: Low to High</option>
//                     <option value="price-high">Price: High to Low</option>
//                     <option value="rating">Highest Rated</option>
//                     <option value="discount">Best Discount</option>
//                   </select>
//                 </div>
//               </div>
              
//               {/* Products Grid */}
//               <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
//                 {products.map((product) => {
//                   const discountPrice = product.discount > 0 
//                     ? product.price * (1 - product.discount / 100)
//                     : product.price;
                  
//                   return (
//                     <div 
//                       key={product.id}
//                       className={`rounded-xl overflow-hidden transition-all hover:shadow-xl ${
//                         darkMode 
//                           ? 'bg-slate-800 hover:bg-slate-700' 
//                           : 'bg-white hover:border-emerald-300 border border-white'
//                       }`}
//                     >
//                       <div className={`h-40 ${darkMode ? 'bg-slate-700' : 'bg-emerald-100'}`}></div>
//                       <div className="p-4">
//                         <h3 className="mb-1 font-bold line-clamp-1">{product.name}</h3>
                        
//                         {/* Rating */}
//                         <div className="flex items-center mb-2">
//                           <div className="flex mr-2">
//                             {[...Array(5)].map((_, i) => (
//                               <span 
//                                 key={i} 
//                                 className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
//                               >
//                                 ★
//                               </span>
//                             ))}
//                           </div>
//                           <span className="text-xs text-gray-500">{product.rating}</span>
//                         </div>
                        
//                         {/* Pricing */}
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <span className="text-lg font-bold text-emerald-600">
//                               ৳{discountPrice.toFixed(0)}
//                             </span>
//                             {product.discount > 0 && (
//                               <span className="ml-2 text-sm text-gray-500 line-through">
//                                 ৳{product.price}
//                               </span>
//                             )}
//                           </div>
//                           {product.discount > 0 && (
//                             <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded">
//                               {product.discount}% OFF
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Add to Cart */}
//                         <button className={`w-full py-2 mt-4 rounded-lg text-sm font-medium ${
//                           darkMode 
//                             ? 'bg-emerald-600 hover:bg-emerald-500' 
//                             : 'bg-emerald-500 hover:bg-emerald-400 text-white'
//                         }`}>
//                           Add to Cart
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
              
//               {/* Pagination */}
//               <div className={`flex justify-center mt-12 p-4 rounded-xl ${
//                 darkMode ? 'bg-slate-800' : 'bg-white shadow-md'
//               }`}>
//                 <div className="flex space-x-2">
//                   {[1, 2, 3, 4, 5].map(page => (
//                     <button 
//                       key={page}
//                       className={`w-10 h-10 rounded-lg ${
//                         page === 1 
//                           ? darkMode 
//                             ? 'bg-emerald-600 text-white' 
//                             : 'bg-emerald-500 text-white'
//                           : darkMode 
//                             ? 'bg-slate-700 hover:bg-slate-600' 
//                             : 'bg-emerald-100 hover:bg-emerald-200'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button className={`w-10 h-10 rounded-lg ${
//                     darkMode 
//                       ? 'bg-slate-700 hover:bg-slate-600' 
//                       : 'bg-emerald-100 hover:bg-emerald-200'
//                   }`}>
//                     &gt;
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <Footer darkMode={darkMode} />
//     </div>
//   );
// }