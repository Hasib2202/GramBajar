// src/pages/faqs.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Icons
const FiChevronDown = () => <span>⌄</span>;
const FiChevronUp = () => <span>⌃</span>;
const FiHelpCircle = () => <span>❓</span>;
const FiMessageCircle = () => <span>💬</span>;
const FiMail = () => <span>📧</span>;
const FiPhone = () => <span>📞</span>;
const FiSearch = () => <span>🔍</span>;

export default function FAQsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const isDark = false;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqCategories = [
    {
      title: "General Questions",
      icon: "🏪",
      faqs: [
        {
          question: "What is GramBajar?",
          answer: "GramBajar is a premium online grocery delivery platform that connects you with fresh, organic produce and daily essentials from local farmers and trusted suppliers. We ensure 100% organic quality and same-day delivery to your doorstep."
        },
        {
          question: "How does GramBajar work?",
          answer: "Simply browse our wide selection of fresh groceries, add items to your cart, choose your delivery time, and we'll bring everything fresh to your door. Our easy-to-use platform makes grocery shopping convenient and hassle-free."
        },
        {
          question: "What areas do you deliver to?",
          answer: "We currently deliver across Dhaka city and surrounding areas. We're expanding to other major cities in Bangladesh soon. Check our delivery areas page for the most up-to-date coverage information."
        }
      ]
    },
    {
      title: "Orders & Delivery",
      icon: "🚚",
      faqs: [
        {
          question: "How can I place an order?",
          answer: "You can place an order through our website or mobile app. Simply browse products, add them to your cart, provide your delivery address, choose payment method, and confirm your order. You'll receive an order confirmation immediately."
        },
        {
          question: "What are your delivery hours?",
          answer: "We deliver from 8:00 AM to 10:00 PM, 7 days a week. You can choose your preferred delivery time slot during checkout. Same-day delivery is available for orders placed before 6:00 PM."
        },
        {
          question: "What is the minimum order amount?",
          answer: "The minimum order amount is ৳50. Orders above ৳50 qualify for free delivery. For orders below ৳50, a delivery fee of ৳30 applies."
        },
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order is confirmed, you'll receive a tracking link via SMS and email. You can also track your order in real-time through your account dashboard or our mobile app."
        }
      ]
    },
    {
      title: "Products & Quality",
      icon: "🥬",
      faqs: [
        {
          question: "Are your products really organic?",
          answer: "Absolutely! We source directly from certified organic farms and trusted suppliers. All our produce undergoes strict quality checks and we maintain cold chain logistics to ensure freshness from farm to your table."
        },
        {
          question: "What if I'm not satisfied with the quality?",
          answer: "We have a 100% satisfaction guarantee. If you're not happy with any product quality, contact us within 24 hours of delivery and we'll provide a full refund or replacement at no extra cost."
        },
        {
          question: "How do you ensure freshness?",
          answer: "We maintain strict cold chain logistics, source directly from farms, and have high inventory turnover. Our products are stored in temperature-controlled facilities and packed fresh just before delivery."
        }
      ]
    },
    {
      title: "Payment & Pricing",
      icon: "💳",
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept cash on delivery, mobile banking (bKash, Nagad, Rocket), credit/debit cards, and bank transfers. All online payments are processed through secure payment gateways."
        },
        {
          question: "Are your prices competitive?",
          answer: "Yes! We offer competitive prices by sourcing directly from farmers and suppliers, eliminating middlemen. Plus, we regularly offer discounts and special deals to provide even better value."
        },
        {
          question: "Do you offer any discounts or promotions?",
          answer: "We regularly run promotions, seasonal discounts, and special offers for our customers. Subscribe to our newsletter or follow our social media pages to stay updated on the latest deals."
        }
      ]
    },
    {
      title: "Account & Support",
      icon: "👤",
      faqs: [
        {
          question: "Do I need to create an account to order?",
          answer: "While you can browse products without an account, creating one allows you to track orders, save favorites, view order history, and enjoy a personalized shopping experience with faster checkout."
        },
        {
          question: "How can I contact customer support?",
          answer: "You can reach us through multiple channels: call our hotline at +880-1234-567890, email us at support@grambajar.com, or use the live chat feature on our website. We're available 24/7 to help you."
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "You can cancel or modify your order within 1 hour of placing it. After that, please contact our customer support team who will do their best to accommodate your request based on order status."
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50'
    }`}>
      <Head>
        <title>FAQs - GramBajar | Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about GramBajar's grocery delivery service, orders, products, and more." />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Hero Section with Gradient */}
      <section className={`relative py-20 px-4 overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-green-900' 
          : 'bg-gradient-to-br from-green-400 via-emerald-500 to-green-600'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 text-4xl border rounded-full bg-white/20 backdrop-blur-sm border-white/30">
            <FiHelpCircle />
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
            Frequently Asked
            <span className="block text-transparent bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text">
              Questions
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-xl leading-relaxed text-green-100">
            Everything you need to know about GramBajar's fresh grocery delivery service. 
            Find instant answers to your questions below.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <FiSearch className="absolute text-lg text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-12 pr-4 text-white placeholder-green-200 transition-all border rounded-2xl bg-white/20 backdrop-blur-sm border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Content */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className="max-w-5xl mx-auto">
          {filteredCategories.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h3 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No results found
              </h3>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try searching with different keywords or browse all categories below.
              </p>
            </div>
          ) : (
            filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mr-4 ${
                    darkMode 
                      ? 'bg-gradient-to-br from-green-700 to-emerald-800' 
                      : 'bg-gradient-to-br from-green-400 to-emerald-500'
                  }`}>
                    {category.icon}
                  </div>
                  <h2 className={`text-3xl font-bold ${
                    darkMode 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'
                  }`}>
                    {category.title}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isOpen = openItems.has(globalIndex);
                    
                    return (
                      <div
                        key={faqIndex}
                        className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-800 border border-gray-700 hover:border-green-600' 
                            : 'bg-white border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-lg'
                        } ${isOpen ? (darkMode ? 'ring-2 ring-green-500/50' : 'ring-2 ring-green-400/50') : ''}`}
                      >
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className={`w-full px-8 py-6 text-left flex items-center justify-between transition-all duration-200 ${
                            darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-green-50/50'
                          }`}
                        >
                          <span className={`font-semibold text-lg pr-4 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          } group-hover:text-green-600 transition-colors`}>
                            {faq.question}
                          </span>
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isOpen 
                              ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                              : (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600')
                          } group-hover:bg-green-500 group-hover:text-white`}>
                            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                          </div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className={`px-8 pb-6 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          } leading-relaxed text-base border-t ${
                            darkMode ? 'border-gray-700' : 'border-gray-100'
                          }`}>
                            <div className="pt-4">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className={`py-20 px-4 relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-green-900' 
          : 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Still Have Questions?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-green-100">
              Our friendly customer support team is here to help you 24/7 with personalized assistance
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <FiMessageCircle />,
                title: "Live Chat",
                description: "Get instant answers from our support team in real-time",
                action: "Start Chat",
                color: "blue",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FiMail />,
                title: "Email Support",
                description: "Send us a detailed message and get a response within 2 hours",
                action: "Send Email",
                color: "green",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <FiPhone />,
                title: "Phone Support",
                description: "Call our dedicated hotline for immediate personal assistance",
                action: "Call Now",
                color: "purple",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((contact, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${contact.gradient} rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity`} />
                <div className={`relative text-center p-8 rounded-2xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 ${
                  darkMode ? 'bg-gray-800/50' : 'bg-white/20'
                } hover:transform hover:scale-105`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-3xl border rounded-full bg-white/20 backdrop-blur-sm border-white/30">
                    {contact.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-white">
                    {contact.title}
                  </h3>
                  <p className="mb-6 leading-relaxed text-green-100">
                    {contact.description}
                  </p>
                  <button className="w-full px-6 py-3 rounded-xl font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-200 hover:transform hover:translateY-[-2px]">
                    {contact.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  );
}