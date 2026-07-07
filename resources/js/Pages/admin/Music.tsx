import {
    Edit3,
    Loader2,
    Music as MusicIcon,
    Pause,
    Play,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

interface MusicTrack {
    id: string;
    title: string;
    artist: string;
    url: string;
    isActive: boolean;
    createdAt: string;
}

export const AdminMusic: React.FC = () => {
    const [musicList, setMusicList] = useState<MusicTrack[]>([]);
    const [loading, setLoading] = useState(true);

    // Audio Player State
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
        null,
    );

    // Drawer / Form State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    // Form Fields
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [musicUrl, setMusicUrl] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchMusic = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/music');
            setMusicList(response.data.music);
        } catch (err: any) {
            toast.error('Gagal mengambil daftar musik.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMusic();
    }, []);

    // Audio Playback Controller
    const handlePlayPause = (track: MusicTrack) => {
        const fullUrl = track.url.startsWith('/')
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${track.url}`
            : track.url;

        if (playingTrackId === track.id) {
            if (audioElement) {
                audioElement.pause();
            }
            setPlayingTrackId(null);
        } else {
            if (audioElement) {
                audioElement.pause();
            }
            const newAudio = new Audio(fullUrl);
            newAudio.play().catch(() => toast.error('Gagal memutar audio.'));
            newAudio.onended = () => setPlayingTrackId(null);

            setAudioElement(newAudio);
            setPlayingTrackId(track.id);
        }
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioElement) {
                audioElement.pause();
            }
        };
    }, [audioElement]);

    const openAddDrawer = () => {
        setEditMode(false);
        setSelectedTrackId(null);
        setTitle('');
        setArtist('');
        setMusicUrl('');
        setIsActive(true);
        setDrawerOpen(true);
    };

    const openEditDrawer = (track: MusicTrack) => {
        setEditMode(true);
        setSelectedTrackId(track.id);
        setTitle(track.title);
        setArtist(track.artist);
        setMusicUrl(track.url);
        setIsActive(track.isActive);
        setDrawerOpen(true);
    };

    // Handle Music Upload (MP3, max 10MB)
    const handleMusicUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error(
                'File terlalu besar! Maksimal ukuran audio adalah 10MB.',
            );
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const loadingToast = toast.loading('Mengunggah file MP3...');
        try {
            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.dismiss(loadingToast);
            toast.success('File audio berhasil diunggah!');
            setMusicUrl(response.data.url);

            // Auto-populate Title/Artist from filename as helper
            const cleanName = file.name.replace(/\.[^/.]+$/, '').split('-');
            if (cleanName.length > 1) {
                setArtist(cleanName[0].trim());
                setTitle(cleanName[1].trim());
            } else {
                setTitle(cleanName[0].trim());
            }
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error('Gagal mengunggah file audio.');
        }
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !artist || !musicUrl) {
            toast.error('Judul, artis, dan file musik wajib diisi.');
            return;
        }

        setSaving(true);
        const payload = {
            title,
            artist,
            url: musicUrl,
            isActive,
        };

        try {
            if (editMode && selectedTrackId) {
                await api.put(`/admin/music/${selectedTrackId}`, payload);
                toast.success('Metadata musik berhasil disimpan!');
            } else {
                await api.post('/admin/music', payload);
                toast.success('Musik berhasil ditambahkan ke pustaka!');
            }
            setDrawerOpen(false);
            fetchMusic();
        } catch (err: any) {
            toast.error('Gagal menyimpan musik.');
        } finally {
            setSaving(false);
        }
    };

    // Toggle Active
    const handleToggleActive = async (track: MusicTrack) => {
        const nextStatus = !track.isActive;
        try {
            await api.put(`/admin/music/${track.id}`, {
                title: track.title,
                artist: track.artist,
                isActive: nextStatus,
            });
            toast.success(
                `Musik ${track.title} berhasil ${nextStatus ? 'diaktifkan' : 'dinonaktifkan'}!`,
            );
            fetchMusic();
        } catch (err: any) {
            toast.error('Gagal memperbarui status musik.');
        }
    };

    // Delete Music
    const handleDeleteMusic = async (id: string) => {
        if (!window.confirm('Hapus musik ini dari pustaka secara permanen?'))
            return;
        try {
            await api.delete(`/admin/music/${id}`);
            toast.success('Musik berhasil dihapus.');
            if (playingTrackId === id) {
                if (audioElement) audioElement.pause();
                setPlayingTrackId(null);
            }
            fetchMusic();
        } catch (err: any) {
            toast.error('Gagal menghapus musik.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Pustaka Musik
                    </h1>
                    <p className="text-sm text-slate-400">
                        Kelola musik/backsound bawaan yang dapat dipilih oleh
                        customer
                    </p>
                </div>
                <button
                    onClick={openAddDrawer}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-600"
                >
                    <Plus size={16} />
                    <span>Upload Musik</span>
                </button>
            </div>

            {/* Music Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2
                            className="animate-spin text-amber-500"
                            size={32}
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/20 text-slate-400">
                                    <th className="w-16 px-6 py-4 font-semibold">
                                        Preview
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Judul Lagu
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Artis
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 font-semibold">
                                        File Path / URL
                                    </th>
                                    <th className="px-6 py-4 text-right font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {musicList.length > 0 ? (
                                    musicList.map((m) => (
                                        <tr
                                            key={m.id}
                                            className="hover:bg-slate-800/10"
                                        >
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        handlePlayPause(m)
                                                    }
                                                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all ${
                                                        playingTrackId === m.id
                                                            ? 'bg-amber-500 text-slate-950'
                                                            : 'text-slate-350 bg-slate-800 hover:bg-slate-700 hover:text-white'
                                                    }`}
                                                >
                                                    {playingTrackId === m.id ? (
                                                        <Pause
                                                            size={14}
                                                            fill="currentColor"
                                                        />
                                                    ) : (
                                                        <Play
                                                            size={14}
                                                            className="ml-0.5"
                                                            fill="currentColor"
                                                        />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-200">
                                                {m.title}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {m.artist}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                        m.isActive
                                                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                                                            : 'border border-slate-700 bg-slate-800 text-slate-400'
                                                    }`}
                                                >
                                                    {m.isActive
                                                        ? 'Aktif'
                                                        : 'Draft'}
                                                </span>
                                            </td>
                                            <td className="max-w-[200px] truncate px-6 py-4 font-mono text-slate-500">
                                                {m.url}
                                            </td>
                                            <td className="space-x-2 px-6 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(m)
                                                    }
                                                    className={`cursor-pointer rounded-lg p-1.5 transition-all ${
                                                        m.isActive
                                                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                                    title={
                                                        m.isActive
                                                            ? 'Nonaktifkan'
                                                            : 'Aktifkan'
                                                    }
                                                >
                                                    <MusicIcon size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEditDrawer(m)
                                                    }
                                                    className="cursor-pointer rounded-lg bg-slate-800 p-1.5 text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                                                    title="Edit Metadata"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteMusic(m.id)
                                                    }
                                                    className="cursor-pointer rounded-lg bg-red-500/10 p-1.5 text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300"
                                                    title="Hapus Musik"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-slate-500"
                                        >
                                            Pustaka musik masih kosong.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Drawer Form for Music */}
            {drawerOpen && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex justify-end bg-slate-950/70">
                    <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                            <h3 className="font-sans text-base font-bold text-white">
                                {editMode
                                    ? 'Edit Metadata Musik'
                                    : 'Upload Musik Baru'}
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
                                {/* Upload File (Only when adding new track) */}
                                {!editMode && (
                                    <div className="space-y-2">
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            File Audio MP3 (Maksimal 10MB)
                                        </label>
                                        <input
                                            type="file"
                                            accept="audio/mpeg, audio/mp3"
                                            onChange={handleMusicUpload}
                                            className="block w-full cursor-pointer text-xs text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-200 hover:file:bg-slate-700"
                                        />
                                    </div>
                                )}

                                {/* File URL (read-only if uploaded, input editable otherwise) */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        File Path / Audio URL
                                    </label>
                                    <input
                                        type="text"
                                        value={musicUrl}
                                        onChange={(e) =>
                                            setMusicUrl(e.target.value)
                                        }
                                        placeholder="URL musik (e.g. /uploads/song.mp3)"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Judul Lagu
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        placeholder="e.g. A Thousand Years"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                {/* Artist */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Artis / Penyanyi
                                    </label>
                                    <input
                                        type="text"
                                        value={artist}
                                        onChange={(e) =>
                                            setArtist(e.target.value)
                                        }
                                        placeholder="e.g. Christina Perri"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                                    <div>
                                        <span className="text-slate-350 block text-xs font-semibold">
                                            Status Musik
                                        </span>
                                        <span className="block text-[10px] text-slate-500">
                                            Tampilkan pilihan ini ke dashboard
                                            customer
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
                                    {saving ? 'Menyimpan...' : 'Simpan Musik'}
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

export default AdminMusic;
