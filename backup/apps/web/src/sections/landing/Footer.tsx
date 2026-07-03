import React from 'react'
import { Heart, Mail, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const sitemap = [
    { name: 'Fitur Utama', href: isLanding ? '#features' : '/#features', isHash: true },
    { name: 'Katalog Desain', href: isLanding ? '#catalog' : '/#catalog', isHash: true },
    { name: 'Cara Pembuatan', href: isLanding ? '#how-it-works' : '/#how-it-works', isHash: true },
    { name: 'Daftar Harga', href: isLanding ? '#pricing' : '/#pricing', isHash: true },
  ]

  const legal = [
    { name: 'Ketentuan Layanan', href: '/syarat-ketentuan', isHash: false },
    { name: 'Kebijakan Privasi', href: '/kebijakan-privasi', isHash: false },
    { name: 'Tentang Kami', href: '/tentang-kami', isHash: false },
    { name: 'Hubungi Kami', href: '/kontak', isHash: false },
    { name: 'Bantuan & FAQ', href: isLanding ? '#faq' : '/#faq', isHash: true },
  ]

  return (
    <footer className="bg-charcoal text-gray-400 font-sans pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12">
        {/* Left Column: Brand description */}
        <div className="md:col-span-5">
          <Link
            to="/"
            className="flex items-center gap-2 font-serif text-xl sm:text-2xl font-bold text-gold-500 tracking-wide mb-6"
          >
            <Heart className="fill-gold-500 text-gold-500" size={20} />
            <span>Ngaturi</span>
          </Link>
          <p className="text-sm text-gray-400/80 leading-relaxed mb-6 max-w-sm">
            Ngaturi membantu pasangan mewujudkan undangan pernikahan digital impian yang mewah,
            ramah lingkungan, dan dapat disebarkan secara mudah & instan.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="p-2.5 rounded-full bg-white/5 hover:bg-gold-500/10 hover:text-gold-500 border border-white/5 hover:border-gold-500/30 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="p-2.5 rounded-full bg-white/5 hover:bg-gold-500/10 hover:text-gold-500 border border-white/5 hover:border-gold-500/30 transition-all cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
          </div>
        </div>

        {/* Center-Left Column: Sitemap */}
        <div className="md:col-span-3">
          <h3 className="font-poppins font-bold text-sm text-white uppercase tracking-wider mb-6">
            Navigasi
          </h3>
          <ul className="flex flex-col gap-3.5 text-sm">
            {sitemap.map((link) => (
              <li key={link.name}>
                {link.isHash ? (
                  <a href={link.href} className="hover:text-gold-500 transition-colors">
                    {link.name}
                  </a>
                ) : (
                  <Link to={link.href} className="hover:text-gold-500 transition-colors">
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Center-Right Column: Legal */}
        <div className="md:col-span-2">
          <h3 className="font-poppins font-bold text-sm text-white uppercase tracking-wider mb-6">
            Bantuan & Legal
          </h3>
          <ul className="flex flex-col gap-3.5 text-sm">
            {legal.map((link) => (
              <li key={link.name}>
                {link.isHash ? (
                  <a href={link.href} className="hover:text-gold-500 transition-colors">
                    {link.name}
                  </a>
                ) : (
                  <Link to={link.href} className="hover:text-gold-500 transition-colors">
                    {link.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Contact */}
        <div className="md:col-span-2 flex flex-col items-start">
          <h3 className="font-poppins font-bold text-sm text-white uppercase tracking-wider mb-6">
            Hubungi Kami
          </h3>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex gap-2.5 items-center">
              <Mail size={16} className="text-gold-500" />
              <a href="mailto:support@ngaturi.id" className="hover:text-gold-500 transition-colors">
                support@ngaturi.id
              </a>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone size={16} className="text-gold-500" />
              <a href="tel:+6281330012100" className="hover:text-gold-500 transition-colors">
                0813-3001-2100
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-gray-800/80 pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>
          © {currentYear} Ngaturi (PT Ngaturi Autopilot Pernikahan). All rights reserved.
        </span>
        <span className="flex items-center gap-1">
          Made with <Heart className="fill-red-500/20 text-red-500" size={12} /> for your special day.
        </span>
      </div>
    </footer>
  )
}
export default Footer
