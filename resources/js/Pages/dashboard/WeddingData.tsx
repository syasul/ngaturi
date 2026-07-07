import {
    BookOpen,
    Calendar,
    ExternalLink,
    Loader2,
    MapPin,
    Palette,
    Quote,
    Save,
    Upload,
    User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

type TabType =
    'groom' | 'bride' | 'akad' | 'resepsi' | 'stories' | 'quotes' | 'styling';

export const WeddingData: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('groom');
    const [wedding, setWedding] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Local state for all fields
    const [formData, setFormData] = useState<any>({
        groom: {
            name: '',
            nickname: '',
            parents: '',
            bio: '',
            ig: '',
            photo: '',
        },
        bride: {
            name: '',
            nickname: '',
            parents: '',
            bio: '',
            ig: '',
            photo: '',
        },
        akad: { date: '', time: '', venue: '', address: '', maps: '' },
        resepsi: { date: '', time: '', venue: '', address: '', maps: '' },
        stories: [],
        quotes: '',
        customStyle: {
            primaryColor: '#6B1D2F',
            secondaryColor: '#D4AF37',
            baseBg: '#FCF9F6',
            textColor: '#2D1A1E',
            titleFont: 'font-serif',
            bodyFont: 'font-sans',
            musicUrl: '',
        },
    });

    const isDirtyRef = useRef(false);

    // 1. Load data
    useEffect(() => {
        const fetchWedding = async () => {
            try {
                const res = await api.get('/weddings/me');
                if (res.data.status === 'success' && res.data.wedding) {
                    const w = res.data.wedding;
                    setWedding(w);

                    // Merge fetched data with default structures
                    const merged = {
                        groom: { ...formData.groom, ...(w.data?.groom || {}) },
                        bride: { ...formData.bride, ...(w.data?.bride || {}) },
                        akad: {
                            ...formData.akad,
                            ...(w.data?.schedule?.akad || {}),
                        },
                        resepsi: {
                            ...formData.resepsi,
                            ...(w.data?.schedule?.resepsi || {}),
                        },
                        stories: w.data?.stories || [],
                        quotes: w.data?.quotes || '',
                        customStyle: {
                            ...formData.customStyle,
                            ...(w.data?.customStyle || {}),
                        },
                    };
                    setFormData(merged);
                }
            } catch (err) {
                toast.error('Gagal mengambil data undangan.');
            } finally {
                setLoading(false);
            }
        };
        fetchWedding();
    }, []);

    // 2. Auto-save every 30 seconds if dirty
    useEffect(() => {
        const interval = setInterval(() => {
            if (isDirtyRef.current) {
                handleSave(false); // Silent save
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [formData]);

    const handleFieldChange = (
        tab: keyof typeof formData,
        field: string,
        value: any,
    ) => {
        isDirtyRef.current = true;
        setFormData((prev: any) => ({
            ...prev,
            [tab]: {
                ...prev[tab],
                [field]: value,
            },
        }));
    };

    const handleStoryChange = (index: number, field: string, value: any) => {
        isDirtyRef.current = true;
        const newStories = [...formData.stories];
        newStories[index] = { ...newStories[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, stories: newStories }));
    };

    const addStory = () => {
        isDirtyRef.current = true;
        setFormData((prev: any) => ({
            ...prev,
            stories: [...prev.stories, { year: '', title: '', story: '' }],
        }));
    };

    const removeStory = (index: number) => {
        isDirtyRef.current = true;
        setFormData((prev: any) => ({
            ...prev,
            stories: prev.stories.filter((_: any, i: number) => i !== index),
        }));
    };

    // 3. Save to database
    const handleSave = async (showToast = true) => {
        setSaving(true);
        try {
            const payload = {
                data: {
                    groom: formData.groom,
                    bride: formData.bride,
                    schedule: {
                        akad: formData.akad,
                        resepsi: formData.resepsi,
                    },
                    stories: formData.stories,
                    quotes: formData.quotes,
                    customStyle: formData.customStyle,
                },
            };

            const res = await api.put('/weddings/me', payload);
            if (res.data.status === 'success') {
                isDirtyRef.current = false;
                const now = new Date().toLocaleTimeString('id-ID');
                setLastSaved(now);
                if (showToast) {
                    toast.success('Perubahan data berhasil disimpan!');
                }
            }
        } catch (err) {
            if (showToast) {
                toast.error('Gagal menyimpan perubahan.');
            }
        } finally {
            setSaving(false);
        }
    };

    // 4. Handle avatar uploads
    const handlePhotoUpload = async (
        tab: 'groom' | 'bride',
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const toastId = toast.loading('Mengunggah foto...');
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await api.post('/media/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.status === 'success') {
                handleFieldChange(tab, 'photo', res.data.url);
                toast.success('Foto berhasil diunggah!', { id: toastId });
                // Save automatically
                setTimeout(() => handleSave(false), 200);
            }
        } catch (err) {
            toast.error('Gagal mengunggah foto.', { id: toastId });
        }
    };

    const handlePreview = async () => {
        await handleSave(false);
        const previewUrl = `${window.location.origin}/u/${wedding?.slug}`;
        window.open(previewUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
                <p className="text-sm font-medium text-charcoal/60">
                    Memuat data editor...
                </p>
            </div>
        );
    }

    const tabs: { id: TabType; name: string; icon: any }[] = [
        { id: 'groom', name: 'Mempelai Pria', icon: User },
        { id: 'bride', name: 'Mempelai Wanita', icon: User },
        { id: 'akad', name: 'Akad Nikah', icon: Calendar },
        { id: 'resepsi', name: 'Resepsi', icon: MapPin },
        { id: 'stories', name: 'Love Story', icon: BookOpen },
        { id: 'quotes', name: 'Quotes', icon: Quote },
        { id: 'styling', name: 'Desain & Warna', icon: Palette },
    ];

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col justify-between gap-4 border-b border-sand/35 pb-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-sans text-3xl font-bold text-charcoal">
                        Data Pernikahan
                    </h2>
                    <p className="mt-1 text-sm text-charcoal/60">
                        Lengkapi profil Anda dan pasangan, jadwal acara, cerita
                        kasih, dan kutipan pengantar.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {lastSaved && (
                        <span className="text-xs font-medium text-charcoal/50">
                            Simpan otomatis: {lastSaved}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        size="md"
                        className="flex items-center gap-2"
                        onClick={handlePreview}
                    >
                        <ExternalLink size={16} />
                        <span>Simpan & Preview</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        className="flex items-center gap-2"
                        disabled={saving}
                        onClick={() => handleSave(true)}
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <Save size={16} />
                        )}
                        <span>Simpan</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Navigation list */}
                <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:col-span-1 lg:flex-col lg:overflow-x-visible lg:pb-0">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-gold-500 text-white shadow-md shadow-gold-500/20'
                                        : 'border border-sand/45 bg-white text-charcoal/70 hover:bg-cream/40'
                                }`}
                            >
                                <Icon size={16} />
                                <span>{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Form panel */}
                <Card className="rounded-3xl border border-sand/40 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
                    {/* TAB 1: GROOM */}
                    {activeTab === 'groom' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 border-b border-sand/20 pb-4">
                                <div className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-sand bg-cream/15">
                                    {formData.groom.photo ? (
                                        <img
                                            src={formData.groom.photo}
                                            alt="Groom Photo"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User
                                            className="text-charcoal/30"
                                            size={32}
                                        />
                                    )}
                                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Upload
                                            className="text-white"
                                            size={16}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handlePhotoUpload('groom', e)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <h4 className="font-sans text-lg font-bold text-charcoal">
                                        Foto Mempelai Pria
                                    </h4>
                                    <p className="mt-1 text-xs text-charcoal/50">
                                        JPEG, PNG, WEBP. Maksimal ukuran 800KB.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Nama Lengkap Pria
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.groom.name}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'groom',
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama Lengkap Mempelai Pria"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Nama Panggilan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.groom.nickname}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'groom',
                                                'nickname',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Panggilan"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Nama Orang Tua
                                </label>
                                <input
                                    type="text"
                                    value={formData.groom.parents}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'groom',
                                            'parents',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Putra dari Bpk. X & Ibu Y"
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Username Instagram (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.groom.ig}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'groom',
                                            'ig',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="@username"
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Kata Pengantar / Bio Singkat
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.groom.bio}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'groom',
                                            'bio',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ceritakan singkat tentang diri mempelai pria..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BRIDE */}
                    {activeTab === 'bride' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 border-b border-sand/20 pb-4">
                                <div className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-sand bg-cream/15">
                                    {formData.bride.photo ? (
                                        <img
                                            src={formData.bride.photo}
                                            alt="Bride Photo"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User
                                            className="text-charcoal/30"
                                            size={32}
                                        />
                                    )}
                                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Upload
                                            className="text-white"
                                            size={16}
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handlePhotoUpload('bride', e)
                                            }
                                        />
                                    </label>
                                </div>
                                <div>
                                    <h4 className="font-sans text-lg font-bold text-charcoal">
                                        Foto Mempelai Wanita
                                    </h4>
                                    <p className="mt-1 text-xs text-charcoal/50">
                                        JPEG, PNG, WEBP. Maksimal ukuran 800KB.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Nama Lengkap Wanita
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bride.name}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'bride',
                                                'name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama Lengkap Mempelai Wanita"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Nama Panggilan
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bride.nickname}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'bride',
                                                'nickname',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Panggilan"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Nama Orang Tua
                                </label>
                                <input
                                    type="text"
                                    value={formData.bride.parents}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'bride',
                                            'parents',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Putri dari Bpk. A & Ibu B"
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Username Instagram (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.bride.ig}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'bride',
                                            'ig',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="@username"
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Kata Pengantar / Bio Singkat
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.bride.bio}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'bride',
                                            'bio',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ceritakan singkat tentang diri mempelai wanita..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 3: AKAD */}
                    {activeTab === 'akad' && (
                        <div className="space-y-6">
                            <h4 className="border-b border-sand/20 pb-2 font-sans text-lg font-bold text-charcoal">
                                Informasi Akad Nikah
                            </h4>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Tanggal Akad
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.akad.date}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'akad',
                                                'date',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Waktu Akad (WIB/WITA/WIT)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.akad.time}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'akad',
                                                'time',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 08:00 - 10:00 WIB"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Nama Tempat / Gedung
                                </label>
                                <input
                                    type="text"
                                    value={formData.akad.venue}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'akad',
                                            'venue',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Contoh: Masjid Agung Al-Akbar / Rumah Kediaman"
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.akad.address}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'akad',
                                            'address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Alamat lengkap lokasi akad nikah..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Link Google Maps
                                </label>
                                <input
                                    type="text"
                                    value={formData.akad.maps}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'akad',
                                            'maps',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 4: RESEPSI */}
                    {activeTab === 'resepsi' && (
                        <div className="space-y-6">
                            <h4 className="border-b border-sand/20 pb-2 font-sans text-lg font-bold text-charcoal">
                                Informasi Resepsi Pernikahan
                            </h4>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Tanggal Resepsi
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.resepsi.date}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'resepsi',
                                                'date',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Waktu Resepsi
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.resepsi.time}
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'resepsi',
                                                'time',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 11:00 - Selesai"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Nama Tempat / Gedung
                                </label>
                                <input
                                    type="text"
                                    value={formData.resepsi.venue}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'resepsi',
                                            'venue',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Nama gedung resepis..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.resepsi.address}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'resepsi',
                                            'address',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Alamat lengkap lokasi resepsi..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Link Google Maps
                                </label>
                                <input
                                    type="text"
                                    value={formData.resepsi.maps}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'resepsi',
                                            'maps',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 5: STORIES */}
                    {activeTab === 'stories' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-sand/20 pb-2">
                                <h4 className="font-sans text-lg font-bold text-charcoal">
                                    Cerita Kasih (Love Story)
                                </h4>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addStory}
                                >
                                    + Tambah Cerita
                                </Button>
                            </div>

                            {formData.stories.length === 0 ? (
                                <div className="py-12 text-center text-xs text-charcoal/50">
                                    Belum ada cerita kasih yang ditambahkan.
                                    Klik tombol di atas untuk memulai.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {formData.stories.map(
                                        (story: any, index: number) => (
                                            <div
                                                key={index}
                                                className="relative space-y-4 rounded-2xl border border-sand/40 bg-cream/10 p-4"
                                            >
                                                <button
                                                    onClick={() =>
                                                        removeStory(index)
                                                    }
                                                    className="absolute right-4 top-4 cursor-pointer text-xs font-bold text-red-500 hover:underline"
                                                >
                                                    Hapus
                                                </button>

                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase text-charcoal/60">
                                                            Tahun
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={story.year}
                                                            onBlur={() =>
                                                                handleSave(
                                                                    false,
                                                                )
                                                            }
                                                            onChange={(e) =>
                                                                handleStoryChange(
                                                                    index,
                                                                    'year',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Contoh: 2020"
                                                            className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-3">
                                                        <label className="block text-xs font-bold uppercase text-charcoal/60">
                                                            Judul Cerita
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={story.title}
                                                            onBlur={() =>
                                                                handleSave(
                                                                    false,
                                                                )
                                                            }
                                                            onChange={(e) =>
                                                                handleStoryChange(
                                                                    index,
                                                                    'title',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Contoh: Pertama Kali Bertemu"
                                                            className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                                        Cerita Singkat
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={story.story}
                                                        onBlur={() =>
                                                            handleSave(false)
                                                        }
                                                        onChange={(e) =>
                                                            handleStoryChange(
                                                                index,
                                                                'story',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Tuliskan cerita singkat tentang momen tersebut..."
                                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB 6: QUOTES */}
                    {activeTab === 'quotes' && (
                        <div className="space-y-6">
                            <h4 className="border-b border-sand/20 pb-2 font-sans text-lg font-bold text-charcoal">
                                Kata Pengantar & Quotes
                            </h4>

                            <div>
                                <label className="block text-xs font-bold uppercase text-charcoal/60">
                                    Quotes Pembuka / Ayat Suci
                                </label>
                                <textarea
                                    rows={8}
                                    value={formData.quotes}
                                    onBlur={() => handleSave(false)}
                                    onChange={(e) =>
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            quotes: e.target.value,
                                        }))
                                    }
                                    placeholder="Kutipan ayat suci Quran, kutipan Alkitab, atau quotes romantis untuk pembuka undangan..."
                                    className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 7: STYLING */}
                    {activeTab === 'styling' && (
                        <div className="space-y-6">
                            <h4 className="border-b border-sand/20 pb-2 font-sans text-lg font-bold text-charcoal">
                                Kustomisasi Desain & Warna
                            </h4>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Primary Color Picker */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Warna Utama (Aksen Utama / Button)
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={
                                                formData.customStyle
                                                    ?.primaryColor || '#6B1D2F'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'primaryColor',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 w-10 cursor-pointer rounded-xl border border-sand p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                formData.customStyle
                                                    ?.primaryColor || '#6B1D2F'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'primaryColor',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Secondary Color Picker */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Warna Sekunder (Emas/Ornamen)
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={
                                                formData.customStyle
                                                    ?.secondaryColor ||
                                                '#D4AF37'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'secondaryColor',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 w-10 cursor-pointer rounded-xl border border-sand p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                formData.customStyle
                                                    ?.secondaryColor ||
                                                '#D4AF37'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'secondaryColor',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Base BG Color Picker */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Warna Latar Belakang (Base BG)
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={
                                                formData.customStyle?.baseBg ||
                                                '#FCF9F6'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'baseBg',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 w-10 cursor-pointer rounded-xl border border-sand p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                formData.customStyle?.baseBg ||
                                                '#FCF9F6'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'baseBg',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Text Color Picker */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Warna Teks Utama
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={
                                                formData.customStyle
                                                    ?.textColor || '#2D1A1E'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'textColor',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-10 w-10 cursor-pointer rounded-xl border border-sand p-0.5"
                                        />
                                        <input
                                            type="text"
                                            value={
                                                formData.customStyle
                                                    ?.textColor || '#2D1A1E'
                                            }
                                            onBlur={() => handleSave(false)}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    'customStyle',
                                                    'textColor',
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Title Font */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Gaya Font Judul (Nama Mempelai)
                                    </label>
                                    <select
                                        value={
                                            formData.customStyle?.titleFont ||
                                            'font-serif'
                                        }
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'customStyle',
                                                'titleFont',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="font-serif">
                                            Serif Klasik (Cormorant Garamond)
                                        </option>
                                        <option value="font-sans">
                                            Modern Minimalis (Outfit / Poppins)
                                        </option>
                                        <option value="font-cursive">
                                            Handwritten / Cursive (Dancing
                                            Script)
                                        </option>
                                    </select>
                                </div>

                                {/* Body Font */}
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Gaya Font Isi (Keterangan & Artikel)
                                    </label>
                                    <select
                                        value={
                                            formData.customStyle?.bodyFont ||
                                            'font-sans'
                                        }
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'customStyle',
                                                'bodyFont',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    >
                                        <option value="font-sans">
                                            Sans Serif (Poppins / Outfit)
                                        </option>
                                        <option value="font-serif">
                                            Serif Elegan (Lora / Lato)
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Backgroud Music Custom Input */}
                            <div className="space-y-4 border-t border-sand/20 pt-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-charcoal/60">
                                        Link URL Musik Latar Belakang (Youtube /
                                        MP3 Direct Link)
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            formData.customStyle?.musicUrl || ''
                                        }
                                        onBlur={() => handleSave(false)}
                                        onChange={(e) =>
                                            handleFieldChange(
                                                'customStyle',
                                                'musicUrl',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                        className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                                    />
                                    <p className="mt-1 text-[10px] text-charcoal/40">
                                        Masukkan URL langsung (direct link) file
                                        audio berformat .mp3.
                                    </p>
                                </div>

                                <div>
                                    <label className="block font-sans text-xs font-bold uppercase text-charcoal/60">
                                        Unggah File Musik Latar (.mp3)
                                    </label>
                                    <div className="mt-1 flex items-center gap-3">
                                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-sand bg-white px-4 py-2 text-xs font-semibold shadow-sm hover:bg-cream/25">
                                            <Upload size={14} />
                                            <span>Pilih File Audio</span>
                                            <input
                                                type="file"
                                                accept="audio/mp3,audio/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (!file) return;
                                                    const toastId =
                                                        toast.loading(
                                                            'Mengunggah file musik...',
                                                        );
                                                    const data = new FormData();
                                                    data.append('file', file);
                                                    try {
                                                        const res =
                                                            await api.post(
                                                                '/media/upload',
                                                                data,
                                                                {
                                                                    headers: {
                                                                        'Content-Type':
                                                                            'multipart/form-data',
                                                                    },
                                                                },
                                                            );
                                                        if (
                                                            res.data.status ===
                                                            'success'
                                                        ) {
                                                            handleFieldChange(
                                                                'customStyle',
                                                                'musicUrl',
                                                                res.data.url,
                                                            );
                                                            toast.success(
                                                                'Musik berhasil diunggah!',
                                                                { id: toastId },
                                                            );
                                                            setTimeout(
                                                                () =>
                                                                    handleSave(
                                                                        false,
                                                                    ),
                                                                200,
                                                            );
                                                        }
                                                    } catch (err) {
                                                        toast.error(
                                                            'Gagal mengunggah musik.',
                                                            { id: toastId },
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                        {formData.customStyle?.musicUrl && (
                                            <span className="max-w-xs truncate text-xs font-semibold text-green-600">
                                                ✓ Musik terpasang
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
WeddingData.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default WeddingData;
