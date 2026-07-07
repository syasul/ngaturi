import { motion } from 'framer-motion';
import {
    Activity,
    ChevronRight,
    Heart,
    Home,
    LogOut,
    Shield,
    Sparkles,
    User as UserIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import api from '../lib/api';
import { useAuthStore } from '../store/auth';

export const Dashboard: React.FC = () => {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await api.post('/auth/logout');
            clearAuth();
            toast.success('Berhasil keluar.');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            clearAuth(); // Clear client session anyway
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-cream font-sans">
            {/* Premium background abstract elements */}
            <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/3 translate-x-1/3 rounded-full bg-gold-50 opacity-50 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-rustic-100 opacity-30 blur-3xl" />

            {/* Header / Nav Dashboard */}
            <header className="sticky top-0 z-30 border-b border-sand bg-white/80 px-6 py-4 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart
                            className="animate-pulse fill-gold-500 text-gold-500"
                            size={22}
                        />
                        <span className="font-sans text-xl font-bold tracking-wide text-gold-600 sm:text-2xl">
                            Ngaturi
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => navigate('/')}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-charcoal/20 text-charcoal hover:bg-cream"
                        >
                            <Home size={15} />
                            <span className="hidden sm:inline">
                                Landing Page
                            </span>
                        </Button>
                        <Button
                            onClick={handleLogout}
                            disabled={isLoading}
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1.5 text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Keluar</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Panel */}
            <main className="z-10 mx-auto w-full max-w-7xl flex-1 px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    {/* Welcome Card */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gold-500 to-gold-600 p-6 text-white shadow-lg sm:p-10">
                        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform opacity-10">
                            <Sparkles size={300} />
                        </div>
                        <div className="relative z-10 space-y-2">
                            <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-100">
                                Dasboard Pengguna
                            </span>
                            <h1 className="font-sans text-3xl font-bold tracking-wide sm:text-4xl">
                                Selamat Datang, {user?.name}!
                            </h1>
                            <p className="max-w-xl font-poppins text-sm text-gold-50/90 sm:text-base">
                                Kelola pesanan, katalog undangan, dan buat momen
                                pernikahan impian Anda menjadi kenyataan melalui
                                platform kami.
                            </p>
                        </div>
                    </div>

                    {/* User Info Bento Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {/* Profile Detail Card */}
                        <div className="space-y-6 rounded-3xl border border-sand bg-white p-6 shadow-sm md:col-span-2">
                            <div className="flex items-center gap-3 border-b border-sand pb-4">
                                <UserIcon className="text-gold-500" size={24} />
                                <h3 className="font-sans text-lg font-bold text-charcoal">
                                    Detail Profil
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6 font-poppins sm:grid-cols-2">
                                <div>
                                    <span className="mb-0.5 block text-xs text-charcoal/50">
                                        NAMA LENGKAP
                                    </span>
                                    <span className="text-sm font-semibold text-charcoal">
                                        {user?.name}
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-0.5 block text-xs text-charcoal/50">
                                        ALAMAT EMAIL
                                    </span>
                                    <span className="text-sm font-semibold text-charcoal">
                                        {user?.email}
                                    </span>
                                </div>
                                <div>
                                    <span className="mb-0.5 block text-xs text-charcoal/50">
                                        ROLE AKSES
                                    </span>
                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <Shield
                                            className="text-gold-500"
                                            size={14}
                                        />
                                        <span className="rounded-full border border-gold-200 bg-gold-50 px-2 py-0.5 text-xs font-bold text-gold-600">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="mb-0.5 block text-xs text-charcoal/50">
                                        STATUS AKUN
                                    </span>
                                    <div className="mt-0.5 flex items-center gap-1.5">
                                        <Activity
                                            className="text-green-500"
                                            size={14}
                                        />
                                        <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-bold text-green-600">
                                            {user?.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="space-y-6 rounded-3xl border border-sand bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-sand pb-4">
                                <Sparkles className="text-gold-500" size={20} />
                                <h3 className="font-sans text-lg font-bold text-charcoal">
                                    Tindakan Cepat
                                </h3>
                            </div>
                            <div className="space-y-3 font-poppins text-sm">
                                <button className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-sand p-3 text-left transition-all hover:border-gold-300 hover:bg-gold-50/20">
                                    <span>Buat Undangan Baru</span>
                                    <ChevronRight
                                        size={16}
                                        className="text-gold-500"
                                    />
                                </button>
                                <button className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-sand p-3 text-left transition-all hover:border-gold-300 hover:bg-gold-50/20">
                                    <span>Pilih Tema Undangan</span>
                                    <ChevronRight
                                        size={16}
                                        className="text-gold-500"
                                    />
                                </button>
                                <button className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-sand p-3 text-left transition-all hover:border-gold-300 hover:bg-gold-50/20">
                                    <span>Riwayat Pembelian</span>
                                    <ChevronRight
                                        size={16}
                                        className="text-gold-500"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-sand py-6 text-center font-poppins text-xs text-charcoal/40">
                © 2026 Ngaturi. Hak Cipta Dilindungi.
            </footer>
        </div>
    );
};

export default Dashboard;
