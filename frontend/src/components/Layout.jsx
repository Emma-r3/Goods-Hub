import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { trackPageView } from '../utils/analytics'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  // Kembali ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Kirim page view ke Google Analytics setiap URL berubah
  useEffect(() => {
    trackPageView(pathname + search)
  }, [pathname, search])

  return null
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}