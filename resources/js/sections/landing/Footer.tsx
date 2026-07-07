import { Link, usePage } from '@inertiajs/react';
import { Heart, Mail, Phone } from 'lucide-react';
import React from 'react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const { url } = usePage();
    const isLanding = url === '/' || url === '';

    const sitemap = [
        {
            name: 'Fitur Utama',
            href: isLanding ? '#features' : '/#features',
            isHash: true,
        },
        {
            name: 'Katalog Desain',
            href: isLanding ? '#catalog' : '/#catalog',
            isHash: true,
        },
        {
            name: 'Cara Pembuatan',
            href: isLanding ? '#how-it-works' : '/#how-it-works',
            isHash: true,
        },
        {
            name: 'Daftar Harga',
            href: isLanding ? '#pricing' : '/#pricing',
            isHash: true,
        },
    ];

    const legal = [
        { name: 'Ketentuan Layanan', href: '/syarat-ketentuan', isHash: false },
        {
            name: 'Kebijakan Privasi',
            href: '/kebijakan-privasi',
            isHash: false,
        },
        { name: 'Tentang Kami', href: '/tentang-kami', isHash: false },
        { name: 'Hubungi Kami', href: '/kontak', isHash: false },
        {
            name: 'Bantuan & FAQ',
            href: isLanding ? '#faq' : '/#faq',
            isHash: true,
        },
    ];

    return (
        <footer className="border-t border-gray-800 bg-charcoal pb-8 pt-16 font-sans text-gray-400">
            <div className="mx-auto mb-12 grid max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-8">
                {/* Left Column: Brand description */}
                <div className="md:col-span-5">
                    <Link href="/" className="mb-6 flex items-center">
                        <img
                            src="/assets/logo-full.png"
                            alt="Ngaturi Logo"
                            className="h-8 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                    <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-400/80">
                        Ngaturi membantu pasangan mewujudkan undangan pernikahan
                        digital impian yang mewah, ramah lingkungan, dan dapat
                        disebarkan secara mudah & instan.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="cursor-pointer rounded-full border border-white/5 bg-white/5 p-2.5 transition-all hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-500"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="2"
                                    y="2"
                                    width="20"
                                    height="20"
                                    rx="5"
                                    ry="5"
                                ></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line
                                    x1="17.5"
                                    y1="6.5"
                                    x2="17.51"
                                    y2="6.5"
                                ></line>
                            </svg>
                        </a>
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="cursor-pointer rounded-full border border-white/5 bg-white/5 p-2.5 transition-all hover:border-gold-500/30 hover:bg-gold-500/10 hover:text-gold-500"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Center-Left Column: Sitemap */}
                <div className="md:col-span-3">
                    <h3 className="mb-6 font-poppins text-sm font-bold uppercase tracking-wider text-white">
                        Navigasi
                    </h3>
                    <ul className="flex flex-col gap-3.5 text-sm">
                        {sitemap.map((link) => (
                            <li key={link.name}>
                                {link.isHash ? (
                                    <a
                                        href={link.href}
                                        className="transition-colors hover:text-gold-500"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="transition-colors hover:text-gold-500"
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Center-Right Column: Legal */}
                <div className="md:col-span-2">
                    <h3 className="mb-6 font-poppins text-sm font-bold uppercase tracking-wider text-white">
                        Bantuan & Legal
                    </h3>
                    <ul className="flex flex-col gap-3.5 text-sm">
                        {legal.map((link) => (
                            <li key={link.name}>
                                {link.isHash ? (
                                    <a
                                        href={link.href}
                                        className="transition-colors hover:text-gold-500"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="transition-colors hover:text-gold-500"
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Column: Contact */}
                <div className="flex flex-col items-start md:col-span-2">
                    <h3 className="mb-6 font-poppins text-sm font-bold uppercase tracking-wider text-white">
                        Hubungi Kami
                    </h3>
                    <ul className="flex flex-col gap-4 text-sm">
                        <li className="flex items-center gap-2.5">
                            <Mail size={16} className="text-gold-500" />
                            <a
                                href="mailto:support@ngaturi.id"
                                className="transition-colors hover:text-gold-500"
                            >
                                support@ngaturi.id
                            </a>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <Phone size={16} className="text-gold-500" />
                            <a
                                href="tel:+6281330012100"
                                className="transition-colors hover:text-gold-500"
                            >
                                0813-3001-2100
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-gray-800/80 px-6 pt-8 text-center text-xs text-gray-500 sm:flex-row">
                <span>
                    © {currentYear} Ngaturi (PT Ngaturi Autopilot Pernikahan).
                    All rights reserved.
                </span>
                <span className="flex items-center gap-1">
                    Made with{' '}
                    <Heart className="fill-red-500/20 text-red-500" size={12} />{' '}
                    for your special day.
                </span>
            </div>
        </footer>
    );
};
export default Footer;
