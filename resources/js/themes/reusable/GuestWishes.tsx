import { Clock, MessageSquare } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

interface Wish {
    id: string;
    name: string;
    rsvpStatus: string;
    message: string;
    createdAt: string;
}

interface GuestWishesProps {
    initialWishes: Wish[];
    weddingId: string;
}

export const GuestWishes: React.FC<GuestWishesProps> = ({
    initialWishes,
    weddingId,
}) => {
    const [wishes, setWishes] = useState<Wish[]>(initialWishes);

    useEffect(() => {
        setWishes(initialWishes);
    }, [initialWishes]);

    // Polling for new wishes every 10 seconds
    useEffect(() => {
        if (!weddingId) return;

        const fetchWishes = async () => {
            try {
                const res = await api.get(`/guests/public/wishes/${weddingId}`);
                if (res.data.status === 'success') {
                    setWishes(res.data.wishes);
                }
            } catch (err) {
                console.error('Error polling wishes:', err);
            }
        };

        const interval = setInterval(fetchWishes, 10000);
        return () => clearInterval(interval);
    }, [weddingId]);

    return (
        <div className="mx-auto max-w-md space-y-4 font-sans">
            <h4 className="flex items-center gap-2 border-b border-sand/20 pb-2 font-serif text-base font-bold text-charcoal">
                <MessageSquare className="text-gold-500" size={18} />
                <span>Ucapan & Doa ({wishes.length})</span>
            </h4>

            <div className="max-h-[400px] space-y-4 overflow-y-auto pr-1">
                {wishes.length === 0 ? (
                    <p className="py-6 text-center text-xs italic text-charcoal/40">
                        Belum ada ucapan. Jadilah yang pertama!
                    </p>
                ) : (
                    wishes.map((wish) => (
                        <div
                            key={wish.id}
                            className="space-y-2 rounded-2xl border border-sand/30 bg-white/70 p-4 text-left shadow-sm backdrop-blur"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-charcoal">
                                    {wish.name}
                                </span>
                                <span className="rounded border border-sand/20 bg-cream/30 px-2 py-0.5 text-[9px] uppercase text-charcoal/40">
                                    {wish.rsvpStatus === 'hadir' ||
                                    wish.rsvpStatus === 'attending'
                                        ? 'Hadir'
                                        : wish.rsvpStatus === 'tidak' ||
                                            wish.rsvpStatus === 'declined'
                                          ? 'Absen'
                                          : 'Ragu'}
                                </span>
                            </div>
                            <p className="text-xs italic leading-relaxed text-charcoal/70">
                                "{wish.message}"
                            </p>
                            <div className="flex items-center justify-end gap-1 border-t border-sand/15 pt-1 text-[9px] text-charcoal/40">
                                <Clock size={10} />
                                <span>
                                    {new Date(
                                        wish.createdAt,
                                    ).toLocaleDateString('id-ID')}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GuestWishes;
