import { ThemeProvider } from '@/context/ThemeContext'
import '@/styles/globals.css'
import '../styles/fonts.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}