import { AnimatePresence, motion } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
    AlertCircle,
    Camera,
    History,
    Keyboard,
    Loader2,
    QrCode,
    UserCheck,
    Volume2,
    VolumeX,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import api from '../../lib/api';
import DashboardLayout from '../DashboardLayout';

export const Checkin: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [manualToken, setManualToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [scanHistory, setScanHistory] = useState<any[]>([]);

    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Web Audio success beep
    const playBeep = () => {
        if (!soundEnabled) return;
        try {
            const AudioContext =
                window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = 880; // High pitch beep
            gain.gain.setValueAtTime(0.1, ctx.currentTime);

            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
            console.error('Failed to play beep sound:', e);
        }
    };

    // Handle Scan Checkin
    const processCheckin = async (token: string) => {
        setLoading(true);
        try {
            const res = await api.post('/guests/checkin', {
                uniqueToken: token,
            });
            if (res.data.status === 'success') {
                playBeep();
                toast.success(res.data.message);

                // Add to history
                const checkedInGuest = res.data.guest;
                setScanHistory((prev) => [
                    {
                        id: checkedInGuest.id,
                        name: checkedInGuest.name,
                        phone: checkedInGuest.phone,
                        time: new Date().toLocaleTimeString('id-ID'),
                        status: 'success',
                    },
                    ...prev,
                ]);

                setManualToken('');
            }
        } catch (err: any) {
            const msg =
                err.response?.data?.message || 'Gagal memproses QR Code.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // Html5QrcodeScanner init/cleanup
    useEffect(() => {
        if (isScanning) {
            // Small timeout to ensure element exists in DOM
            const timer = setTimeout(() => {
                const scanner = new Html5QrcodeScanner(
                    'qr-reader',
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        rememberLastUsedCamera: true,
                    },
                    false,
                );

                scanner.render(
                    (decodedText) => {
                        // Stop scanning on success
                        scanner
                            .clear()
                            .then(() => {
                                setIsScanning(false);
                                processCheckin(decodedText);
                            })
                            .catch((e) => console.error(e));
                    },
                    () => {
                        // Quiet mode for scanner errors
                    },
                );

                scannerRef.current = scanner;
            }, 300);

            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    scannerRef.current
                        .clear()
                        .catch((e) =>
                            console.error('Error clearing scanner:', e),
                        );
                    scannerRef.current = null;
                }
            };
        }
    }, [isScanning]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualToken.trim()) return;
        processCheckin(manualToken.trim());
    };

    return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-sand/35 pb-4">
                <div>
                    <h2 className="font-sans text-3xl font-bold text-charcoal">
                        Check-in Kehadiran Tamu
                    </h2>
                    <p className="mt-1 text-sm text-charcoal/60">
                        Gunakan kamera HP/laptop untuk memindai QR Code tamu
                        secara langsung di meja resepsi.
                    </p>
                </div>

                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`rounded-xl border p-2.5 transition-all ${
                        soundEnabled
                            ? 'border-gold-500/20 bg-gold-500/10 text-gold-600'
                            : 'border-sand bg-white text-charcoal/40'
                    }`}
                    title={
                        soundEnabled
                            ? 'Matikan Suara Beep'
                            : 'Aktifkan Suara Beep'
                    }
                >
                    {soundEnabled ? (
                        <Volume2 size={18} />
                    ) : (
                        <VolumeX size={18} />
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Scanner Panel */}
                <div className="space-y-6 lg:col-span-2">
                    <Card className="flex min-h-96 flex-col items-center justify-center rounded-3xl border border-sand/40 bg-white p-6 shadow-sm">
                        {!isScanning ? (
                            <div className="max-w-sm space-y-4 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                                    <QrCode size={32} />
                                </div>
                                <h3 className="font-sans text-lg font-bold text-charcoal">
                                    Mulai Scan QR Code
                                </h3>
                                <p className="text-xs leading-relaxed text-charcoal/50">
                                    Izinkan akses kamera perangkat untuk membaca
                                    kode QR Code yang tertera di undangan fisik
                                    atau digital milik tamu.
                                </p>
                                <Button
                                    variant="primary"
                                    className="flex w-full items-center justify-center gap-2"
                                    onClick={() => setIsScanning(true)}
                                >
                                    <Camera size={16} />
                                    <span>Aktifkan Kamera Scanner</span>
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full max-w-md space-y-4">
                                <div
                                    id="qr-reader"
                                    className="w-full overflow-hidden rounded-2xl border border-sand shadow-inner"
                                />
                                <Button
                                    variant="outline"
                                    className="flex w-full items-center justify-center gap-2"
                                    onClick={() => setIsScanning(false)}
                                >
                                    <span>Matikan Kamera</span>
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Manual Input Panel */}
                    <Card className="space-y-4 rounded-3xl border border-sand/40 bg-white p-6 shadow-sm">
                        <h3 className="flex items-center gap-2 font-sans text-base font-bold text-charcoal">
                            <Keyboard className="text-gold-500" size={18} />
                            <span>Input Token Manual</span>
                        </h3>
                        <form
                            onSubmit={handleManualSubmit}
                            className="flex gap-3"
                        >
                            <input
                                type="text"
                                value={manualToken}
                                onChange={(e) => setManualToken(e.target.value)}
                                placeholder="Masukkan token kustom tamu (mis: 3a9fd-abc)"
                                className="flex-1 rounded-xl border border-sand bg-white px-3 py-2 text-sm"
                            />
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading || !manualToken.trim()}
                            >
                                {loading ? (
                                    <Loader2
                                        className="animate-spin"
                                        size={16}
                                    />
                                ) : (
                                    <UserCheck size={16} />
                                )}
                                <span className="hidden sm:inline">
                                    Check-in
                                </span>
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* History Panel */}
                <div className="lg:col-span-1">
                    <Card className="flex h-full flex-col justify-between rounded-3xl border border-sand/40 bg-white p-6 shadow-sm">
                        <div>
                            <h3 className="flex items-center gap-2 border-b border-sand/20 pb-3 font-sans text-lg font-bold text-charcoal">
                                <History className="text-gold-500" size={18} />
                                <span>Log Scan Kehadiran</span>
                            </h3>

                            <div className="mt-4 max-h-[400px] space-y-4 overflow-y-auto pr-1">
                                {scanHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-charcoal/40">
                                        <AlertCircle
                                            size={20}
                                            className="mb-1 text-charcoal/20"
                                        />
                                        <span>
                                            Belum ada check-in pada sesi ini.
                                        </span>
                                    </div>
                                ) : (
                                    <AnimatePresence>
                                        {scanHistory.map((log, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center justify-between rounded-xl border border-sand/40 bg-cream/10 p-3 text-xs"
                                            >
                                                <div>
                                                    <p className="font-bold text-charcoal">
                                                        {log.name}
                                                    </p>
                                                    <p className="text-[10px] text-charcoal/50">
                                                        {log.phone || '-'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="rounded-full border border-gold-500/10 bg-gold-500/5 px-2 py-0.5 text-[10px] font-bold text-gold-600">
                                                        {log.time}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 border-t border-sand/20 pt-4 text-center text-[10px] text-charcoal/40">
                            Riwayat ini tersimpan secara lokal selama sesi
                            pindaian aktif.
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
Checkin.layout = (page: React.ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);

export default Checkin;
