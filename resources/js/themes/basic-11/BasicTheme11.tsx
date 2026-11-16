import { Sparkles } from 'lucide-react';
import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Celestial Midnight Star Corner
const StarCorner = ({
    position = 'top-left',
    color = '#D4AF37',
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
                d="M4 74 V14 C4 8.48 8.48 4 14 4 H74"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.45"
            />
            {/* 8-point Celestial Star */}
            <g transform="translate(24, 24)">
                <path
                    d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z"
                    fill={color}
                    fillOpacity="0.8"
                />
                <circle cx="0" cy="0" r="2" fill="#FFF" />
            </g>
            <circle cx="50" cy="14" r="1.5" fill={color} fillOpacity="0.6" />
            <circle cx="14" cy="50" r="1.5" fill={color} fillOpacity="0.6" />
            <circle cx="36" cy="36" r="1" fill={color} fillOpacity="0.4" />
        </svg>
    );
};

const StarDivider = ({
    color = '#D4AF37',
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
        <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <Sparkles size={11} className="opacity-70" />
            <span className="font-serif text-xs italic">&bull;</span>
            <Sparkles size={13} className="opacity-90" />
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

export const config11: BasicThemeConfig = {
    id: 'basic-11',
    name: 'Midnight Navy',
    editionTitle: 'Midnight Navy Celestial Edition',
    hashTag: '#AryaNabilaMidnight',
    heroIllustration: '/assets/wedding/couple-royal.png',

    desktopBg: 'bg-[#0A192F]',
    desktopGradient: 'from-[#050C16] via-[#0A192F]/85 to-transparent',
    desktopTextColor: 'text-[#F0F4F8]',
    desktopAccentText: 'text-[#D4AF37]',
    desktopBadgeBorder: 'border-[#D4AF37]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#0D1B2A]',
    containerTextColor: 'text-[#E0E1DD]',
    containerId: 'basic11-scroll-container',

    accentColor: '#D4AF37',
    accentColorAlt: '#E0C068',
    accentText: 'text-[#D4AF37]',
    accentBg: 'bg-[#D4AF37]',
    accentBorder: 'border-[#D4AF37]/30',
    accentShadow: 'shadow-[#D4AF37]/25',

    buttonPrimary: 'bg-[#D4AF37] hover:bg-[#C5A059] text-[#0A192F] shadow-lg shadow-[#D4AF37]/25 font-bold',
    buttonSecondary: 'border border-[#D4AF37]/35 bg-white/5 text-[#D4AF37] hover:bg-white/10',

    sectionAltBg: 'bg-[#152538]',
    quoteBannerBg: 'bg-[#060D17]',
    quoteTextColor: 'text-[#F0F4F8]',
    quoteAccentColor: 'text-[#D4AF37]',

    cardBg: 'bg-[#1B2A4A]/80',
    cardBorder: 'border-[#D4AF37]/25',
    cardTitleText: 'text-[#F0F4F8]',
    cardSubText: 'text-[#B0BCCB]',

    dockBg: 'bg-[#0A192F]/95',
    dockBorder: 'border-[#D4AF37]/30',
    dockText: 'text-[#B0BCCB]',
    dockActiveText: 'text-[#D4AF37]',
    dockActiveBg: 'bg-[#D4AF37]/20',

    renderCorner: (props) => <StarCorner {...props} />,
    renderDivider: (props) => <StarDivider {...props} />,
};

export const BasicTheme11: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config11} />;
};

export default BasicTheme11;
