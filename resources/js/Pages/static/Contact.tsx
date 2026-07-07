import { ArrowLeft, MessageSquare, Phone, Send } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Button from '../../components/ui/Button';
import Footer from '../../sections/landing/Footer';
import Navbar from '../../sections/landing/Navbar';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'Pertanyaan Umum',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Mohon lengkapi semua kolom formulir.');
            return;
        }

        setIsLoading(true);
        // Simulate sending message
        setTimeout(() => {
            setIsLoading(false);
            toast.success(
                'Pesan Anda berhasil dikirim! Tim support kami akan segera membalas email Anda.',
            );
            setFormData({
                name: '',
                email: '',
                subject: 'Pertanyaan Umum',
                message: '',
            });
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-cream font-sans text-charcoal">
            <Navbar />

            <main className="mx-auto w-full max-w-5xl flex-grow px-6 pb-20 pt-32">
                {/* Back Link */}
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-gold-600 transition-colors hover:text-gold-700"
                    >
                        <ArrowLeft size={16} />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

                {/* Page Header */}
                <header className="mb-12 border-b border-sand pb-8">
                    <div className="mb-3 flex items-center gap-3 text-gold-600">
                        <MessageSquare size={32} className="stroke-1" />
                        <span className="font-poppins text-xs font-semibold uppercase tracking-widest">
                            Bantuan Layanan
                        </span>
                    </div>
                    <h1 className="mb-4 font-sans text-4xl font-bold tracking-wide text-charcoal sm:text-5xl">
                        Hubungi Kami
                    </h1>
                    <p className="text-sm text-charcoal/60">
                        Kami di sini untuk membantu memperlancar perayaan hari
                        bahagia Anda.
                    </p>
                </header>

                <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
                    {/* Form Column */}
                    <section className="backdrop-blur-xs shadow-xs rounded-2xl border border-sand bg-white/60 p-8 md:col-span-7">
                        <h2 className="mb-6 font-sans text-2xl font-semibold text-charcoal">
                            Kirim Pesan
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block font-poppins text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="w-full rounded-lg border border-sand bg-cream/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-poppins text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="contoh@domain.com"
                                    className="w-full rounded-lg border border-sand bg-cream/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block font-poppins text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                                    Subjek Pertanyaan
                                </label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            subject: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-sand bg-cream/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                                    disabled={isLoading}
                                >
                                    <option value="Pertanyaan Umum">
                                        Pertanyaan Umum
                                    </option>
                                    <option value="Kendala Teknis">
                                        Kendala Teknis / Bug
                                    </option>
                                    <option value="Layanan Pembayaran & Billing">
                                        Layanan Pembayaran & Billing
                                    </option>
                                    <option value="Kerja Sama / Afiliasi">
                                        Kerja Sama / Afiliasi
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block font-poppins text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                                    Pesan Anda
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            message: e.target.value,
                                        })
                                    }
                                    rows={5}
                                    placeholder="Tuliskan pesan atau kendala Anda di sini..."
                                    className="w-full resize-none rounded-lg border border-sand bg-cream/50 px-4 py-3 text-sm outline-none transition-all focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="flex w-full cursor-pointer items-center justify-center gap-2 py-3.5 font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <Send size={16} />
                                )}
                                <span>
                                    {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
                                </span>
                            </Button>
                        </form>
                    </section>

                    {/* Contact Details Column */}
                    <section className="space-y-6 md:col-span-5">
                        {/* Quick WhatsApp Support Card */}
                        <div className="shadow-2xs flex flex-col items-center space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-8 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                <Phone size={24} className="stroke-1" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-sans text-xl font-bold text-charcoal">
                                    WhatsApp Support
                                </h3>
                                <p className="px-4 text-xs text-charcoal/60">
                                    Respon lebih cepat via obrolan WhatsApp
                                    Customer Service untuk bantuan edit tema,
                                    kustomisasi, atau masalah aktivasi paket.
                                </p>
                            </div>
                            <a
                                href="https://wa.me/6281330012100"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <Button
                                    variant="outline"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 border-none bg-emerald-600 py-3.5 font-semibold text-white hover:bg-emerald-700 hover:text-white"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                    >
                                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.335 4.978L2 22l5.177-1.356a9.948 9.948 0 004.832 1.25c5.506 0 9.989-4.478 9.99-9.984A10.002 10.002 0 0012.012 2zm5.723 14.108c-.297.836-1.42 1.527-2.317 1.714-.614.127-1.42.226-4.095-.877-3.42-1.408-5.617-4.887-5.787-5.114-.17-.227-1.357-1.801-1.357-3.437 0-1.637.85-2.443 1.152-2.784.303-.341.66-.426.88-.426.22 0 .44.004.63.012.193.008.454-.074.71.545.263.633.9 2.195.979 2.355.078.16.13.348.026.56-.104.21-.158.34-.316.52-.158.182-.332.408-.475.547-.158.156-.324.326-.14.64.184.316.817 1.347 1.751 2.179.94.832 1.73 1.09 1.977 1.214.247.125.39.102.536-.065.145-.168.627-.728.795-.975.168-.247.337-.206.568-.12.23.086 1.458.687 1.71.813.253.125.42.188.483.293.063.104.063.606-.233 1.442z" />
                                    </svg>
                                    <span>Chat WhatsApp CS</span>
                                </Button>
                            </a>
                        </div>

                        {/* Email Support Card */}
                        <div className="space-y-3 rounded-2xl border border-sand bg-white/40 p-6">
                            <h3 className="font-sans text-lg font-bold text-charcoal">
                                Kantor Operasional
                            </h3>
                            <p className="text-xs leading-relaxed text-charcoal/70">
                                PT Ngaturi Autopilot Pernikahan
                                <br />
                                Gedung Premium Creative Hub Lt. 4<br />
                                Jl. Jenderal Sudirman No. 102, Jakarta Selatan,
                                Indonesia
                                <br />
                                Email: support@ngaturi.id
                            </p>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
