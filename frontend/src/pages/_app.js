import { ThemeProvider } from '@/context/ThemeContext'
import '@/styles/globals.css'
import '../styles/fonts.css';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from '../context/CartContext';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#363636',
          color: '#fff',
        }}
      />
      <Head>
        <link
          rel="preload"
          as="image"
          href="/images/veg.jpg"
        />
      </Head>
       <CartProvider>
        <Component {...pageProps} />
       </CartProvider>
    </ThemeProvider>
  )
}