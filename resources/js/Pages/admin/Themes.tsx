import {
    Edit3,
    Image as ImageIcon,
    Loader2,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

interface Theme {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    isActive: boolean;
    packageLevel: 'BASIC' | 'PREMIUM';
    usersCount: number;
}

export const AdminThemes: React.FC = () => {
    const [themesList, setThemesList] = useState<Theme[]>([]);
    const [loading, setLoading] = useState(true);

    // Drawer / Form state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

    // Form Fields
    const [name, setName] = useState('');
    const [slugId, setSlugId] = useState(''); // theme id (e.g. rustic)
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [packageLevel, setPackageLevel] = useState<'BASIC' | 'PREMIUM'>(
        'BASIC',
    );
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchThemes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/themes');
            setThemesList(response.data.themes);
        } catch (err: any) {
            toast.error('Gagal memuat katalog tema.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThemes();
    }, []);

    const openAddDrawer = () => {
        setEditMode(false);
        setSelectedThemeId(null);
        setName('');
        setSlugId('');
        setThumbnailUrl('');
        setPackageLevel('BASIC');
        setIsActive(true);
        setDrawerOpen(true);
    };

    const openEditDrawer = (theme: Theme) => {
        setEditMode(true);
        setSelectedThemeId(theme.id);
        setName(theme.name);
        setSlugId(theme.id);
        setThumbnailUrl(theme.thumbnailUrl || '');
        setPackageLevel(theme.packageLevel);
        setIsActive(theme.isActive);
        setDrawerOpen(true);
    };

    // Handle Thumbnail File Upload
    const handleThumbnailUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const loadingToast = toast.loading('Mengunggah gambar thumbnail...');
        try {
            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.dismiss(loadingToast);
            toast.success('Thumbnail berhasil diunggah!');
            setThumbnailUrl(response.data.url);
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal mengunggah thumbnail.');
        }
    };

    // Submit Add/Edit Theme Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !slugId) {
            toast.error('Nama dan Slug ID tema wajib diisi.');
            return;
        }

        setSaving(true);
        const payload = {
            id: slugId,
            name,
            thumbnailUrl,
            packageLevel,
            isActive,
        };

        try {
            if (editMode && selectedThemeId) {
                await api.put(`/admin/themes/${selectedThemeId}`, payload);
                toast.success('Tema berhasil diperbarui!');
            } else {
                await api.post('/admin/themes', payload);
                toast.success('Tema baru berhasil ditambahkan!');
            }
            setDrawerOpen(false);
            fetchThemes();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan tema.');
        } finally {
            setSaving(false);
        }
    };

    // Toggle Theme Activation
    const handleToggleActive = async (theme: Theme) => {
        const nextStatus = !theme.isActive;
        try {
            await api.put(`/admin/themes/${theme.id}`, {
                name: theme.name,
                thumbnailUrl: theme.thumbnailUrl,
                packageLevel: theme.packageLevel,
                isActive: nextStatus,
            });
            toast.success(
                `Tema ${theme.name} berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}!`,
            );
            fetchThemes();
        } catch (err: any) {
            toast.error('Gagal memperbarui status tema.');
        }
    };

    // Delete Theme
    const handleDeleteTheme = async (theme: Theme) => {
        if (theme.usersCount > 0) {
            toast.error(
                'Gagal menghapus: Tema masih aktif digunakan oleh customer.',
            );
            return;
        }

        if (!window.confirm(`Hapus tema "${theme.name}" secara permanen?`))
            return;

        try {
            await api.delete(`/admin/themes/${theme.id}`);
            toast.success('Tema berhasil dihapus.');
            fetchThemes();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menghapus tema.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Katalog Tema
                    </h1>
                    <p className="text-sm text-slate-400">
                        Kelola katalog design layout dan package restriction
                        tema
                    </p>
                </div>
                <button
                    onClick={openAddDrawer}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-600"
                >
                    <Plus size={16} />
                    <span>Tambah Tema</span>
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2
                        className="animate-spin text-amber-500"
                        size={32}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {themesList.map((t) => (
                        <div
                            key={t.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                        >
                            {/* Thumbnail Area */}
                            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-slate-800/80 bg-slate-950">
                                {t.thumbnailUrl ? (
                                    <img
                                        src={
                                            t.thumbnailUrl.startsWith('/')
                                                ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${t.thumbnailUrl}`
                                                : t.thumbnailUrl
                                        }
                                        alt={t.name}
                                        className="duration-550 h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-700">
                                        <ImageIcon size={48} />
                                        <span className="text-xs">
                                            No Thumbnail
                                        </span>
                                    </div>
                                )}

                                {/* Package Level Badge */}
                                <span
                                    className={`absolute left-4 top-4 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase shadow-lg ${
                                        t.packageLevel === 'PREMIUM'
                                            ? 'bg-amber-500 text-slate-950'
                                            : 'bg-slate-850 border border-slate-700 text-slate-300'
                                    }`}
                                >
                                    {t.packageLevel}
                                </span>

                                {/* Users Count Badge */}
                                <span className="backdrop-blur-xs absolute bottom-4 right-4 rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                                    {t.usersCount} Pengguna
                                </span>
                            </div>

                            {/* Title & Info */}
                            <div className="flex flex-1 flex-col justify-between space-y-4 p-5">
                                <div>
                                    <h3 className="text-sm font-bold text-white">
                                        {t.name}
                                    </h3>
                                    <p className="font-mono text-xs text-slate-500">
                                        ID: {t.id}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between border-t border-slate-800/60 pt-4">
                                    {/* Status Toggle */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleToggleActive(t)
                                            }
                                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                                t.isActive
                                                    ? 'bg-amber-500'
                                                    : 'bg-slate-800'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                                                    t.isActive
                                                        ? 'translate-x-4'
                                                        : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                        <span className="text-xs text-slate-400">
                                            {t.isActive ? 'Aktif' : 'Draft'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditDrawer(t)}
                                            className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                            title="Edit Tema"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTheme(t)}
                                            className="cursor-pointer rounded-lg bg-red-500/10 p-1.5 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                                            title="Hapus Tema"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Slide-over Drawer for Theme Form */}
            {drawerOpen && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex justify-end bg-slate-950/70">
                    <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                            <h3 className="font-sans text-base font-bold text-white">
                                {editMode
                                    ? 'Edit Tema Undangan'
                                    : 'Tambah Tema Baru'}
                            </h3>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-1 flex-col justify-between overflow-hidden"
                        >
                            <div className="flex-1 space-y-6 overflow-y-auto p-6">
                                {/* Slug ID (non-editable in editMode) */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Slug ID / Unique Key
                                    </label>
                                    <input
                                        type="text"
                                        value={slugId}
                                        disabled={editMode}
                                        onChange={(e) =>
                                            setSlugId(e.target.value)
                                        }
                                        placeholder="e.g. elegant-gold, rustic-blossom"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:bg-slate-900/50 disabled:opacity-50"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-500">
                                        Hanya karakter huruf kecil, angka, dan
                                        garis penghubung (-). Tidak bisa diubah
                                        setelah dibuat.
                                    </p>
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Nama Tema
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. Elegant Gold"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                {/* Package Level */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Tingkat Paket
                                    </label>
                                    <select
                                        value={packageLevel}
                                        onChange={(e) =>
                                            setPackageLevel(
                                                e.target.value as any,
                                            )
                                        }
                                        className="block w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    >
                                        <option value="BASIC">
                                            BASIC (Standard)
                                        </option>
                                        <option value="PREMIUM">
                                            PREMIUM (Exclusive)
                                        </option>
                                    </select>
                                </div>

                                {/* Thumbnail Upload & Preview */}
                                <div className="space-y-2">
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Thumbnail Tema
                                    </label>

                                    {/* File input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailUpload}
                                        className="block w-full cursor-pointer text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-slate-700"
                                    />

                                    {/* Manual URL input */}
                                    <input
                                        type="text"
                                        value={thumbnailUrl}
                                        onChange={(e) =>
                                            setThumbnailUrl(e.target.value)
                                        }
                                        placeholder="Atau tempel URL gambar eksternal..."
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />

                                    {thumbnailUrl && (
                                        <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                                            <img
                                                src={
                                                    thumbnailUrl.startsWith('/')
                                                        ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${thumbnailUrl}`
                                                        : thumbnailUrl
                                                }
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                                    <div>
                                        <span className="block text-xs font-semibold text-slate-300">
                                            Tampilkan ke Katalog
                                        </span>
                                        <span className="block text-[10px] text-slate-500">
                                            Tampilkan pilihan tema di onboarding
                                            user
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsActive(!isActive)}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                            isActive
                                                ? 'bg-amber-500'
                                                : 'bg-slate-850'
                                        }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow-sm ring-0 transition duration-200 ${
                                                isActive
                                                    ? 'translate-x-4'
                                                    : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 border-t border-slate-800 bg-slate-950/20 p-6">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-600"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan Tema'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    className="border-slate-800 bg-slate-950 py-2.5 text-xs text-slate-400"
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminThemes;
