import { ThemeProvider } from '@/context/ThemeContext'
import '@/styles/globals.css'
import '../styles/fonts.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: 'red',
              secondary: 'white',
            },
          },
        }}
      />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}