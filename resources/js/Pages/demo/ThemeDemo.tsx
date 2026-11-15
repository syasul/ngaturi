import { Head } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    ExternalLink,
    Eye,
    Heart,
    Palette,
    Share2,
    Sparkles,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ThemeRouter from '../../themes/ThemeRouter';
import MusicPlayer from '../../themes/reusable/MusicPlayer';

interface ThemeDemoProps {
    theme: {
        id: string;
        name: string;
        code: string;
        tierCode: string;
        packageLevel: string;
        demoUrl: string;
        thumbnailUrl?: string;
    };
    wedding: any;
    wishes: any[];
    isDemo?: boolean;
}

export const ThemeDemo: React.FC<ThemeDemoProps> = ({
    theme,
    wedding,
    wishes: initialWishes = [],
}) => {
    // Presentation States
    const [isOpened, setIsOpened] = useState(false);
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const [autoPlayMusic, setAutoPlayMusic] = useState(false);
    const [wishes, setWishes] = useState<any[]>(initialWishes);
    const [isBarMinimized, setIsBarMinimized] = useState(false);
    const [copied, setCopied] = useState(false);

    // Font injection on mount
    useEffect(() => {
        const link = document.createElement('link');
        link.href =
            'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Dancing+Script:wght@400;700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const meta = document.createElement('meta');
        meta.name = 'color-scheme';
        meta.content = 'only light';
        document.head.appendChild(meta);

        document.documentElement.style.colorScheme = 'only light';
        if (document.body) {
            document.body.style.colorScheme = 'only light';
        }

        document.title = `Live Demo: ${theme.name} • Ngaturi`;

        return () => {
            document.head.removeChild(link);
            document.head.removeChild(meta);
            document.documentElement.style.colorScheme = '';
            if (document.body) {
                document.body.style.colorScheme = '';
            }
        };
    }, [theme.name]);

    const handleOpenInvitation = () => {
        setIsOpened(true);
        setAutoPlayMusic(true);
        setIsPlayingMusic(true);
    };

    const handleRsvpSubmit = async (status: string, message: string) => {
        toast.success(
            'Konfirmasi kehadiran Anda berhasil dikirim (Mode Demo).',
        );
        const newWish = {
            id: Date.now().toString(),
            name: 'Anda (Demo RSVP)',
            message: message || `Status: ${status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}`,
            createdAt: new Date().toISOString(),
            rsvpStatus: status,
        };
        setWishes((prev) => [newWish, ...prev]);
    };

    const handleCopyDemoUrl = () => {
        const url = theme.demoUrl || window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('Link demo template berhasil disalin ke clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    const tierBadgeBg =
        theme.packageLevel === 'BASIC'
            ? 'bg-emerald-500 text-white'
            : theme.packageLevel === 'PREMIUM'
              ? 'bg-amber-500 text-white'
              : 'bg-purple-500 text-white';

    const normalizedThemeId = (theme.id || 'basic-1').toLowerCase();
    const legacyThemeIds = [
        'elegant',
        'rustic',
        'modern',
        'royal-yogyakarta',
        'botanical-minimal',
        'editorial-mono',
    ];
    const isLegacyTheme =
        legacyThemeIds.some((id) => normalizedThemeId.includes(id)) ||
        (!normalizedThemeId.includes('theme-1') &&
            !normalizedThemeId.includes('theme-2') &&
            !normalizedThemeId.includes('theme-3') &&
            !normalizedThemeId.includes('premium-10') &&
            !normalizedThemeId.includes('burgundy-bloom') &&
            !normalizedThemeId.includes('custom-theme-1') &&
            !normalizedThemeId.includes('basic'));

    return (
        <div
            className="relative min-h-screen w-full overflow-x-hidden font-sans"
            style={{ colorScheme: 'only light' }}
        >
            <Head
                title={`Demo ${theme?.name || 'Template'} (${theme?.packageLevel || 'Basic'})`}
            />

            {/* Top Floating Demo Toolbar */}
            <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[94%] max-w-2xl transition-all duration-300">
                <div className="rounded-2xl border border-charcoal/10 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shrink-0 ${tierBadgeBg}`}
                            >
                                {theme.packageLevel} (/{theme.tierCode})
                            </span>
                            <div className="min-w-0">
                                <h2 className="text-xs sm:text-sm font-bold text-charcoal truncate">
                                    {theme.name}
                                </h2>
                                <p className="text-[10px] text-charcoal/60 truncate font-mono">
                                    ngaturi.inxdvi.com/demo/{theme.tierCode}/{theme.code}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleCopyDemoUrl}
                                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-charcoal/20 bg-white px-3 py-1.5 text-[11px] font-semibold text-charcoal shadow-xs transition hover:bg-neutral-100"
                                title="Salin link demo"
                            >
                                {copied ? (
                                    <>
                                        <Check size={13} className="text-green-600" />
                                        <span className="hidden sm:inline">Tersalin</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={13} />
                                        <span className="hidden sm:inline">Salin URL</span>
                                    </>
                                )}
                            </button>

                            <a
                                href="/dashboard/themes"
                                className="inline-flex items-center gap-1.5 rounded-full bg-gold-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition hover:bg-gold-700"
                            >
                                <Sparkles size={13} />
                                <span>Gunakan Template</span>
                            </a>

                            <button
                                onClick={() => setIsBarMinimized(!isBarMinimized)}
                                className="p-1 text-charcoal/60 hover:text-charcoal"
                                title={isBarMinimized ? 'Perluas detail' : 'Kecilkan bar'}
                            >
                                {isBarMinimized ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronUp size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {!isBarMinimized && (
                        <div className="mt-2.5 pt-2 border-t border-charcoal/10 flex flex-wrap items-center justify-between text-[11px] text-charcoal/70">
                            <span className="flex items-center gap-1.5">
                                <Eye size={12} className="text-gold-600" />
                                Mode Live Interactive Preview: Anda dapat menguji semua tombol, formulir RSVP, dan musik.
                            </span>
                            <span className="font-mono text-[10px] text-charcoal/50">
                                Kode: {theme.code}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Autoplay Music Player */}
            {wedding.data?.musicUrl && (
                <MusicPlayer
                    musicUrl={wedding.data.musicUrl}
                    autoPlay={autoPlayMusic}
                    isPlaying={isPlayingMusic}
                    onTogglePlay={setIsPlayingMusic}
                    showButton={isLegacyTheme}
                />
            )}

            {/* Main Content & Opening Cover Screen managed by ThemeRouter */}
            <ThemeRouter
                themeId={theme.id}
                isOpened={isOpened}
                onOpen={handleOpenInvitation}
                data={wedding.data}
                weddingId={wedding.id}
                photos={wedding.photos}
                guestName="Bapak / Ibu Tamu Terhormat"
                wishes={wishes}
                onRsvpSubmit={handleRsvpSubmit}
                isPlayingMusic={isPlayingMusic}
                setIsPlayingMusic={setIsPlayingMusic}
            />
        </div>
    );
};

export default ThemeDemo;
