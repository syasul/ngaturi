import { Head } from '@inertiajs/react';
import { ArrowLeft, Compass, Palette } from 'lucide-react';
import React from 'react';

interface ThemeNotFoundProps {
    tier: string;
    code: string;
}

export const ThemeNotFound: React.FC<ThemeNotFoundProps> = ({ tier, code }) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] p-6 text-center font-sans">
            <Head title="Template Demo Tidak Ditemukan" />
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/10 text-gold-600">
                <Palette size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">
                Template Demo Tidak Ditemukan
            </h1>
            <p className="mt-2 max-w-md text-sm text-charcoal/60 leading-relaxed">
                Maaf, template dengan kode <code className="rounded bg-black/5 px-2 py-0.5 font-mono text-xs">{code}</code> untuk tier <code className="rounded bg-black/5 px-2 py-0.5 font-mono text-xs">{tier}</code> tidak ditemukan atau telah dinonaktifkan.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 bg-white px-5 py-2.5 text-xs font-semibold text-charcoal shadow-xs transition hover:bg-neutral-100"
                >
                    <ArrowLeft size={14} />
                    <span>Kembali ke Beranda</span>
                </a>
                <a
                    href="/dashboard/themes"
                    className="inline-flex items-center gap-2 rounded-full bg-gold-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-gold-700"
                >
                    <Compass size={14} />
                    <span>Katalog Tema</span>
                </a>
            </div>
        </div>
    );
};

export default ThemeNotFound;
