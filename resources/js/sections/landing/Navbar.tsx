import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Heart, LogOut, LayoutDashboard } from 'lucide-react'
import { Link, usePage, router } from '@inertiajs/react'
import Button from '../../components/ui/Button'
import { toast } from 'sonner'

export const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const { props, url } = usePage()
  const user = (props.auth as any)?.user

  const handleLogout = () => {
    router.post(route('logout'), {}, {
      onSuccess: () => {
        toast.success('Berhasil keluar.')
      }
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Check if user scrolled down past threshold
      setIsScrolled(currentScrollY > 20)

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const isLanding = url === '/' || url === ''

  const navLinks = [
    { name: 'Home', href: isLanding ? '#home' : '/#home' },
    { name: 'Fitur', href: isLanding ? '#features' : '/#features' },
    { name: 'Katalog', href: isLanding ? '#catalog' : '/#catalog' },
    { name: 'Cara Kerja', href: isLanding ? '#how-it-works' : '/#how-it-works' },
    { name: 'Harga', href: isLanding ? '#pricing' : '/#pricing' },
    { name: 'FAQ', href: isLanding ? '#faq' : '/#faq' },
  ]

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-cream/80 backdrop-blur-md border-b border-sand shadow-xs py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-bold text-gold-600 tracking-wide"
          >
            <Heart className="fill-gold-500 text-gold-500 animate-pulse" size={22} />
            <span>Ngaturi</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-poppins text-sm text-charcoal/80 hover:text-gold-500 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA / Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button size="sm" variant="ghost" className="flex items-center gap-1.5 text-charcoal/80 hover:text-gold-500 cursor-pointer">
                    <LayoutDashboard size={15} />
                    <span>Dasbor</span>
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer" onClick={handleLogout}>
                  <LogOut size={14} />
                  <span>Keluar</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="ghost" className="text-charcoal/80 hover:text-gold-500 cursor-pointer">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="primary">
                    Mulai Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-charcoal hover:text-gold-500 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/95 backdrop-blur-md border-b border-sand overflow-hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-poppins text-base text-charcoal/90 hover:text-gold-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="md" variant="outline" className="w-full flex items-center justify-center gap-2">
                      <LayoutDashboard size={16} />
                      <span>Dasbor</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleLogout()
                    }}
                    size="md"
                    variant="ghost"
                    className="w-full text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 mt-2"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="md" variant="ghost" className="w-full text-center">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="md" variant="primary" className="w-full mt-2">
                      Mulai Sekarang
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </AnimatePresence>
  )
}

export default Navbar
