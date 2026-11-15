import { ExternalLink, Eye, Smartphone } from 'lucide-react';
import React, { useState } from 'react';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import TiltCard from '../../components/ui/TiltCard';

export const Catalog: React.FC = () => {
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [selectedThemeName, setSelectedThemeName] = useState<string>('');
    const [selectedThemeDemoUrl, setSelectedThemeDemoUrl] = useState<string>('');

    const themes = [
        {
            id: 'basic-1',
            demoTier: 'b',
            demoCode: 'tv6akl',
            name: 'Minimalist Sage',
            tag: 'BASIC',
            color: 'bg-[#F2F6F3] border-[#7F9F8B]',
            textColor: 'text-[#2D4F3E]',
            description:
                'Desain minimalis modern bernuansa sage green & warm sand yang bersih, menenangkan, dan elegan.',
            accent: 'rustic' as const,
        },
        {
            id: 'theme-1',
            demoTier: 'p',
            demoCode: 'emikvq',
            name: 'Burgundy Bloom',
            tag: 'PREMIUM',
            color: 'bg-[#3A0511] border-[#C9A84C]',
            textColor: 'text-[#FAF3EC]',
            description:
                'Desain royal burgundy mewah dengan aksen emas berkelas dan layout responsif eksklusif.',
            accent: 'gold' as const,
        },
        {
            id: 'theme-2',
            demoTier: 'p',
            demoCode: 't2ltgr',
            name: 'Premium 10 Animasi',
            tag: 'PREMIUM',
            color: 'bg-slate-900 border-gold-400',
            textColor: 'text-gold-200',
            description:
                'Template sinematik dengan 10 animasi visual memukau dan pengalaman interaktif istimewa.',
            accent: 'gold' as const,
        },
    ];

    return (
        <section
            id="catalog"
            className="relative overflow-hidden bg-cream/20 py-24"
        >
            {/* Subtle floral watermark */}
            <img
                src="/assets/wedding/hero-floral.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-[0.05]"
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
                <div className="mb-16">
                    <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-600">
                        Desain Undangan
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl md:text-5xl">
                        Pilih Tema yang Mencerminkan Cinta Kalian
                    </h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold-400" />
                    <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-relaxed text-charcoal/70 sm:text-base">
                        Temukan tema pilihan terbaik yang mewakili kepribadian
                        dan nuansa hari istimewa kalian.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {themes.map((theme) => (
                        <TiltCard key={theme.id} className="h-full">
                            <Card
                                className="relative flex h-full flex-col items-start justify-between overflow-hidden bg-white p-6 text-left"
                                hoverable={false}
                            >
                                <div className="w-full">
                                    <div className="mb-6 flex items-center justify-between">
                                        <Badge variant={theme.accent}>
                                            {theme.tag}
                                        </Badge>
                                        <span className="font-poppins text-[10px] font-bold text-charcoal/40">
                                            MOBILE OPTIMIZED
                                        </span>
                                    </div>

                                    {/* Theme preview with floral bg */}
                                    <div
                                        className={`relative mb-6 flex aspect-[4/3] w-full select-none flex-col items-center justify-center overflow-hidden rounded-xl border p-4 ${theme.color}`}
                                    >
                                        <img
                                            src="/assets/wedding/hero-floral.png"
                                            alt=""
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                                        />
                                        <img
                                            src="/assets/wedding/ornaments.png"
                                            alt=""
                                            aria-hidden="true"
                                            className="pointer-events-none absolute right-0 top-0 w-14 opacity-30"
                                        />
                                        <Smartphone
                                            className={`relative z-10 mb-2 h-8 w-8 opacity-50 ${theme.textColor}`}
                                        />
                                        <span
                                            className={`relative z-10 font-sans text-sm font-semibold ${theme.textColor}`}
                                        >
                                            {theme.name}
                                        </span>
                                        <span
                                            className={`relative z-10 mt-1 text-[9px] uppercase tracking-widest opacity-40 ${theme.textColor}`}
                                        >
                                            Live Template
                                        </span>
                                    </div>

                                    <h3 className="mb-2 font-poppins text-lg font-bold text-charcoal">
                                        {theme.name}
                                    </h3>
                                    <p className="mb-6 font-sans text-sm leading-relaxed text-charcoal/60">
                                        {theme.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedTheme(theme.id);
                                        setSelectedThemeName(theme.name);
                                        setSelectedThemeDemoUrl(`/demo/${theme.demoTier}/${theme.demoCode}`);
                                    }}
                                    className="shadow-xs inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-gold-500 py-3 font-poppins text-sm font-semibold text-gold-600 transition-all duration-300 hover:bg-gold-500 hover:text-white hover:shadow-md"
                                >
                                    <Eye size={16} />
                                    <span>Live Preview</span>
                                </button>
                            </Card>
                        </TiltCard>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={selectedTheme !== null}
                onClose={() => setSelectedTheme(null)}
                title={`Live Preview: ${selectedThemeName}`}
                size="xl"
            >
                <div className="flex min-h-[550px] flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="relative aspect-[9/18] w-full max-w-[340px] shrink-0 overflow-hidden rounded-3xl border border-charcoal/80 bg-charcoal p-3 shadow-2xl">
                        <div className="absolute left-1/2 top-2.5 z-30 flex h-4 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-charcoal">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                        </div>
                        {selectedThemeDemoUrl && (
                            <iframe
                                src={selectedThemeDemoUrl}
                                className="h-full w-full overflow-hidden rounded-2xl border-0"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                                title={`${selectedThemeName} Preview`}
                            />
                        )}
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                        <span className="font-poppins text-xs font-semibold uppercase tracking-widest text-gold-500">
                            Tampilan Mobile Responsive
                        </span>
                        <h3 className="mb-4 mt-2 font-display text-2xl font-bold text-charcoal">
                            Bagaimana Tamu Melihat Undanganmu
                        </h3>
                        <p className="mb-6 font-sans text-sm leading-relaxed text-charcoal/70 sm:text-base">
                            Lebih dari 95% tamu undangan akan membuka link
                            undangan digital melalui smartphone mereka. Desain
                            tema kami dirancang khusus dan dioptimalkan secara
                            presisi agar tampak sangat mewah dan pas di semua
                            layar handphone.
                        </p>
                        <div className="flex flex-col gap-3 rounded-xl border border-sand bg-cream/50 p-4 text-left font-sans text-xs text-charcoal/80 sm:text-sm">
                            <p>
                                ✔️ Animasi transisi yang halus di browser
                                handphone.
                            </p>
                            <p>
                                ✔️ Pengendali musik latar yang mudah
                                dinyalakan/dimatikan.
                            </p>
                            <p>
                                ✔️ Integrasi langsung ke maps dan peta petunjuk
                                arah lokasi.
                            </p>
                        </div>

                        {selectedThemeDemoUrl && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                <a
                                    href={selectedThemeDemoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-gold-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-gold-700"
                                >
                                    <ExternalLink size={14} />
                                    <span>Buka Demo Layar Penuh</span>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default Catalog;
