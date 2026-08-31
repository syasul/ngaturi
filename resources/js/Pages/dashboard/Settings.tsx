import {
    ArrowRight,
    CheckCircle,
    Eye,
    Globe,
    Loader2,
    Lock,
    Music,
    Volume2,
    XCircle,
    Play,
    Pause,
    Upload,
    X,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Settings: React.FC = () => {
    const [wedding, setWedding] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [savingSlug, setSavingSlug] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [uploadingMusic, setUploadingMusic] = useState(false);

    // States for enhanced music selection
    const [libraryMusic, setLibraryMusic] = useState<any[]>([]);
    const [previewPlayingUrl, setPreviewPlayingUrl] = useState<string | null>(null);
    const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);
    const [isDragOverMusic, setIsDragOverMusic] = useState(false);
    const [showAdvancedMusic, setShowAdvancedMusic] = useState(false);

    // Slug check states
    const [slugInput, setSlugInput] = useState('');
    const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(
        null,
    );
    const [checkingSlug, setCheckingSlug] = useState(false);

    const loadWedding = async () => {
        try {
            const res = await api.get('/weddings/me');
            if (res.data.status === 'success' && res.data.wedding) {
                const w = res.data.wedding;
                setWedding(w);
                setSlugInput(w.slug);
            }
        } catch (err) {
            toast.error('Gagal memuat pengaturan undangan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMusic = async () => {
            try {
                const res = await api.get('/api/music');
                if (res.data.status === 'success' && res.data.music) {
                    setLibraryMusic(res.data.music);
                }
            } catch (err) {
                console.error('Gagal memuat pustaka musik:', err);
            }
        };

        loadWedding();
        fetchMusic();

        return () => {
            if (audioInstance) {
                audioInstance.pause();
            }
        };
    }, []);

    // Cleanup audio on component transition/unmount
    useEffect(() => {
        return () => {
            if (audioInstance) {
                audioInstance.pause();
            }
        };
    }, [audioInstance]);

    const handleTogglePreview = (url: string) => {
        if (!url) return;
        const fullUrl = url.startsWith('/')
            ? `${window.location.origin}${url}`
            : url;

        if (previewPlayingUrl === url) {
            if (audioInstance) {
                audioInstance.pause();
            }
            setPreviewPlayingUrl(null);
        } else {
            if (audioInstance) {
                audioInstance.pause();
            }
            const newAudio = new Audio(fullUrl);
            newAudio.play().catch((err) => {
                toast.error('Gagal memutar audio pratinjau.');
            });
            newAudio.onended = () => {
                setPreviewPlayingUrl(null);
            };
            setAudioInstance(newAudio);
            setPreviewPlayingUrl(url);
        }
    };

    // Check Slug availability
    const checkSlugAvailability = async () => {
        if (!slugInput.trim() || slugInput.toLowerCase() === wedding?.slug) {
            setIsSlugAvailable(null);
            return;
        }

        setCheckingSlug(true);
        try {
            const res = await api.get(`/weddings/check-slug/${slugInput}`);
            if (res.data.status === 'success') {
                setIsSlugAvailable(res.data.available);
            }
        } catch (err) {
            setIsSlugAvailable(false);
        } finally {
            setCheckingSlug(false);
        }
    };

    // Update slug
    const handleUpdateSlug = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slugInput.trim() || slugInput.toLowerCase() === wedding?.slug)
            return;

        setSavingSlug(true);
        try {
            const res = await api.put('/weddings/me/slug', { slug: slugInput });
            if (res.data.status === 'success') {
                setWedding((prev: any) => ({
                    ...prev,
                    slug: res.data.wedding.slug,
                }));
                setIsSlugAvailable(null);
                toast.success('URL Undangan berhasil diubah!');
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message || 'Gagal mengubah URL Undangan.';
            toast.error(msg);
        } finally {
            setSavingSlug(false);
        }
    };

    // Toggle Publish / Draft status
    const handleTogglePublish = async () => {
        const targetStatus =
            wedding?.status === 'published' ? 'draft' : 'published';
        setSavingStatus(true);
        try {
            const res = await api.put('/weddings/me/status', {
                status: targetStatus,
            });
            if (res.data.status === 'success') {
                setWedding((prev: any) => ({ ...prev, status: targetStatus }));
                toast.success(
                    targetStatus === 'published'
                        ? 'Undangan berhasil diterbitkan dan aktif!'
                        : 'Undangan diubah ke draft (tidak dapat diakses publik).',
                );
            }
        } catch (err) {
            toast.error('Gagal memperbarui status publikasi.');
        } finally {
            setSavingStatus(false);
        }
    };

    // Handle Music Upload
    const handleMusicUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const userPkg = wedding?.package?.packageName || 'BASIC';
        if (userPkg !== 'PREMIUM') {
            toast.error(
                'Fitur backsound audio musik kustom hanya tersedia untuk paket PREMIUM.',
            );
            return;
        }

        setUploadingMusic(true);
        const toastId = toast.loading('Mengunggah file musik...');
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await api.post('/media/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.status === 'success') {
                // Save music URL inside wedding.data
                const updatedData = {
                    ...wedding.data,
                    musicUrl: res.data.url,
                };

                const saveRes = await api.put('/weddings/me', {
                    data: updatedData,
                });
                if (saveRes.data.status === 'success') {
                    setWedding((prev: any) => ({ ...prev, data: updatedData }));
                    toast.success('Backsound audio berhasil diunggah!', {
                        id: toastId,
                    });
                }
            }
        } catch (err) {
            toast.error('Gagal mengunggah file musik.', { id: toastId });
        } finally {
            setUploadingMusic(false);
        }
    };

    // Handle Delete Music
    const handleDeleteMusic = async () => {
        if (!window.confirm('Hapus backsound musik undangan?')) return;
        try {
            const updatedData = {
                ...wedding.data,
                musicUrl: null,
            };
            const res = await api.put('/weddings/me', { data: updatedData });
            if (res.data.status === 'success') {
                setWedding((prev: any) => ({ ...prev, data: updatedData }));
                toast.success('Backsound musik berhasil dihapus.');
            }
        } catch (err) {
            toast.error('Gagal menghapus musik.');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <p className="text-sm font-medium text-charcoal/60">
                    Memuat data pengaturan...
                </p>
            </div>
        );
    }

    const userPkg = wedding?.package?.packageName || 'BASIC';
    const isPremium = userPkg === 'PREMIUM';
    const invitationUrl = `${window.location.origin}/u/${wedding?.slug}`;

    return (
        <div className="mx-auto max-w-3xl space-y-6 font-sans">
            <div className="border-b border-sand/35 pb-4">
                <h2 className="font-sans text-3xl font-bold text-charcoal">
                    Pengaturan Undangan
                </h2>
                <p className="mt-1 text-sm text-charcoal/60">
                    Kelola tautan slug URL kustom, status penerbitan undangan,
                    dan backsound audio musik.
                </p>
            </div>

            {/* 1. Status Publikasi Panel */}
            <Card className="space-y-4 rounded-3xl border border-sand/45 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-sans text-lg font-bold text-charcoal">
                    <Eye className="text-gold-500" size={18} />
                    <span>Status Publikasi</span>
                </h3>
                <p className="text-xs leading-relaxed text-charcoal/60">
                    Aktifkan status publikasi agar tamu undangan dapat melihat
                    undangan Anda. Jika diubah menjadi draft, undangan Anda
                    tidak akan bisa diakses sementara waktu.
                </p>

                <div className="flex items-center justify-between rounded-2xl border border-sand/30 bg-cream/15 p-4">
                    <div>
                        <span className="block text-xs font-semibold text-charcoal/70">
                            Status saat ini:
                        </span>
                        <span
                            className={`mt-1 inline-block text-sm font-bold uppercase tracking-wider ${
                                wedding?.status === 'published'
                                    ? 'text-green-600'
                                    : 'text-amber-500'
                            }`}
                        >
                            {wedding?.status === 'published'
                                ? 'Published / Aktif'
                                : 'Draft / Non-aktif'}
                        </span>
                    </div>

                    <Button
                        variant="primary"
                        disabled={savingStatus}
                        onClick={handleTogglePublish}
                    >
                        {savingStatus ? (
                            <Loader2 className="animate-spin" size={14} />
                        ) : wedding?.status === 'published' ? (
                            'Ubah ke Draft'
                        ) : (
                            'Terbitkan Sekarang'
                        )}
                    </Button>
                </div>
            </Card>

            {/* 2. Custom Link / Slug Panel */}
            <Card className="space-y-4 rounded-3xl border border-sand/45 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-2 font-sans text-lg font-bold text-charcoal">
                    <Globe className="text-gold-500" size={18} />
                    <span>Kustom URL Undangan (Slug)</span>
                </h3>
                <p className="text-xs leading-relaxed text-charcoal/60">
                    Ganti tautan akhir URL undangan Anda. Link harus unik dan
                    hanya mengandung huruf, angka, dan tanda strip (-).
                </p>

                <form onSubmit={handleUpdateSlug} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="border-r border-sand pr-3 text-sm text-charcoal/50">
                            ngaturi.id/u/
                        </span>
                        <input
                            type="text"
                            value={slugInput}
                            onChange={(e) => {
                                setSlugInput(
                                    e.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9-]/g, ''),
                                );
                                setIsSlugAvailable(null);
                            }}
                            placeholder="tautan-kustom"
                            className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                        />
                        <Button
                            variant="outline"
                            type="button"
                            disabled={
                                checkingSlug || slugInput === wedding?.slug
                            }
                            onClick={checkSlugAvailability}
                        >
                            {checkingSlug ? (
                                <Loader2 className="animate-spin" size={14} />
                            ) : (
                                'Cek'
                            )}
                        </Button>
                    </div>

                    {/* Availability response */}
                    {isSlugAvailable !== null && (
                        <div className="flex items-center gap-1.5 text-xs">
                            {isSlugAvailable ? (
                                <>
                                    <CheckCircle
                                        className="text-green-600"
                                        size={14}
                                    />
                                    <span className="font-semibold text-green-600">
                                        Tautan kustom tersedia!
                                    </span>
                                </>
                            ) : (
                                <>
                                    <XCircle
                                        className="text-red-500"
                                        size={14}
                                    />
                                    <span className="font-semibold text-red-500">
                                        Tautan sudah digunakan oleh pengguna
                                        lain.
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-sand/20 pt-2 text-xs">
                        <a
                            href={invitationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-semibold text-gold-600 hover:underline"
                        >
                            <span>{invitationUrl}</span>
                        </a>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={
                                savingSlug ||
                                isSlugAvailable === false ||
                                slugInput === wedding?.slug
                            }
                        >
                            {savingSlug ? (
                                <Loader2 className="animate-spin" size={14} />
                            ) : (
                                'Ubah URL'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* 3. Custom Music Backsound Panel */}
            <Card className="space-y-4 rounded-3xl border border-sand/45 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-sand/20 pb-3">
                    <h3 className="flex items-center gap-2 font-sans text-lg font-bold text-charcoal">
                        <Music className="text-gold-500" size={18} />
                        <span>Musik Latar Belakang (Backsound)</span>
                    </h3>
                    {!isPremium && (
                        <span className="flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-600">
                            <Lock size={10} />
                            <span>Premium</span>
                        </span>
                    )}
                </div>

                <p className="text-xs leading-relaxed text-charcoal/60">
                    Unggah file MP3 atau pilih lagu dari pustaka untuk diputar otomatis ketika tamu membuka
                    undangan digital pernikahan Anda.
                </p>

                {isPremium ? (
                    <div className="space-y-4">
                        {/* 1. Dropdown Preset Music Library */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-charcoal/60">
                                Pilih dari Pustaka Musik Bawaan
                            </label>
                            <select
                                value={
                                    libraryMusic.some(m => m.url === wedding?.data?.musicUrl)
                                        ? wedding?.data?.musicUrl
                                        : ''
                                }
                                onChange={async (e) => {
                                    const selectedUrl = e.target.value;
                                    const updatedData = {
                                        ...wedding.data,
                                        musicUrl: selectedUrl || null,
                                    };
                                    try {
                                        const res = await api.put('/weddings/me', { data: updatedData });
                                        if (res.data.status === 'success') {
                                            setWedding((prev: any) => ({ ...prev, data: updatedData }));
                                            toast.success('Musik latar belakang berhasil diubah!');
                                        }
                                    } catch (err) {
                                        toast.error('Gagal memperbarui musik latar belakang.');
                                    }
                                }}
                                className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                            >
                                <option value="">-- Gunakan musik kustom atau tanpa musik --</option>
                                {libraryMusic.map((track) => (
                                    <option key={track.id} value={track.url}>
                                        {track.title} - {track.artist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Drag & Drop Custom Music Upload */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-charcoal/60">
                                Atau Unggah File Musik Kustom Anda
                            </label>

                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOverMusic(true);
                                }}
                                onDragLeave={() => setIsDragOverMusic(false)}
                                onDrop={async (e) => {
                                    e.preventDefault();
                                    setIsDragOverMusic(false);
                                    const file = e.dataTransfer.files?.[0];
                                    if (!file) return;

                                    // Validate file type
                                    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3')) {
                                        toast.error('Format file tidak didukung. Hanya menerima file .mp3.');
                                        return;
                                    }

                                    setUploadingMusic(true);
                                    const toastId = toast.loading('Mengunggah file musik...');
                                    const data = new FormData();
                                    data.append('file', file);
                                    try {
                                        const res = await api.post('/media/upload', data, {
                                            headers: { 'Content-Type': 'multipart/form-data' },
                                        });
                                        if (res.data.status === 'success') {
                                            const updatedData = {
                                                ...wedding.data,
                                                musicUrl: res.data.url,
                                            };
                                            const saveRes = await api.put('/weddings/me', { data: updatedData });
                                            if (saveRes.data.status === 'success') {
                                                setWedding((prev: any) => ({ ...prev, data: updatedData }));
                                                toast.success('Musik kustom berhasil diunggah!', { id: toastId });
                                            }
                                        }
                                    } catch (err) {
                                        toast.error('Gagal mengunggah file musik.', { id: toastId });
                                    } finally {
                                        setUploadingMusic(false);
                                    }
                                }}
                                className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                                    isDragOverMusic
                                        ? 'border-gold-500 bg-gold-500/5'
                                        : 'border-sand/75 bg-cream/5 hover:border-gold-500'
                                }`}
                            >
                                {uploadingMusic ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
                                ) : (
                                    <>
                                        <Upload
                                            className={`h-6 w-6 transition-colors ${
                                                isDragOverMusic ? 'text-gold-500' : 'text-charcoal/30 group-hover:text-gold-500'
                                            }`}
                                        />
                                        <p className="mt-2 text-xs font-semibold text-charcoal/70">
                                            Seret & letakkan file musik (.mp3) ke sini, atau klik untuk memilih file.
                                        </p>
                                        <p className="mt-1 text-[10px] text-charcoal/40">
                                            Maksimal ukuran file: 5MB. format .mp3 saja.
                                        </p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="audio/mp3,audio/mpeg"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    onChange={handleMusicUpload}
                                    disabled={uploadingMusic}
                                />
                            </div>
                        </div>

                        {/* 3. Active Music Preview Player */}
                        {wedding?.data?.musicUrl && (
                            <div className="flex flex-col gap-2 rounded-2xl border border-sand/40 bg-cream/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleTogglePreview(wedding.data.musicUrl)}
                                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                                            previewPlayingUrl === wedding.data.musicUrl
                                                ? 'bg-gold-500 text-white'
                                                : 'bg-sand/30 text-charcoal hover:bg-gold-500 hover:text-white'
                                        }`}
                                    >
                                        {previewPlayingUrl === wedding.data.musicUrl ? (
                                            <Pause size={14} fill="currentColor" />
                                        ) : (
                                            <Play size={14} className="ml-0.5" fill="currentColor" />
                                        )}
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <Volume2 size={14} className="text-gold-600" />
                                            <span className="text-xs font-bold text-charcoal/80">
                                                Musik Terpasang
                                            </span>
                                        </div>
                                        <span className="block truncate text-xs text-charcoal/50 font-mono">
                                            {wedding.data.musicUrl}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDeleteMusic}
                                    className="flex items-center gap-1 self-start rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 sm:self-center"
                                >
                                    <X size={12} />
                                    <span>Hapus Musik</span>
                                </button>
                            </div>
                        )}

                        {/* 4. Advanced Options (URL Input) */}
                        <div className="border-t border-sand/15 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAdvancedMusic(!showAdvancedMusic)}
                                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-charcoal/45 hover:text-charcoal/70"
                            >
                                {showAdvancedMusic ? (
                                    <>
                                        <ChevronUp size={12} />
                                        <span>Sembunyikan Opsi Lanjutan (URL)</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown size={12} />
                                        <span>Tampilkan Opsi Lanjutan (URL)</span>
                                    </>
                                )}
                            </button>

                            {showAdvancedMusic && (
                                <div className="mt-3 space-y-2 rounded-xl bg-charcoal/[0.02] p-3 border border-sand/30">
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/60">
                                        Link URL Musik Langsung (MP3 / Direct Link)
                                    </label>
                                    <input
                                        type="text"
                                        value={wedding?.data?.musicUrl || ''}
                                        onChange={async (e) => {
                                            const val = e.target.value;
                                            const updatedData = {
                                                ...wedding.data,
                                                musicUrl: val || null,
                                            };
                                            setWedding((prev: any) => ({ ...prev, data: updatedData }));
                                        }}
                                        onBlur={async () => {
                                            try {
                                                await api.put('/weddings/me', { data: wedding.data });
                                                toast.success('Link URL musik berhasil disimpan!');
                                            } catch (err) {
                                                toast.error('Gagal menyimpan link musik.');
                                            }
                                        }}
                                        placeholder="Contoh: https://domain.com/music/backsound.mp3"
                                        className="w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                    />
                                    <p className="text-[9px] text-charcoal/40 leading-relaxed">
                                        Gunakan opsi ini jika Anda ingin menempelkan link musik MP3 eksternal secara langsung tanpa mengunggah file.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 rounded-2xl border border-sand/35 bg-sand/10 p-6 text-center">
                        <Lock className="mx-auto text-charcoal/30" size={24} />
                        <p className="text-xs text-charcoal/60">
                            Fitur backsound audio musik kustom dikunci. Upgrade
                            ke paket premium untuk mengaktifkan musik latar
                            belakang.
                        </p>
                        <Link to="/dashboard/billing" className="inline-block">
                            <Button
                                variant="primary"
                                size="sm"
                                className="mx-auto flex items-center gap-1.5"
                            >
                                <span>Upgrade Sekarang</span>
                                <ArrowRight size={14} />
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
};

Settings.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Settings;
