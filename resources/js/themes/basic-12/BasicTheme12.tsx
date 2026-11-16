import { Sparkles } from 'lucide-react';
import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Art Deco Champagne Corner Ornament
const ChampagneCorner = ({
    position = 'top-left',
    color = '#C5A059',
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
                strokeOpacity="0.4"
            />
            <path
                d="M14 66 V20 C14 16.69 16.69 14 20 14 H66"
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.25"
            />
            {/* Elegant Art Deco Diamond */}
            <polygon points="14,14 22,6 30,14 22,22" fill={color} fillOpacity="0.5" />
            <circle cx="22" cy="38" r="2" fill={color} fillOpacity="0.4" />
            <circle cx="38" cy="22" r="2" fill={color} fillOpacity="0.4" />
        </svg>
    );
};

const ChampagneDivider = ({
    color = '#C5A059',
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
        <div className="flex items-center gap-1.5 text-[#C5A059]">
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C5A059] bg-[#C5A059]/40" />
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-2.5 w-2.5 rotate-45 border border-[#C5A059] bg-[#C5A059]" />
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-1.5 w-1.5 rotate-45 border border-[#C5A059] bg-[#C5A059]/40" />
        </div>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
        />
    </div>
);

export const config12: BasicThemeConfig = {
    id: 'basic-12',
    name: 'Champagne Luxe',
    editionTitle: 'Champagne Luxe Edition',
    hashTag: '#AryaNabilaLuxe',
    heroIllustration: '/assets/wedding/couple-royal.png',

    desktopBg: 'bg-[#1C1814]',
    desktopGradient: 'from-[#120F0C] via-[#1C1814]/85 to-transparent',
    desktopTextColor: 'text-[#FAF7F0]',
    desktopAccentText: 'text-[#C5A059]',
    desktopBadgeBorder: 'border-[#C5A059]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#FAF7F0]',
    containerTextColor: 'text-[#2C2623]',
    containerId: 'basic12-scroll-container',

    accentColor: '#C5A059',
    accentColorAlt: '#997736',
    accentText: 'text-[#997736]',
    accentBg: 'bg-[#C5A059]',
    accentBorder: 'border-[#C5A059]/30',
    accentShadow: 'shadow-[#C5A059]/20',

    buttonPrimary: 'bg-[#C5A059] hover:bg-[#B38D45] text-white shadow-md shadow-[#C5A059]/25 font-semibold',
    buttonSecondary: 'border border-[#C5A059]/35 bg-white/70 text-[#997736] hover:bg-white',

    sectionAltBg: 'bg-[#F3EDE2]',
    quoteBannerBg: 'bg-[#1C1814]',
    quoteTextColor: 'text-[#FAF7F0]',
    quoteAccentColor: 'text-[#C5A059]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#C5A059]/25',
    cardTitleText: 'text-[#2C2623]',
    cardSubText: 'text-[#6E635B]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#C5A059]/30',
    dockText: 'text-[#6E635B]',
    dockActiveText: 'text-[#997736]',
    dockActiveBg: 'bg-[#C5A059]/15',

    renderCorner: (props) => <ChampagneCorner {...props} />,
    renderDivider: (props) => <ChampagneDivider {...props} />,
};

export const BasicTheme12: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config12} />;
};

export default BasicTheme12;
