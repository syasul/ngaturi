import { ArrowRight, Check, Copy, ExternalLink, Eye, Lock, Palette } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

const TIER_LEVELS: Record<string, number> = {
    BASIC: 1,
    PREMIUM: 2,
    CUSTOM: 3,
};

export const Themes: React.FC = () => {
    const [wedding, setWedding] = useState<any>(null);
    const [themes, setThemes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingThemeId, setSavingThemeId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const weddingRes = await api.get('/weddings/me');
                if (weddingRes.data.status === 'success') {
                    setWedding(weddingRes.data.wedding);
                }

                const themesRes = await api.get('/themes');
                if (themesRes.data.status === 'success') {
                    setThemes(themesRes.data.themes);
                }
            } catch (err) {
                toast.error('Gagal mengambil daftar tema.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSelectTheme = async (themeId: string, packageLevel: string) => {
        const userPkg = wedding?.package?.packageName || 'BASIC';
        const userTierRank = TIER_LEVELS[userPkg?.toUpperCase() || 'BASIC'] || 1;
        const themeTierRank = TIER_LEVELS[packageLevel?.toUpperCase() || 'BASIC'] || 1;

        if (themeTierRank > userTierRank) {
            toast.error(
                `Tema ${packageLevel} hanya tersedia untuk paket ${packageLevel} ke atas. Silakan lakukan upgrade paket.`,
            );
            return;
        }

        setSavingThemeId(themeId);
        try {
            const res = await api.put('/weddings/me/theme', { themeId });
            if (res.data.status === 'success') {
                setWedding((prev: any) => ({ ...prev, themeId }));
                toast.success('Tema undangan berhasil diperbarui!');
            }
        } catch (err) {
            toast.error('Gagal memperbarui tema.');
        } finally {
            setSavingThemeId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <p className="text-sm font-medium text-charcoal/60">
                    Memuat data tema...
                </p>
            </div>
        );
    }

    const userPkg = wedding?.package?.packageName || 'BASIC';
    const userTierRank = TIER_LEVELS[userPkg?.toUpperCase() || 'BASIC'] || 1;
    const previewUrl = `${window.location.origin}/u/${wedding?.slug}`;

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col justify-between gap-4 border-b border-sand/35 pb-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-sans text-3xl font-bold text-charcoal">
                        Pilih Tema Undangan
                    </h2>
                    <p className="mt-1 text-sm text-charcoal/60">
                        Ganti template dan tampilan undangan digital Anda.
                        Desain responsif, modern, dan premium.
                    </p>
                </div>

                {wedding?.slug && (
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="outline"
                            size="md"
                            className="flex items-center gap-2"
                        >
                            <ExternalLink size={16} />
                            <span>Buka Undangan</span>
                        </Button>
                    </a>
                )}
            </div>

            {/* Package Status Banner */}
            {userTierRank === 1 ? (
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 sm:flex-row sm:items-center">
                    <div className="text-sm text-charcoal/80">
                        <p className="font-semibold text-gold-700">
                            Dapatkan Semua Akses Tema Premium!
                        </p>
                        <p className="mt-0.5 text-charcoal/60">
                            Upgrade ke paket PREMIUM atau CUSTOM untuk membuka tema
                            eksklusif lainnya seperti Modern Minimalist.
                        </p>
                    </div>
                    <Link to="/dashboard/billing">
                        <Button
                            variant="primary"
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <span>Upgrade Sekarang</span>
                            <ArrowRight size={14} />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 sm:flex-row sm:items-center">
                    <div className="text-sm text-charcoal/80">
                        <p className="font-semibold text-emerald-800">
                            Paket Aktif: {userPkg}
                        </p>
                        <p className="mt-0.5 text-charcoal/60">
                            Anda memiliki akses penuh ke seluruh tema kategori {userPkg === 'CUSTOM' ? 'Basic, Premium, & Custom' : 'Basic & Premium'}.
                        </p>
                    </div>
                    <Badge variant="success">Tier {userPkg}</Badge>
                </div>
            )}

            {/* Themes Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {themes.map((theme) => {
                    const isSelected = wedding?.themeId === theme.id;
                    const themeTierRank =
                        TIER_LEVELS[theme.packageLevel?.toUpperCase() || 'BASIC'] || 1;
                    const isLocked = themeTierRank > userTierRank;
                    const savingThis = savingThemeId === theme.id;

                    return (
                        <Card
                            key={theme.id}
                            className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all ${
                                isSelected
                                    ? 'border-gold-500 ring-2 ring-gold-500/30'
                                    : isLocked
                                      ? 'border-sand/40 opacity-75'
                                      : 'border-sand hover:border-gold-500'
                            }`}
                        >
                            {/* Theme thumbnail cover (Phone Mockup Pas Tengah) */}
                            <div className="relative flex h-56 sm:h-64 overflow-hidden items-center justify-center bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EAE3D6] p-3 text-center">
                                {isLocked && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-charcoal/20 backdrop-blur-[1px]">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal shadow-lg">
                                            <Lock size={14} className="text-gold-600" />
                                            <span>{theme.packageLevel || 'Premium'} Lock</span>
                                        </div>
                                    </div>
                                )}

                                {theme.thumbnailUrl ? (
                                    <div className="relative h-full aspect-[414/800] overflow-hidden rounded-[16px] border-2 border-neutral-800/85 bg-white shadow-lg transition-transform duration-300 hover:scale-105">
                                        <div className="absolute left-1/2 top-1 z-10 h-1 w-6 -translate-x-1/2 rounded-full bg-neutral-800/50" />
                                        <img
                                            src={theme.thumbnailUrl}
                                            alt={theme.name}
                                            className="h-full w-full object-cover object-top"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-4">
                                        <Palette
                                            className="mb-2 text-gold-500/40"
                                            size={32}
                                        />
                                        <span className="font-sans text-xl font-bold tracking-wide text-gold-800">
                                            {theme.name}
                                        </span>
                                        <span className="mt-1 text-[10px] text-charcoal/40">
                                            Ngaturi Layout
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Theme description details */}
                            <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-sans text-base font-bold text-charcoal">
                                            {theme.name}
                                        </h4>
                                        <Badge
                                            variant={
                                                theme.packageLevel === 'PREMIUM'
                                                    ? 'danger'
                                                    : 'success'
                                            }
                                        >
                                            {theme.packageLevel}
                                        </Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-charcoal/50">
                                        Cocok untuk konsep pernikahan{' '}
                                        {theme.id === 'basic-1'
                                            ? 'minimalis botanical & sage'
                                            : theme.id === 'basic-2'
                                              ? 'bohemian terracotta & warm sunset'
                                              : theme.id === 'basic-3'
                                                ? 'romantis dusty rose & floral blush'
                                                : theme.id === 'basic-4'
                                                  ? 'monokrom editorial & ivory noir'
                                                  : theme.id === 'basic-5'
                                                    ? 'sejuk dusty ocean blue & coastal gold'
                                                    : theme.id === 'basic-6'
                                                      ? 'alami olive earth & chestnut wood'
                                                      : theme.id === 'basic-7'
                                                        ? 'lembut lavender mist & silver lilac'
                                                        : theme.id === 'basic-8'
                                                          ? 'hangat golden sunset & amber'
                                                          : theme.id === 'basic-9'
                                                            ? 'megah royal emerald & gold'
                                                            : theme.id === 'basic-10'
                                                              ? 'teduh zen sakura blossom'
                                                              : theme.id === 'elegant'
                                                                ? 'mewah klasik'
                                                                : theme.id === 'rustic'
                                                                  ? 'natural kayu'
                                                                  : 'minimalis modern'}
                                        .
                                    </p>

                                    {/* Demo URL preview */}
                                    <div className="mt-3 flex items-center justify-between rounded-lg bg-neutral-50 px-2.5 py-1.5 text-[10px] font-mono text-charcoal/60">
                                        <span className="truncate">
                                            /demo/{theme.tierCode || 'b'}/{theme.code || theme.id}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = theme.demoUrl || `https://ngaturi.inxdvi.com/demo/${theme.tierCode || 'b'}/${theme.code || theme.id}`;
                                                navigator.clipboard.writeText(url);
                                                toast.success('Link demo berhasil disalin!');
                                            }}
                                            className="ml-1 cursor-pointer text-gold-600 hover:text-gold-700"
                                            title="Salin link demo"
                                        >
                                            <Copy size={11} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <a
                                        href={`/demo/${theme.tierCode || 'b'}/${theme.code || theme.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-gold-500/40 bg-white px-3 py-2 text-xs font-semibold text-gold-700 shadow-xs hover:bg-gold-500/10 transition"
                                    >
                                        <Eye size={13} />
                                        <span>Demo</span>
                                    </a>

                                    <Button
                                        variant={
                                            isSelected ? 'outline' : 'primary'
                                        }
                                        disabled={isLocked || savingThis}
                                        className="flex flex-1 items-center justify-center gap-1.5 py-2 text-xs"
                                        onClick={() =>
                                            handleSelectTheme(
                                                theme.id,
                                                theme.packageLevel,
                                            )
                                        }
                                    >
                                        {savingThis ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : isSelected ? (
                                            <>
                                                <Check
                                                    size={14}
                                                    className="text-green-600"
                                                />
                                                <span>Aktif</span>
                                            </>
                                        ) : (
                                            'Terapkan Tema'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
Themes.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Themes;
