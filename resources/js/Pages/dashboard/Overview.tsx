import {
    Calendar,
    Check,
    ChevronRight,
    Clock,
    Copy,
    ExternalLink,
    Globe,
    Heart,
    MessageSquare,
    Palette,
    QrCode,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Overview = () => {
    const navigate = useNavigate();
    const [wedding, setWedding] = useState<any>(null);
    const [stats, setStats] = useState<any>({
        total: 0,
        attending: 0,
        declined: 0,
        tentative: 0,
        pending: 0,
    });
    const [recentWishes, setRecentWishes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // 1. Fetch wedding and stats
    useEffect(() => {
        const initOverview = async () => {
            try {
                const res = await api.get('/weddings/me');
                if (res.data.status === 'success') {
                    if (!res.data.wedding) {
                        // No wedding found -> Go to onboarding
                        navigate('/dashboard/onboarding');
                        return;
                    }
                    setWedding(res.data.wedding);

                    // Fetch guest stats
                    const statsRes = await api.get('/guests/stats');
                    if (statsRes.data.status === 'success') {
                        setStats(statsRes.data.stats);
                    }

                    // Fetch guests for recent wishes
                    const guestsRes = await api.get('/guests');
                    if (guestsRes.data.status === 'success') {
                        const wishes = (guestsRes.data.guests || [])
                            .filter(
                                (g: any) =>
                                    g.message && g.message.trim() !== '',
                            )
                            .slice(0, 3);
                        setRecentWishes(wishes);
                    }
                }
            } catch (err) {
                console.error('Error loading overview data:', err);
                toast.error('Gagal memuat ringkasan Dasboard.');
            } finally {
                setLoading(false);
            }
        };

        initOverview();
    }, [navigate]);

    // 2. Countdown logic
    useEffect(() => {
        if (!wedding?.data?.schedule?.akad?.date) return;

        const weddingDateStr = wedding.data.schedule.akad.date;
        const targetDate = new Date(weddingDateStr).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) / (1000 * 60),
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [wedding]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Link undangan berhasil disalin!');
    };

    const getThemeName = (themeId: string) => {
        const themes: Record<string, string> = {
            elegant: 'Elegant Gold Theme',
            rustic: 'Rustic Bohemian Theme',
            modern: 'Modern Minimalist Theme',
            'royal-yogyakarta': 'Royal Yogyakarta Heritage',
            'botanical-minimal': 'Botanical Minimal Theme',
            'editorial-mono': 'Editorial Mono Theme',
            'burgundy-bloom': 'Burgundy Bloom Premium',
        };
        return themes[themeId] || themeId || 'Belum Dipilih';
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <p className="text-sm font-medium text-charcoal/60">
                    Memuat data Dasboard...
                </p>
            </div>
        );
    }

    const weddingDateFormatted = wedding?.data?.schedule?.akad?.date
        ? new Date(wedding.data.schedule.akad.date).toLocaleDateString(
              'id-ID',
              {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              },
          )
        : 'Belum diisi';

    const previewUrl = `${window.location.origin}/u/${wedding?.slug}`;

    // Preparation checklist
    const checklist = [
        {
            title: 'Pilih Paket & Bayar',
            desc: 'Aktifkan limit tamu dan fitur premium.',
            checked: !!wedding?.package?.packageName,
        },
        {
            title: 'Pilih Tema Undangan',
            desc: 'Pilih template desain sesuai keinginan.',
            checked: !!wedding?.themeId,
        },
        {
            title: 'Isi Data Mempelai & Jadwal',
            desc: 'Lengkapi data akad, resepsi, dan biodata.',
            checked: !!wedding?.data?.groom?.name,
        },
        {
            title: 'Daftarkan Tamu Undangan',
            desc: 'Input atau import tamu untuk membagikan link.',
            checked: stats.total > 0,
        },
    ];
    const completedCount = checklist.filter((item) => item.checked).length;
    const progressPercent = Math.round(
        (completedCount / checklist.length) * 100,
    );

    return (
        <div className="space-y-8 font-sans">
            {/* 1. Welcome Card Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-r from-charcoal via-[#231A18] to-charcoal p-6 text-white shadow-lg sm:p-8">
                {/* Ornament decoration */}
                <div className="pointer-events-none absolute bottom-0 right-0 translate-x-8 translate-y-8 transform opacity-15">
                    <Heart size={200} className="stroke-[0.5] text-gold-400" />
                </div>
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div className="space-y-2">
                        <Badge
                            variant="warning"
                            className="border-gold-500/35 bg-gold-500/20 text-[10px] font-bold uppercase tracking-wider text-gold-300"
                        >
                            Wedding Dashboard
                        </Badge>
                        <h2 className="mt-2 font-sans text-2xl font-bold tracking-wide sm:text-3xl">
                            Selamat Datang,{' '}
                            {wedding?.data?.groom?.nickname || 'Mempelai'} &{' '}
                            {wedding?.data?.bride?.nickname || 'Mempelai'}
                        </h2>
                        <p className="max-w-xl text-xs leading-relaxed text-cream/70 sm:text-sm">
                            Hari istimewa Anda sedang dalam persiapan. Kelola
                            detail profil, tema warna, daftar tamu, dan pantau
                            RSVP di satu tempat.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1.5 rounded-xl border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                            >
                                <ExternalLink size={14} />
                                <span>Lihat Undangan</span>
                            </Button>
                        </a>
                        <Link to="/dashboard/wedding-data">
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex items-center gap-1.5 rounded-xl border-none bg-gold-500 text-white shadow-md shadow-gold-500/20 hover:bg-gold-600"
                            >
                                <span>Kelola Data</span>
                                <ChevronRight size={14} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Premium Info Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Status card */}
                <Card className="group flex flex-col justify-between rounded-3xl border border-sand/35 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div>
                        <div className="flex items-start justify-between">
                            <div className="rounded-2xl bg-gold-500/10 p-3 text-gold-600 transition-transform group-hover:scale-105">
                                <Globe size={20} />
                            </div>
                            <Badge
                                variant={
                                    wedding?.status === 'published'
                                        ? 'success'
                                        : 'warning'
                                }
                            >
                                {wedding?.status === 'published'
                                    ? 'Published'
                                    : 'Draft'}
                            </Badge>
                        </div>
                        <h4 className="mt-5 text-xs font-bold uppercase tracking-widest text-charcoal/50">
                            Link & Tema Undangan
                        </h4>
                        <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-sand/30 bg-cream/15 p-2.5">
                            <span className="truncate text-xs font-semibold text-charcoal">
                                u/{wedding?.slug}
                            </span>
                            <button
                                onClick={() => copyToClipboard(previewUrl)}
                                className="rounded-lg border border-transparent p-1.5 text-gold-600 transition-colors hover:border-sand hover:bg-white hover:text-gold-700"
                                title="Salin Link"
                            >
                                <Copy size={13} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between border-t border-sand/20 pt-4 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                        <span>
                            Tema:{' '}
                            <span className="text-gold-600">
                                {getThemeName(wedding?.themeId)}
                            </span>
                        </span>
                        <span>
                            Level:{' '}
                            <span className="text-gold-600">
                                {wedding?.package?.packageName || 'BASIC'}
                            </span>
                        </span>
                    </div>
                </Card>

                {/* Countdown card */}
                <Card className="group flex flex-col justify-between rounded-3xl border border-sand/35 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div>
                        <div className="w-fit rounded-2xl bg-gold-500/10 p-3 text-gold-600 transition-transform group-hover:scale-105">
                            <Clock size={20} />
                        </div>
                        <h4 className="mt-5 text-xs font-bold uppercase tracking-widest text-charcoal/50">
                            Hitung Mundur Hari H
                        </h4>
                        <div className="mt-2.5 grid grid-cols-4 gap-2 text-center">
                            <div className="rounded-xl border border-sand/20 bg-cream/25 py-2">
                                <p className="text-xl font-bold text-gold-600">
                                    {timeLeft.days}
                                </p>
                                <p className="text-[9px] font-bold uppercase text-charcoal/45">
                                    Hari
                                </p>
                            </div>
                            <div className="rounded-xl border border-sand/20 bg-cream/25 py-2">
                                <p className="text-xl font-bold text-gold-600">
                                    {timeLeft.hours}
                                </p>
                                <p className="text-[9px] font-bold uppercase text-charcoal/45">
                                    Jam
                                </p>
                            </div>
                            <div className="rounded-xl border border-sand/20 bg-cream/25 py-2">
                                <p className="text-xl font-bold text-gold-600">
                                    {timeLeft.minutes}
                                </p>
                                <p className="text-[9px] font-bold uppercase text-charcoal/45">
                                    Min
                                </p>
                            </div>
                            <div className="rounded-xl border border-sand/20 bg-cream/25 py-2">
                                <p className="text-xl font-bold text-gold-600">
                                    {timeLeft.seconds}
                                </p>
                                <p className="text-[9px] font-bold uppercase text-charcoal/45">
                                    Det
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 truncate border-t border-sand/20 pt-4 text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                        <Calendar size={12} className="text-gold-500" />
                        <span className="truncate">{weddingDateFormatted}</span>
                    </div>
                </Card>

                {/* Guest Summary Card */}
                <Card className="group flex flex-col justify-between rounded-3xl border border-sand/35 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div>
                        <div className="w-fit rounded-2xl bg-gold-500/10 p-3 text-gold-600 transition-transform group-hover:scale-105">
                            <Users size={20} />
                        </div>
                        <h4 className="mt-5 text-xs font-bold uppercase tracking-widest text-charcoal/50">
                            Total Tamu Terdaftar
                        </h4>
                        <p className="mt-1.5 font-sans text-3xl font-bold text-charcoal">
                            {stats.total}{' '}
                            <span className="font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                                Tamu
                            </span>
                        </p>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-sand/20 pt-4 text-center text-[10px] font-bold uppercase">
                        <div>
                            <p className="text-sm font-bold text-green-600">
                                {stats.attending}
                            </p>
                            <p className="text-[9px] text-charcoal/45">Hadir</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-500">
                                {stats.declined}
                            </p>
                            <p className="text-[9px] text-charcoal/45">Absen</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gold-600">
                                {stats.tentative}
                            </p>
                            <p className="text-[9px] text-charcoal/45">Ragu</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 3. Quick Actions Panel */}
            <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-charcoal">
                    <Sparkles size={20} className="text-gold-500" />
                    <span>Aksi Cepat</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Link to="/dashboard/wedding-data" className="group">
                        <Card className="cursor-pointer space-y-2 rounded-2xl border border-sand/40 bg-white p-4 text-center shadow-sm transition-all hover:border-gold-500/30 hover:bg-cream/5">
                            <div className="mx-auto w-fit rounded-xl bg-red-50 p-3 text-red-500 transition-transform group-hover:scale-105">
                                <Heart size={18} />
                            </div>
                            <p className="text-xs font-bold text-charcoal">
                                Tulis Biodata
                            </p>
                        </Card>
                    </Link>

                    <Link to="/dashboard/themes" className="group">
                        <Card className="cursor-pointer space-y-2 rounded-2xl border border-sand/40 bg-white p-4 text-center shadow-sm transition-all hover:border-gold-500/30 hover:bg-cream/5">
                            <div className="mx-auto w-fit rounded-xl bg-blue-50 p-3 text-blue-500 transition-transform group-hover:scale-105">
                                <Palette size={18} />
                            </div>
                            <p className="text-xs font-bold text-charcoal">
                                Pilih Tema & Warna
                            </p>
                        </Card>
                    </Link>

                    <Link to="/dashboard/guests" className="group">
                        <Card className="cursor-pointer space-y-2 rounded-2xl border border-sand/40 bg-white p-4 text-center shadow-sm transition-all hover:border-gold-500/30 hover:bg-cream/5">
                            <div className="mx-auto w-fit rounded-xl bg-green-50 p-3 text-green-500 transition-transform group-hover:scale-105">
                                <Users size={18} />
                            </div>
                            <p className="text-xs font-bold text-charcoal">
                                Kelola Tamu
                            </p>
                        </Card>
                    </Link>

                    <Link to="/dashboard/checkin" className="group">
                        <Card className="cursor-pointer space-y-2 rounded-2xl border border-sand/40 bg-white p-4 text-center shadow-sm transition-all hover:border-gold-500/30 hover:bg-cream/5">
                            <div className="mx-auto w-fit rounded-xl bg-gold-50 p-3 text-gold-600 transition-transform group-hover:scale-105">
                                <QrCode size={18} />
                            </div>
                            <p className="text-xs font-bold text-charcoal">
                                Scan Tiket QR
                            </p>
                        </Card>
                    </Link>
                </div>
            </div>

            {/* 4. Detailed Sections Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* RSVP Stats and Chart Breakdown */}
                <div className="space-y-6 lg:col-span-2">
                    <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-charcoal">
                        <TrendingUp size={20} className="text-gold-500" />
                        <span>Ringkasan Respon Kehadiran</span>
                    </h3>

                    <div className="grid grid-cols-1 items-center gap-6 rounded-3xl border border-sand/35 bg-white p-6 shadow-sm sm:grid-cols-2">
                        {/* Donut Chart Visual */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative flex h-36 w-36 items-center justify-center">
                                <svg
                                    className="h-full w-full -rotate-90 transform"
                                    viewBox="0 0 36 36"
                                >
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.915"
                                        fill="none"
                                        stroke="#F3F0EC"
                                        strokeWidth="3.2"
                                    />
                                    {stats.total > 0 && (
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="15.915"
                                            fill="none"
                                            stroke="#16A34A"
                                            strokeWidth="3.2"
                                            strokeDasharray={`${(stats.attending / stats.total) * 100} ${100 - (stats.attending / stats.total) * 100}`}
                                            strokeDashoffset="0"
                                        />
                                    )}
                                    {stats.total > 0 && (
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="15.915"
                                            fill="none"
                                            stroke="#EF4444"
                                            strokeWidth="3.2"
                                            strokeDasharray={`${(stats.declined / stats.total) * 100} ${100 - (stats.declined / stats.total) * 100}`}
                                            strokeDashoffset={`-${(stats.attending / stats.total) * 100}`}
                                        />
                                    )}
                                    {stats.total > 0 && (
                                        <circle
                                            cx="18"
                                            cy="18"
                                            r="15.915"
                                            fill="none"
                                            stroke="#D4AF37"
                                            strokeWidth="3.2"
                                            strokeDasharray={`${(stats.tentative / stats.total) * 100} ${100 - (stats.tentative / stats.total) * 100}`}
                                            strokeDashoffset={`-${((stats.attending + stats.declined) / stats.total) * 100}`}
                                        />
                                    )}
                                </svg>
                                <div className="absolute text-center">
                                    <p className="text-2xl font-bold text-charcoal">
                                        {stats.total > 0
                                            ? Math.round(
                                                  ((stats.attending +
                                                      stats.declined +
                                                      stats.tentative) /
                                                      stats.total) *
                                                      100,
                                              )
                                            : 0}
                                        %
                                    </p>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-charcoal/50">
                                        Respon
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Labels Breakdown */}
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between border-b border-sand/20 pb-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                                    <span className="font-semibold text-charcoal/70">
                                        Hadir
                                    </span>
                                </div>
                                <span className="font-bold text-charcoal">
                                    {stats.attending} Tamu
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-sand/20 pb-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                    <span className="font-semibold text-charcoal/70">
                                        Tidak Hadir
                                    </span>
                                </div>
                                <span className="font-bold text-charcoal">
                                    {stats.declined} Tamu
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-sand/20 pb-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
                                    <span className="font-semibold text-charcoal/70">
                                        Ragu-ragu
                                    </span>
                                </div>
                                <span className="font-bold text-charcoal">
                                    {stats.tentative} Tamu
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                                    <span className="font-semibold text-charcoal/70">
                                        Belum Konfirmasi
                                    </span>
                                </div>
                                <span className="font-bold text-charcoal">
                                    {stats.pending} Tamu
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Wishes Section */}
                    <div className="space-y-4">
                        <h3 className="flex items-center gap-2 font-sans text-xl font-bold text-charcoal">
                            <MessageSquare
                                size={20}
                                className="text-gold-500"
                            />
                            <span>Ucapan & Doa Restu Terbaru</span>
                        </h3>

                        {recentWishes.length === 0 ? (
                            <div className="rounded-3xl border border-sand/35 bg-white p-8 text-center text-xs text-charcoal/40">
                                Belum ada ucapan dari tamu terdaftar.
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {recentWishes.map((wish: any) => (
                                    <div
                                        key={wish.id}
                                        className="flex flex-col gap-1.5 rounded-2xl border border-sand/35 bg-white p-4 shadow-sm"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-charcoal">
                                                {wish.name}
                                            </span>
                                            <Badge
                                                variant={
                                                    wish.rsvpStatus ===
                                                        'attending' ||
                                                    wish.rsvpStatus === 'hadir'
                                                        ? 'success'
                                                        : 'danger'
                                                }
                                            >
                                                {wish.rsvpStatus}
                                            </Badge>
                                        </div>
                                        <p className="text-xs italic text-charcoal/75">
                                            "{wish.message}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Preparation Tracker & Checklist */}
                <div className="space-y-6">
                    <h3 className="font-sans text-xl font-bold text-charcoal">
                        Persiapan Pernikahan
                    </h3>

                    <Card className="space-y-6 rounded-3xl border border-sand/35 bg-white p-6 shadow-sm">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-charcoal">
                                <span>Progress Checklist</span>
                                <span className="text-gold-600">
                                    {progressPercent}%
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full border border-sand/20 bg-cream/45">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Checklist Items */}
                        <div className="space-y-4">
                            {checklist.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3.5 text-xs"
                                >
                                    <div
                                        className={`mt-0.5 rounded-lg border p-1 ${
                                            item.checked
                                                ? 'border-green-200 bg-green-50 text-green-600'
                                                : 'border-sand/40 bg-cream/15 text-charcoal/30'
                                        }`}
                                    >
                                        {item.checked ? (
                                            <Check
                                                size={12}
                                                className="stroke-[3]"
                                            />
                                        ) : (
                                            <div className="h-3 w-3" />
                                        )}
                                    </div>
                                    <div>
                                        <p
                                            className={`font-bold ${item.checked ? 'text-charcoal' : 'text-charcoal/60'}`}
                                        >
                                            {item.title}
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-charcoal/45">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

Overview.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Overview;
