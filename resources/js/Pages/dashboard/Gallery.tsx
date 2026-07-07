import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Loader2,
    Lock,
    Trash2,
    Upload,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Gallery: React.FC = () => {
    const [wedding, setWedding] = useState<any>(null);
    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const loadData = async () => {
        try {
            const res = await api.get('/weddings/me');
            if (res.data.status === 'success' && res.data.wedding) {
                setWedding(res.data.wedding);
                setPhotos(res.data.wedding.photos || []);
            }
        } catch (err) {
            toast.error('Gagal memuat data galeri.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const userPkg = wedding?.package?.packageName || 'BASIC';
    const maxLimit = userPkg === 'PREMIUM' ? 20 : 5;
    const countRemaining = maxLimit - photos.length;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (photos.length >= maxLimit) {
            toast.error(
                `Batas unggah foto terlampaui. Upgrade ke PREMIUM untuk mengunggah hingga 20 foto.`,
            );
            return;
        }

        setUploading(true);
        const toastId = toast.loading('Mengunggah dan mengompresi foto...');
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await api.post('/media/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.status === 'success') {
                toast.success('Foto berhasil ditambahkan ke galeri!', {
                    id: toastId,
                });
                loadData(); // Reload photos
            }
        } catch (err) {
            toast.error('Gagal mengunggah foto.', { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (photoId: string) => {
        try {
            const res = await api.delete(`/media/photos/${photoId}`);
            if (res.data.status === 'success') {
                setPhotos(photos.filter((p) => p.id !== photoId));
                toast.success('Foto berhasil dihapus.');
            }
        } catch (err) {
            toast.error('Gagal menghapus foto.');
        }
    };

    const handleMove = async (index: number, direction: 'left' | 'right') => {
        const targetIndex = direction === 'left' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= photos.length) return;

        const newPhotos = [...photos];
        const temp = newPhotos[index];
        newPhotos[index] = newPhotos[targetIndex];
        newPhotos[targetIndex] = temp;

        setPhotos(newPhotos);

        try {
            await api.post('/media/photos/sort', {
                photoIds: newPhotos.map((p) => p.id),
            });
        } catch (err) {
            toast.error('Gagal menyimpan urutan foto.');
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <p className="text-sm font-medium text-charcoal/60">
                    Memuat data media...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 font-sans">
            <div className="border-b border-sand/35 pb-4">
                <h2 className="font-sans text-3xl font-bold text-charcoal">
                    Galeri & Media Foto
                </h2>
                <p className="mt-1 text-sm text-charcoal/60">
                    Unggah foto kenangan Anda bersama pasangan. Foto akan
                    ditampilkan di gallery slide undangan online.
                </p>
            </div>

            {/* Package Info Alert */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-sand/40 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <div className="text-sm text-charcoal/80">
                    <p className="font-semibold text-charcoal">
                        Paket Anda:{' '}
                        <span className="font-bold text-gold-600">
                            {userPkg}
                        </span>
                    </p>
                    <p className="mt-0.5 text-charcoal/50">
                        Telah terunggah{' '}
                        <span className="font-bold">{photos.length}</span> dari
                        maksimal <span className="font-bold">{maxLimit}</span>{' '}
                        foto.
                    </p>
                </div>

                {userPkg !== 'PREMIUM' && (
                    <Link to="/dashboard/billing">
                        <Button
                            variant="primary"
                            size="sm"
                            className="flex items-center gap-1.5"
                        >
                            <span>Upgrade to Premium (20 Photos)</span>
                            <ArrowRight size={14} />
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Upload Box */}
                <div className="lg:col-span-1">
                    {photos.length >= maxLimit ? (
                        <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-sand bg-sand/10 p-6 text-center text-xs text-charcoal/50">
                            <Lock className="mb-2 text-charcoal/30" size={24} />
                            <p>Batas maksimal foto tercapai.</p>
                            <p className="mt-1">
                                Hapus foto lama untuk mengunggah baru.
                            </p>
                        </div>
                    ) : (
                        <label className="group flex h-48 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sand/75 bg-white p-6 transition-colors hover:border-gold-500">
                            {uploading ? (
                                <Loader2
                                    className="animate-spin text-gold-500"
                                    size={32}
                                />
                            ) : (
                                <>
                                    <Upload
                                        className="text-charcoal/30 transition-colors group-hover:text-gold-500"
                                        size={32}
                                    />
                                    <p className="mt-3 text-xs font-semibold text-charcoal/60 transition-colors group-hover:text-gold-500">
                                        Unggah Foto Galeri
                                    </p>
                                    <p className="mt-1 text-[10px] text-charcoal/40">
                                        Maks. 800KB (JPEG/PNG/WEBP)
                                    </p>
                                    <p className="mt-2 text-[10px] font-bold text-gold-600">
                                        Sisa Kuota: {countRemaining}
                                    </p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                disabled={uploading}
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>
                    )}
                </div>

                {/* Photos list */}
                <div className="lg:col-span-3">
                    {photos.length === 0 ? (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-sand/40 bg-white p-12 text-center text-sm text-charcoal/40">
                            <ImageIcon
                                className="mb-2 text-charcoal/20"
                                size={32}
                            />
                            <p>Galeri foto Anda masih kosong.</p>
                            <p className="mt-1 text-xs text-charcoal/30">
                                Unggah foto pertama Anda untuk ditampilkan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sand bg-white shadow-sm"
                                >
                                    <div className="h-32 overflow-hidden bg-sand/15">
                                        <img
                                            src={photo.url}
                                            alt={`Gallery ${index}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Actions overlay */}
                                    <div className="flex items-center justify-between border-t border-sand/40 bg-cream/10 p-2">
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() =>
                                                    handleMove(index, 'left')
                                                }
                                                disabled={index === 0}
                                                className="cursor-pointer rounded border border-sand bg-white p-1 text-charcoal/70 hover:bg-cream/40 disabled:opacity-30"
                                            >
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleMove(index, 'right')
                                                }
                                                disabled={
                                                    index === photos.length - 1
                                                }
                                                className="cursor-pointer rounded border border-sand bg-white p-1 text-charcoal/70 hover:bg-cream/40 disabled:opacity-30"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDelete(photo.id)
                                            }
                                            className="cursor-pointer rounded border border-red-200 bg-red-50 p-1 text-red-600 hover:bg-red-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Order indicator */}
                                    <div className="absolute left-2 top-2 rounded bg-charcoal/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

Gallery.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Gallery;
