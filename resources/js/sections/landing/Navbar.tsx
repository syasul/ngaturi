import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';

export const Navbar: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { props, url } = usePage();
    const user = (props.auth as any)?.user;

    const handleLogout = () => {
        router.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    toast.success('Berhasil keluar.');
                },
            },
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Check if user scrolled down past threshold
            setIsScrolled(currentScrollY > 20);

            // Hide navbar when scrolling down, show when scrolling up
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const isLanding = url === '/' || url === '';

    const navLinks = [
        { name: 'Home', href: isLanding ? '#home' : '/#home' },
        { name: 'Fitur', href: isLanding ? '#features' : '/#features' },
        { name: 'Katalog', href: isLanding ? '#catalog' : '/#catalog' },
        {
            name: 'Cara Kerja',
            href: isLanding ? '#how-it-works' : '/#how-it-works',
        },
        { name: 'Harga', href: isLanding ? '#pricing' : '/#pricing' },
        { name: 'FAQ', href: isLanding ? '#faq' : '/#faq' },
    ];

    return (
        <AnimatePresence>
            <motion.nav
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${
                    isScrolled
                        ? 'shadow-xs border-b border-sand bg-cream/80 py-4 backdrop-blur-md'
                        : 'bg-transparent py-6'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/assets/logo-full.png"
                            alt="Ngaturi Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden items-center gap-8 md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="font-poppins text-sm text-charcoal/80 transition-colors hover:text-gold-500"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* CTA / Auth Buttons */}
                    <div className="hidden items-center gap-4 md:flex">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="flex cursor-pointer items-center gap-1.5 text-charcoal/80 hover:text-gold-500"
                                    >
                                        <LayoutDashboard size={15} />
                                        <span>Dasboard</span>
                                    </Button>
                                </Link>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex cursor-pointer items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={14} />
                                    <span>Keluar</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="cursor-pointer text-charcoal/80 hover:text-gold-500"
                                    >
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
                        className="cursor-pointer p-1 text-charcoal transition-colors hover:text-gold-500 md:hidden"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Navigation */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-b border-sand bg-cream/95 backdrop-blur-md md:hidden"
                    >
                        <div className="flex flex-col gap-4 px-6 py-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="font-poppins text-base text-charcoal/90 transition-colors hover:text-gold-500"
                                >
                                    {link.name}
                                </a>
                            ))}
                            {user ? (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/dashboard"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            size="md"
                                            variant="outline"
                                            className="flex w-full items-center justify-center gap-2"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dasboard</span>
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        size="md"
                                        variant="ghost"
                                        className="mt-2 flex w-full items-center justify-center gap-2 text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        <span>Keluar</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        href="/login"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            size="md"
                                            variant="ghost"
                                            className="w-full text-center"
                                        >
                                            Masuk
                                        </Button>
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Button
                                            size="md"
                                            variant="primary"
                                            className="mt-2 w-full"
                                        >
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
    );
};

export default Navbar;
