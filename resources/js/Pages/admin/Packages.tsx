import { CheckCircle2, Edit3, Loader2, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

interface Package {
    id: string;
    name: string;
    price: number;
    features: string[];
    maxGuests: number;
    durationDays: number;
    createdAt: string;
}

export const AdminPackages: React.FC = () => {
    const [packagesList, setPackagesList] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    // Drawer / Form state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);

    // Form Fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [features, setFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState('');
    const [maxGuests, setMaxGuests] = useState<number>(100);
    const [durationDays, setDurationDays] = useState<number>(90);
    const [saving, setSaving] = useState(false);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/packages');
            setPackagesList(response.data.packages);
        } catch (err: any) {
            toast.error('Gagal mengambil daftar paket.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const openAddDrawer = () => {
        setEditMode(false);
        setSelectedPkgId(null);
        setName('');
        setPrice(100000);
        setFeatures([]);
        setFeatureInput('');
        setMaxGuests(100);
        setDurationDays(90);
        setDrawerOpen(true);
    };

    const openEditDrawer = (pkg: Package) => {
        setEditMode(true);
        setSelectedPkgId(pkg.id);
        setName(pkg.name);
        setPrice(pkg.price);
        setFeatures(pkg.features);
        setFeatureInput('');
        setMaxGuests(pkg.maxGuests);
        setDurationDays(pkg.durationDays);
        setDrawerOpen(true);
    };

    // Features list helpers
    const handleAddFeature = (e: React.FormEvent) => {
        e.preventDefault();
        if (!featureInput.trim()) return;
        if (features.includes(featureInput.trim())) {
            toast.warning('Fitur ini sudah ada di dalam daftar.');
            return;
        }
        setFeatures([...features, featureInput.trim()]);
        setFeatureInput('');
    };

    const handleRemoveFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || price === undefined || !durationDays) {
            toast.error('Lengkapi seluruh kolom data paket.');
            return;
        }

        setSaving(true);
        const payload = {
            name,
            price,
            features,
            maxGuests,
            durationDays,
        };

        try {
            if (editMode && selectedPkgId) {
                await api.put(`/admin/packages/${selectedPkgId}`, payload);
                toast.success('Paket berhasil diperbarui!');
            } else {
                await api.post('/admin/packages', payload);
                toast.success('Paket baru berhasil ditambahkan!');
            }
            setDrawerOpen(false);
            fetchPackages();
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || 'Gagal menyimpan paket.',
            );
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-sans text-2xl font-bold text-white">
                        Paket Layanan
                    </h1>
                    <p className="text-sm text-slate-400">
                        Kelola paket langganan, batasan tamu, dan harga undangan
                    </p>
                </div>
                <button
                    onClick={openAddDrawer}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-all hover:bg-amber-600"
                >
                    <Plus size={16} />
                    <span>Tambah Paket</span>
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {packagesList.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6"
                        >
                            <div className="space-y-6">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="block text-xs font-semibold uppercase tracking-widest text-amber-500">
                                            Ngaturi Tier
                                        </span>
                                        <h3 className="mt-1 font-sans text-xl font-bold text-white">
                                            {pkg.name}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() => openEditDrawer(pkg)}
                                        className="bg-slate-850 cursor-pointer rounded-xl border border-slate-700 p-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                                        title="Edit Paket"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                </div>

                                {/* Price / Info */}
                                <div className="border-slate-850 flex items-center justify-between rounded-2xl border bg-slate-950/65 p-4 text-xs">
                                    <div>
                                        <span className="block text-slate-500">
                                            Harga Paket
                                        </span>
                                        <span className="text-lg font-bold text-white">
                                            {formatCurrency(pkg.price)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-slate-500">
                                            Durasi Masa Aktif
                                        </span>
                                        <span className="font-semibold text-slate-300">
                                            {pkg.durationDays} Hari
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-slate-500">
                                            Maksimal Tamu
                                        </span>
                                        <span className="font-semibold text-slate-300">
                                            {pkg.maxGuests === 0
                                                ? 'Unlimited'
                                                : `${pkg.maxGuests} Tamu`}
                                        </span>
                                    </div>
                                </div>

                                {/* Features List */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Fitur Paket:
                                    </h4>
                                    <ul className="space-y-2 text-xs">
                                        {pkg.features.map((f, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 text-slate-300"
                                            >
                                                <CheckCircle2
                                                    className="mt-0.5 shrink-0 text-amber-500"
                                                    size={14}
                                                />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Drawer Form for Package */}
            {drawerOpen && (
                <div className="backdrop-blur-xs fixed inset-0 z-50 flex justify-end bg-slate-950/70">
                    <div className="relative flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
                            <h3 className="font-sans text-base font-bold text-white">
                                {editMode
                                    ? 'Edit Paket Layanan'
                                    : 'Tambah Paket Baru'}
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
                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Nama Paket (Unique)
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g. PREMIUM"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Harga Paket (IDR)
                                    </label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(Number(e.target.value))
                                        }
                                        placeholder="e.g. 299000"
                                        className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                    />
                                    <p className="mt-1 text-[10px] text-slate-500">
                                        * Perubahan harga hanya akan berdampak
                                        pada transaksi tagihan/order baru.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Max Guests */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Max Kuota Tamu
                                        </label>
                                        <input
                                            type="number"
                                            value={maxGuests}
                                            onChange={(e) =>
                                                setMaxGuests(
                                                    Number(e.target.value),
                                                )
                                            }
                                            placeholder="e.g. 1000 (0 = Unlimited)"
                                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>

                                    {/* Duration Days */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                            Durasi (Hari)
                                        </label>
                                        <input
                                            type="number"
                                            value={durationDays}
                                            onChange={(e) =>
                                                setDurationDays(
                                                    Number(e.target.value),
                                                )
                                            }
                                            placeholder="e.g. 365"
                                            className="block w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>

                                {/* Features Aggregator Form */}
                                <div className="space-y-3">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Daftar Kelebihan / Fitur
                                    </label>

                                    {/* Add Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={featureInput}
                                            onChange={(e) =>
                                                setFeatureInput(e.target.value)
                                            }
                                            placeholder="Tulis fitur (e.g. Premium Photo Gallery)..."
                                            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFeature}
                                            className="cursor-pointer rounded-xl bg-amber-500 px-3 text-xs font-bold text-slate-950 transition-all hover:bg-amber-600"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Render Features Items */}
                                    <div className="max-h-48 space-y-1.5 overflow-y-auto">
                                        {features.length > 0 ? (
                                            features.map((f, index) => (
                                                <div
                                                    key={index}
                                                    className="border-slate-850 flex items-center justify-between rounded-lg border bg-slate-950 px-3 py-1.5 text-xs"
                                                >
                                                    <span className="text-slate-350 truncate pr-4">
                                                        {f}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveFeature(
                                                                index,
                                                            )
                                                        }
                                                        className="p-0.5 text-red-400 hover:text-red-300"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] italic text-slate-500">
                                                Belum ada fitur ditambahkan.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 border-t border-slate-800 bg-slate-950/20 p-6">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-600"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan Paket'}
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

export default AdminPackages;
