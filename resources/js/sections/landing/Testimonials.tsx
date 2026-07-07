import { Star } from 'lucide-react';
import React from 'react';
import Card from '../../components/ui/Card';

export const Testimonials: React.FC = () => {
    const reviews = [
        {
            couple: 'Adit & Salsa',
            city: 'Jakarta',
            text: 'Sangat terbantu! Fitur RSVP real-time membantu kami menghitung jumlah porsi katering dengan akurat.',
        },
        {
            couple: 'Bagas & Dini',
            city: 'Surabaya',
            text: 'Temanya sangat premium. Banyak teman dan kerabat memuji undangan kami sangat elegan dan berkelas.',
        },
        {
            couple: 'Rian & Putri',
            city: 'Bandung',
            text: 'Bikinnya gampang sekali cuma 10 menit. Fitur QR Code kehadiran bikin meja registrasi rapi tanpa antrean.',
        },
        {
            couple: 'Genta & Rere',
            city: 'Yogyakarta',
            text: 'Hemat jutaan rupiah dibanding cetak undangan fisik ratusan lembar. Fitur kirim nama unik otomatis luar biasa.',
        },
        {
            couple: 'Fahmi & Alya',
            city: 'Malang',
            text: 'Alternatif pernikahan go-green ramah lingkungan tanpa menghasilkan tumpukan sampah kertas bekas undangan.',
        },
        {
            couple: 'Riza & Mita',
            city: 'Semarang',
            text: 'Customer Service-nya luar biasa cepat menanggapi pertanyaan. Sangat direkomendasikan untuk pasangan sibuk!',
        },
    ];

    const doubleReviews = [...reviews, ...reviews];

    return (
        <section id="testimonials" className="overflow-hidden bg-white py-24">
            <div className="mx-auto max-w-7xl px-6 text-center">
                <div className="mb-16">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Ulasan Pengguna
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Sudah Dipercaya Ribuan Pasangan
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                </div>
            </div>

            <div className="relative flex w-full select-none items-center overflow-hidden py-4">
                <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />
                <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />

                <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
                    {doubleReviews.map((rev, i) => (
                        <Card
                            key={i}
                            hoverable={false}
                            className="flex w-[280px] shrink-0 flex-col justify-between border border-gray-100 p-6 sm:w-[350px] sm:p-8"
                        >
                            <div>
                                <div className="mb-4 flex gap-1 text-amber-400">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star
                                            key={idx}
                                            size={14}
                                            className="fill-current"
                                        />
                                    ))}
                                </div>
                                <p className="mb-6 font-sans text-sm italic leading-relaxed text-charcoal/70 sm:text-base">
                                    "{rev.text}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-100 bg-gold-50 font-sans text-sm font-bold text-gold-600">
                                    {rev.couple.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-poppins text-sm font-bold text-charcoal">
                                        {rev.couple}
                                    </h4>
                                    <span className="font-sans text-xs text-charcoal/40">
                                        {rev.city}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
