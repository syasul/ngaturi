import {
    Copy,
    Edit2,
    Loader2,
    MessageSquare,
    Plus,
    Search,
    Sparkles,
    Trash2,
    Upload,
    Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Guests: React.FC = () => {
    const [wedding, setWedding] = useState<any>(null);
    const [guests, setGuests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form states
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [editingGuest, setEditingGuest] = useState<any>(null);
    const [importText, setImportText] = useState('');
    const [waTemplate, setWaTemplate] = useState(
        'Halo {nama},\n\nKami mengundang Anda untuk menghadiri acara pernikahan kami. Kehormatan bagi kami jika Anda bersedia hadir.\n\nDetail undangan digital dapat diakses pada tautan berikut:\n{link}\n\nTerima kasih!',
    );

    const loadGuests = async (q = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/guests${q ? `?q=${q}` : ''}`);
            if (res.data.status === 'success') {
                setGuests(res.data.guests);
            }
        } catch (err) {
            toast.error('Gagal memuat daftar tamu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        api.get('/weddings/me').then((res) => {
            if (res.data.status === 'success') {
                setWedding(res.data.wedding);
            }
        });
        loadGuests();
    }, []);

    // Handle Search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loadGuests(search);
    };

    // Handle Add Guest
    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName) return;

        try {
            const res = await api.post('/guests', {
                name: guestName,
                phone: guestPhone || null,
            });

            if (res.data.status === 'success') {
                toast.success('Tamu berhasil ditambahkan!');
                setIsAddModalOpen(false);
                setGuestName('');
                setGuestPhone('');
                loadGuests();
            }
        } catch (err) {
            toast.error('Gagal menambahkan tamu.');
        }
    };

    // Handle Edit Guest
    const handleEditGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGuest || !guestName) return;

        try {
            const res = await api.put(`/guests/${editingGuest.id}`, {
                name: guestName,
                phone: guestPhone || null,
            });

            if (res.data.status === 'success') {
                toast.success('Data tamu berhasil diperbarui.');
                setIsEditModalOpen(false);
                setEditingGuest(null);
                setGuestName('');
                setGuestPhone('');
                loadGuests();
            }
        } catch (err) {
            toast.error('Gagal memperbarui data tamu.');
        }
    };

    const openEditModal = (guest: any) => {
        setEditingGuest(guest);
        setGuestName(guest.name);
        setGuestPhone(guest.phone || '');
        setIsEditModalOpen(true);
    };

    // Handle Single Delete
    const handleDelete = async (id: string) => {
        if (!window.confirm('Hapus tamu ini?')) return;
        try {
            const res = await api.delete(`/guests/${id}`);
            if (res.data.status === 'success') {
                setGuests((prev) => prev.filter((g) => g.id !== id));
                toast.success('Tamu berhasil dihapus.');
            }
        } catch (err) {
            toast.error('Gagal menghapus tamu.');
        }
    };

    // Handle Bulk Delete
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Hapus ${selectedIds.length} tamu terpilih?`))
            return;

        try {
            const res = await api.post('/guests/bulk-delete', {
                ids: selectedIds,
            });
            if (res.data.status === 'success') {
                toast.success(res.data.message);
                setSelectedIds([]);
                loadGuests();
            }
        } catch (err) {
            toast.error('Gagal menghapus beberapa tamu.');
        }
    };

    // Parse and Import CSV copy-paste
    const handleImportTextSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!importText.trim()) return;

        const lines = importText.split('\n');
        const parsedGuests = [];

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            const parts = line.split(',');
            const name = parts[0]?.trim();
            const phone = parts[1]?.trim() || '';

            if (name && name.toLowerCase() !== 'nama') {
                parsedGuests.push({ name, phone });
            }
        }

        if (parsedGuests.length === 0) {
            toast.error(
                'Format data tidak valid. Pastikan format: Nama, No Telp',
            );
            return;
        }

        try {
            const res = await api.post('/guests/import', {
                guests: parsedGuests,
            });
            if (res.data.status === 'success') {
                toast.success(res.data.message);
                setIsImportModalOpen(false);
                setImportText('');
                loadGuests();
            }
        } catch (err) {
            toast.error('Gagal mengimport tamu.');
        }
    };

    // Checkbox functions
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(guests.map((g) => g.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id],
        );
    };

    // Helper WA / Copy Links
    const getGuestInvitationLink = (token: string) => {
        return `${window.location.origin}/u/${wedding?.slug}?to=${token}`;
    };

    const handleCopyLink = (token: string) => {
        const link = getGuestInvitationLink(token);
        navigator.clipboard.writeText(link);
        toast.success('Link undangan berhasil disalin!');
    };

    const handleSendWA = (guest: any) => {
        if (!guest.phone) {
            toast.error('No HP/WhatsApp tamu belum diisi.');
            return;
        }

        const invitationLink = getGuestInvitationLink(guest.uniqueToken);
        const formattedText = waTemplate
            .replace(/{nama}/g, guest.name)
            .replace(/{link}/g, invitationLink);

        // Format phone to international
        let phoneNum = guest.phone.replace(/[^0-9]/g, '');
        if (phoneNum.startsWith('0')) {
            phoneNum = '62' + phoneNum.slice(1);
        }

        const waUrl = `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(
            formattedText,
        )}`;
        window.open(waUrl, '_blank');
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex flex-col justify-between gap-4 border-b border-sand/35 pb-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="font-sans text-3xl font-bold text-charcoal">
                        Manajemen Tamu Undangan
                    </h2>
                    <p className="mt-1 text-sm text-charcoal/60">
                        Undang tamu, buat tautan kustom, kirim melalui WhatsApp,
                        dan pantau status kehadiran.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    <Button
                        variant="outline"
                        size="md"
                        className="flex items-center gap-2"
                        onClick={() => setIsImportModalOpen(true)}
                    >
                        <Upload size={16} />
                        <span>Import Tamu</span>
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        className="flex items-center gap-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={16} />
                        <span>Tambah Tamu</span>
                    </Button>
                </div>
            </div>

            {/* Search and Bulk Actions */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-sand/45 bg-white p-4 shadow-sm sm:flex-row">
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative w-full sm:max-w-md"
                >
                    <input
                        type="text"
                        placeholder="Cari nama tamu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-sand py-2 pl-10 pr-4 text-sm"
                    />
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
                        size={16}
                    />
                </form>

                <div className="flex w-full gap-2 sm:w-auto">
                    {selectedIds.length > 0 && (
                        <Button
                            variant="danger"
                            size="sm"
                            className="flex w-full items-center gap-2 sm:w-auto"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 size={14} />
                            <span>Hapus ({selectedIds.length})</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Guest Table */}
            <Card className="overflow-x-auto rounded-3xl border border-sand/45 bg-white p-2 shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-20">
                        <Loader2
                            className="animate-spin text-gold-500"
                            size={32}
                        />
                        <p className="text-xs text-charcoal/60">
                            Memproses data tamu...
                        </p>
                    </div>
                ) : guests.length === 0 ? (
                    <div className="py-20 text-center text-sm text-charcoal/40">
                        <Users
                            className="mx-auto mb-3 text-charcoal/20"
                            size={36}
                        />
                        <p>Daftar tamu kosong.</p>
                        <p className="mt-1 text-xs text-charcoal/30">
                            Mulai tambahkan tamu atau gunakan fitur import.
                        </p>
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-sand/30 bg-cream/15 text-xs font-semibold uppercase text-charcoal/50">
                                <th className="w-10 p-3">
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedIds.length ===
                                                guests.length &&
                                            guests.length > 0
                                        }
                                        onChange={handleSelectAll}
                                        className="rounded accent-gold-500"
                                    />
                                </th>
                                <th className="p-3">Nama Tamu</th>
                                <th className="p-3">No. WhatsApp</th>
                                <th className="p-3">Status RSVP</th>
                                <th className="p-3">Link Undangan</th>
                                <th className="p-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((g) => {
                                const isSelected = selectedIds.includes(g.id);
                                return (
                                    <tr
                                        key={g.id}
                                        className={`border-b border-sand/20 transition-colors hover:bg-cream/10 ${
                                            isSelected ? 'bg-gold-500/5' : ''
                                        }`}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleSelectRow(g.id)
                                                }
                                                className="rounded accent-gold-500"
                                            />
                                        </td>
                                        <td className="p-3 font-semibold text-charcoal">
                                            {g.name}
                                        </td>
                                        <td className="p-3 text-charcoal/70">
                                            {g.phone || '-'}
                                        </td>
                                        <td className="p-3">
                                            <Badge
                                                variant={
                                                    g.rsvpStatus ===
                                                        'attending' ||
                                                    g.rsvpStatus === 'hadir'
                                                        ? 'success'
                                                        : g.rsvpStatus ===
                                                                'declined' ||
                                                            g.rsvpStatus ===
                                                                'tidak hadir'
                                                          ? 'danger'
                                                          : g.rsvpStatus ===
                                                                  'tentative' ||
                                                              g.rsvpStatus ===
                                                                  'ragu-ragu'
                                                            ? 'warning'
                                                            : 'neutral'
                                                }
                                            >
                                                {g.rsvpStatus}
                                            </Badge>
                                        </td>
                                        <td className="max-w-xs truncate p-3 text-xs text-gold-600">
                                            {getGuestInvitationLink(
                                                g.uniqueToken,
                                            )}
                                        </td>
                                        <td className="flex justify-end gap-1.5 p-3 text-right">
                                            <button
                                                onClick={() => handleSendWA(g)}
                                                title="Kirim Undangan WA"
                                                className="cursor-pointer rounded-lg border border-green-200 bg-green-50 p-1.5 text-green-600 hover:bg-green-100"
                                            >
                                                <MessageSquare size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleCopyLink(
                                                        g.uniqueToken,
                                                    )
                                                }
                                                title="Salin Link"
                                                className="cursor-pointer rounded-lg border border-gold-200 bg-gold-50 p-1.5 text-gold-600 hover:bg-gold-100"
                                            >
                                                <Copy size={14} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(g)}
                                                title="Edit Tamu"
                                                className="cursor-pointer rounded-lg border border-sand bg-cream p-1.5 text-charcoal/70 hover:bg-cream/50"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(g.id)
                                                }
                                                title="Hapus Tamu"
                                                className="cursor-pointer rounded-lg border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </Card>

            {/* WA Template Customizer */}
            <Card className="space-y-4 rounded-3xl border border-sand/45 bg-white p-6 shadow-sm">
                <h3 className="flex items-center gap-1.5 font-sans text-lg font-bold text-charcoal">
                    <Sparkles className="text-gold-500" size={18} />
                    <span>Kustomisasi Template Pesan WhatsApp</span>
                </h3>
                <p className="text-xs text-charcoal/50">
                    Gunakan variabel{' '}
                    <code className="rounded bg-cream/50 px-1 py-0.5 font-mono font-bold text-gold-600">{`{nama}`}</code>{' '}
                    dan{' '}
                    <code className="rounded bg-cream/50 px-1 py-0.5 font-mono font-bold text-gold-600">{`{link}`}</code>{' '}
                    untuk diganti otomatis saat mengirim pesan undangan.
                </p>
                <textarea
                    rows={5}
                    value={waTemplate}
                    onChange={(e) => setWaTemplate(e.target.value)}
                    className="w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm focus:ring-1 focus:ring-gold-500"
                />
            </Card>

            {/* MODAL: ADD GUEST */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Tamu Manual"
            >
                <form onSubmit={handleAddGuest} className="space-y-4 font-sans">
                    <div>
                        <label className="block text-xs font-bold uppercase text-charcoal/60">
                            Nama Lengkap Tamu
                        </label>
                        <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-charcoal/60">
                            No. WhatsApp (Opsional)
                        </label>
                        <input
                            type="text"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button variant="primary" type="submit">
                            Tambah Tamu
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: EDIT GUEST */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Data Tamu"
            >
                <form
                    onSubmit={handleEditGuest}
                    className="space-y-4 font-sans"
                >
                    <div>
                        <label className="block text-xs font-bold uppercase text-charcoal/60">
                            Nama Lengkap Tamu
                        </label>
                        <input
                            type="text"
                            required
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Contoh: Budi Santoso"
                            className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-charcoal/60">
                            No. WhatsApp (Opsional)
                        </label>
                        <input
                            type="text"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            className="mt-1 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                        />
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button variant="primary" type="submit">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* MODAL: IMPORT TAMU */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Tamu dari Data Excel / CSV"
            >
                <form
                    onSubmit={handleImportTextSubmit}
                    className="space-y-4 font-sans"
                >
                    <p className="text-xs text-charcoal/70">
                        Salin baris-baris dari Excel Anda dan tempel di bawah.
                        Gunakan tanda koma (
                        <code className="bg-cream p-0.5 font-mono">,</code>)
                        sebagai pemisah nama dan no telepon.
                    </p>
                    <div className="rounded-xl border border-sand/40 bg-cream/40 p-3 font-mono text-[10px] leading-relaxed text-charcoal/50">
                        Format input per baris:
                        <br />
                        Nama Tamu, No Telepon
                        <br />
                        <br />
                        Contoh:
                        <br />
                        Joni Wijaya, 08122334455
                        <br />
                        Alisa Indah, 087788990011
                    </div>
                    <div>
                        <textarea
                            rows={8}
                            required
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Joni Wijaya, 08122334455&#10;Alisa Indah, 087788990011"
                            className="w-full rounded-xl border border-sand bg-white px-3 py-2 font-mono text-xs focus:ring-1 focus:ring-gold-500"
                        />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            type="button"
                            onClick={() => setIsImportModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button variant="primary" type="submit">
                            Proses Import
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
Guests.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Guests;
