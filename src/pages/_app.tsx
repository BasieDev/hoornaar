import '../styles/globals.css';
import type { AppProps } from "next/app";
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  useEffect(() => {
    document.body.classList.remove('theme-brown', 'theme-white')

    const brownPages = ['/login', '/register'
    ] 
    if (brownPages.includes(router.pathname)) {
      document.body.classList.add('theme-brown')
    } else {
      document.body.classList.add('theme-white')
    }
  }, [router.pathname])

  return <Component {...pageProps} />
}