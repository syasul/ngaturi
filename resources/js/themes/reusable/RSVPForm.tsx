import { motion } from 'framer-motion';
import { Loader2, Send } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

interface RSVPFormProps {
    guestName?: string;
    guestToken?: string;
    onRsvpSubmit: (rsvpStatus: string, message: string) => Promise<void>;
    initialStatus?: string;
}

export const RSVPForm: React.FC<RSVPFormProps> = ({
    guestName,
    guestToken,
    onRsvpSubmit,
    initialStatus = 'hadir',
}) => {
    const [rsvpStatus, setRsvpStatus] = useState(initialStatus);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onRsvpSubmit(rsvpStatus, message);
            setMessage('');
        } finally {
            setSubmitting(false);
        }
    };

    if (!guestToken) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="mx-auto max-w-sm rounded-2xl border border-gold-500/10 bg-gold-500/5 p-5 text-center font-sans text-xs leading-relaxed text-charcoal/60"
            >
                Konfirmasi RSVP kustom dan ucapan tersedia bagi tamu terdaftar.
                Silakan akses link personal yang dikirimkan oleh mempelai
                melalui WhatsApp.
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: 'spring', stiffness: 190, damping: 22 }}
            whileHover={{ y: -3 }}
            className="mx-auto max-w-md"
        >
            <Card className="relative overflow-hidden rounded-3xl border border-sand/40 bg-white/85 p-6 font-sans shadow-sm backdrop-blur">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <h4 className="mb-2 text-center font-serif text-sm font-bold text-charcoal">
                        Kirim Konfirmasi Kehadiran Anda, {guestName || 'Tamu'}
                    </h4>

                    {guestToken && (
                        <div className="mb-4 flex flex-col items-center justify-center space-y-3 rounded-2xl border border-sand/30 bg-cream/10 p-4 text-center">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gold-600">
                                Tiket Check-in Digital
                            </span>
                            <div className="rounded-2xl border border-sand bg-white p-2.5 shadow-inner">
                                <QRCodeSVG value={guestToken} size={150} />
                            </div>
                            <p className="max-w-[240px] text-[10px] leading-relaxed text-charcoal/50">
                                Tunjukkan QR Code ini kepada petugas penerima
                                tamu untuk check-in kehadiran cepat.
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-bold uppercase text-charcoal/50">
                            Status Kehadiran
                        </label>
                        <select
                            value={rsvpStatus}
                            onChange={(e) => setRsvpStatus(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-sand/40 bg-white px-3 py-2 text-xs text-charcoal/80 transition-all duration-200 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                        >
                            <option value="hadir">Hadir</option>
                            <option value="tidak">Tidak Hadir</option>
                            <option value="ragu">Ragu-ragu</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase text-charcoal/50">
                            Pesan Ucapan / Doa Restu
                        </label>
                        <textarea
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tuliskan ucapan dan doa terbaik Anda untuk kedua mempelai..."
                            className="mt-1 w-full rounded-xl border border-sand/40 bg-white px-3 py-2 text-xs text-charcoal/80 transition-all duration-200 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                        />
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={submitting}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs"
                    >
                        {submitting ? (
                            <Loader2 className="animate-spin" size={14} />
                        ) : (
                            <Send size={14} />
                        )}
                        <span>Kirim Konfirmasi</span>
                    </Button>
                </form>
            </Card>
        </motion.div>
    );
};

export default RSVPForm;
