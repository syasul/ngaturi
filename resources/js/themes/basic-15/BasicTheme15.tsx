import { Sparkles } from 'lucide-react';
import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Ethereal Sky Cloud Corner
const SkyCorner = ({
    position = 'top-left',
    color = '#4A7298',
    size = 48,
    className = '',
}: {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    color?: string;
    size?: number;
    className?: string;
}) => {
    const transforms: Record<string, string> = {
        'top-left': 'scale(1, 1)',
        'top-right': 'scale(-1, 1)',
        'bottom-left': 'scale(1, -1)',
        'bottom-right': 'scale(-1, -1)',
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`pointer-events-none absolute select-none ${className}`}
            style={{ transform: transforms[position] }}
        >
            <path
                d="M6 72 V14 C6 9.58 9.58 6 14 6 H72"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.35"
            />
            {/* Whimsical Cloud Motifs */}
            <path
                d="M16 28 C16 22 24 20 28 24 C32 20 40 22 40 28 C42 30 42 36 38 38 C34 40 18 40 16 34 Z"
                fill={color}
                fillOpacity="0.25"
            />
            <circle cx="28" cy="24" r="1.5" fill="#FFF" />
            <circle cx="48" cy="14" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="14" cy="48" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
    );
};

const SkyDivider = ({
    color = '#4A7298',
    className = '',
}: {
    color?: string;
    className?: string;
}) => (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, transparent, ${color})`,
            }}
        />
        <div className="flex items-center gap-1.5 text-[#4A7298]">
            <Sparkles size={11} className="opacity-70" />
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="font-serif text-xs italic">&bull;</span>
            <Sparkles size={11} className="opacity-70" />
        </div>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
        />
    </div>
);

export const config15: BasicThemeConfig = {
    id: 'basic-15',
    name: 'Ethereal Sky',
    editionTitle: 'Ethereal Sky Blue Edition',
    hashTag: '#AryaNabilaSky',
    heroIllustration: '/assets/wedding/couple-foliage.png',

    desktopBg: 'bg-[#152330]',
    desktopGradient: 'from-[#0C151E] via-[#152330]/85 to-transparent',
    desktopTextColor: 'text-[#F0F6FA]',
    desktopAccentText: 'text-[#9BC2E6]',
    desktopBadgeBorder: 'border-[#9BC2E6]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#F0F6FA]',
    containerTextColor: 'text-[#1D3244]',
    containerId: 'basic15-scroll-container',

    accentColor: '#4A7298',
    accentColorAlt: '#2C5377',
    accentText: 'text-[#2C5377]',
    accentBg: 'bg-[#4A7298]',
    accentBorder: 'border-[#4A7298]/30',
    accentShadow: 'shadow-[#4A7298]/20',

    buttonPrimary: 'bg-[#4A7298] hover:bg-[#395D80] text-white shadow-md shadow-[#4A7298]/25 font-semibold',
    buttonSecondary: 'border border-[#4A7298]/35 bg-white/70 text-[#2C5377] hover:bg-white',

    sectionAltBg: 'bg-[#DFEBF4]',
    quoteBannerBg: 'bg-[#152330]',
    quoteTextColor: 'text-[#F0F6FA]',
    quoteAccentColor: 'text-[#9BC2E6]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#4A7298]/20',
    cardTitleText: 'text-[#1D3244]',
    cardSubText: 'text-[#50687C]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#4A7298]/30',
    dockText: 'text-[#50687C]',
    dockActiveText: 'text-[#2C5377]',
    dockActiveBg: 'bg-[#4A7298]/15',

    renderCorner: (props) => <SkyCorner {...props} />,
    renderDivider: (props) => <SkyDivider {...props} />,
};

export const BasicTheme15: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config15} />;
};

export default BasicTheme15;
