import { ArrowRight, Check, ExternalLink, Lock, Palette } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

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

        if (packageLevel === 'PREMIUM' && userPkg !== 'PREMIUM') {
            toast.error(
                'Tema Premium hanya tersedia untuk paket PREMIUM. Silakan lakukan upgrade paket.',
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

            {/* Package Alert if Basic */}
            {userPkg !== 'PREMIUM' && (
                <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold-500/20 bg-gold-500/10 p-4 sm:flex-row sm:items-center">
                    <div className="text-sm text-charcoal/80">
                        <p className="font-semibold text-gold-700">
                            Dapatkan Semua Akses Tema Premium!
                        </p>
                        <p className="mt-0.5 text-charcoal/60">
                            Upgrade ke paket PREMIUM untuk membuka tema
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
            )}

            {/* Themes Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {themes.map((theme) => {
                    const isSelected = wedding?.themeId === theme.id;
                    const isLocked =
                        theme.packageLevel === 'PREMIUM' &&
                        userPkg !== 'PREMIUM';
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
                            {/* Mock theme thumbnail cover */}
                            <div className="relative flex h-44 flex-col items-center justify-center bg-sand/20 p-4 text-center">
                                {isLocked && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-charcoal/15">
                                        <div className="flex items-center gap-1.5 rounded-full bg-white/95 p-3 text-xs font-semibold text-charcoal shadow-lg">
                                            <Lock size={14} />
                                            <span>Premium Lock</span>
                                        </div>
                                    </div>
                                )}

                                <Palette
                                    className="mb-2 text-gold-500/40"
                                    size={32}
                                />
                                <span className="font-sans text-xl font-bold tracking-wide text-gold-800">
                                    {theme.name}
                                </span>
                                <span className="mt-1 text-[10px] text-charcoal/40">
                                    Ngaturi Premium Layout
                                </span>
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
                                        {theme.id === 'elegant'
                                            ? 'mewah klasik'
                                            : theme.id === 'rustic'
                                              ? 'natural kayu'
                                              : 'minimalis modern'}
                                        .
                                    </p>
                                </div>

                                <div className="flex gap-2">
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
