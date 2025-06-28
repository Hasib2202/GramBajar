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

export default function FAQsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

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

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Head>
        <title>FAQs - GramBajar | Frequently Asked Questions</title>
        <meta name="description" content="Find answers to common questions about GramBajar's grocery delivery service, orders, products, and more." />
      </Head>

      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* Hero Section */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 text-3xl ${
            darkMode ? 'bg-green-900 text-green-400' : 'bg-green-200 text-green-600'
          }`}>
            <FiHelpCircle />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need to know about GramBajar's fresh grocery delivery service. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>
      </section>

      {/* FAQs Content */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {category.title}
              </h2>
              
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex; // Unique index for each FAQ
                  const isOpen = openItems.has(globalIndex);
                  
                  return (
                    <div
                      key={faqIndex}
                      className={`border rounded-lg overflow-hidden ${
                        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between hover:bg-opacity-50 transition-colors ${
                          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className={`font-semibold pr-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {faq.question}
                        </span>
                        <span className={`flex-shrink-0 text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                        </span>
                      </button>
                      
                      {isOpen && (
                        <div className={`px-6 pb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <p className="leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Still Have Questions?
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Our friendly customer support team is here to help you 24/7
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <FiMessageCircle />,
                title: "Live Chat",
                description: "Chat with our support team in real-time",
                action: "Start Chat",
                color: "blue"
              },
              {
                icon: <FiMail />,
                title: "Email Support",
                description: "Send us an email and we'll respond within 2 hours",
                action: "Send Email",
                color: "green"
              },
              {
                icon: <FiPhone />,
                title: "Phone Support",
                description: "Call our hotline for immediate assistance",
                action: "Call Now",
                color: "purple"
              }
            ].map((contact, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                } hover:shadow-lg transition-shadow`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 text-2xl ${
                  contact.color === 'blue' 
                    ? 'bg-blue-100 text-blue-600' 
                    : contact.color === 'green'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {contact.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {contact.title}
                </h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {contact.description}
                </p>
                <button className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  contact.color === 'blue'
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : contact.color === 'green'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}>
                  {contact.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  );
}