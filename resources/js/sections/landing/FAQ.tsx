import React from 'react';
import Accordion from '../../components/ui/Accordion';

export const FAQ: React.FC = () => {
    const faqs = [
        {
            q: 'Apakah undangan digital langsung aktif setelah pembayaran?',
            a: 'Ya, sistem kami bekerja secara otomatis. Setelah pembayaran Anda terverifikasi, undangan digital Anda langsung aktif seketika dan siap disebarkan.',
        },
        {
            q: 'Apakah saya bisa mengubah data acara setelah undangan disebar?',
            a: 'Tentu saja! Anda bebas merubah data pengantin, tanggal/jam acara, lokasi maps, hingga mengunggah foto baru kapan pun melalui dashboard tanpa batas.',
        },
        {
            q: 'Bagaimana cara mengirimkan undangan dengan nama tamu personal?',
            a: 'Melalui dashboard, Anda dapat memasukkan daftar nama tamu secara massal atau satu-persatu. Sistem akan membuatkan link unik khusus untuk setiap nama tamu tersebut sehingga nama mereka muncul otomatis saat membuka undangan.',
        },
        {
            q: 'Apakah ada batasan jumlah nama tamu yang diundang?',
            a: 'Untuk paket Starter dibatasi maksimal 100 nama tamu. Sedangkan untuk paket Premium dan Custom, Anda dapat membuat link nama tamu tanpa batasan (Unlimited) tanpa biaya tambahan.',
        },
        {
            q: 'Apakah saya bisa mengunggah musik pengiring sendiri?',
            a: 'Ya! Pada paket Premium dan Custom, Anda dapat mengunggah file musik berformat MP3 milik Anda sendiri atau menyalin tautan lagu pilihan Anda.',
        },
        {
            q: 'Bagaimana cara tamu melakukan RSVP konfirmasi kehadiran?',
            a: 'Tamu undangan cukup mengisi form konfirmasi kehadiran (Hadir/Tidak Hadir) dan menuliskan ucapan selamat pada website undangan Anda. Data konfirmasi tersebut akan langsung tercatat secara real-time di dashboard Anda.',
        },
        {
            q: 'Apakah data kehadiran tamu bisa diunduh ke Excel?',
            a: 'Tentu. Anda dapat mengekspor seluruh data kehadiran RSVP tamu, jumlah rombongan yang dibawa, beserta pesan ucapan doa mereka ke format Excel (.xlsx) dengan sekali klik dari dashboard.',
        },
        {
            q: 'Bagaimana sistem penerimaan angpao digital atau kado fisik?',
            a: 'Anda dapat mengaktifkan fitur dompet digital / rekening bank di dalam undangan. Tamu akan mentransfer dana langsung ke rekening Anda tanpa potongan komisi sepeser pun dari pihak kami. Anda juga dapat mencantumkan alamat pengiriman kado fisik.',
        },
        {
            q: 'Apakah tema undangan bisa diganti setelah dibeli?',
            a: 'Untuk pengguna paket Premium, Anda diberikan kebebasan penuh untuk mengganti tema desain undangan kapan saja tanpa batas, bahkan setelah undangan dipublikasikan.',
        },
    ];

    return (
        <section id="faq" className="bg-cream/20 py-24">
            <div className="mx-auto max-w-4xl px-6">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Tanya Jawab
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Frequently Asked Questions
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                </div>

                {/* FAQ Accordions List */}
                <div className="flex flex-col">
                    {faqs.map((faq, i) => (
                        <Accordion key={i} title={faq.q}>
                            {faq.a}
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
