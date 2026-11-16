import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Minimalist Modern Pearl Drop Corner
const PearlCorner = ({
    position = 'top-left',
    color = '#78716C',
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
                d="M4 74 V8 C4 5.79 5.79 4 8 4 H74"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.4"
            />
            <path
                d="M12 66 V16 C12 13.79 13.79 12 16 12 H66"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity="0.25"
            />
            {/* Luminous Pearl Drop */}
            <circle cx="20" cy="20" r="4" fill="#D6D3D1" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="19" cy="19" r="1.5" fill="#FFF" />
            <circle cx="44" cy="8" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="8" cy="44" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
    );
};

const PearlDivider = ({
    color = '#78716C',
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
        <div className="flex items-center gap-1.5 text-[#78716C]">
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#78716C]" />
            <span className="font-serif text-xs italic">&bull;</span>
        </div>
        <div
            className="h-[1px] w-12 sm:w-20"
            style={{
                background: `linear-gradient(90deg, ${color}, transparent)`,
            }}
        />
    </div>
);

export const config20: BasicThemeConfig = {
    id: 'basic-20',
    name: 'Pearl Opal',
    editionTitle: 'Pearl Opal Modernist Edition',
    hashTag: '#AryaNabilaPearl',
    heroIllustration: '/assets/wedding/couple-royal.png',

    desktopBg: 'bg-[#1C1917]',
    desktopGradient: 'from-[#0C0A09] via-[#1C1917]/85 to-transparent',
    desktopTextColor: 'text-[#FAF9F7]',
    desktopAccentText: 'text-[#D6D3D1]',
    desktopBadgeBorder: 'border-[#D6D3D1]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#FAF9F7]',
    containerTextColor: 'text-[#1C1917]',
    containerId: 'basic20-scroll-container',

    accentColor: '#78716C',
    accentColorAlt: '#44403C',
    accentText: 'text-[#44403C]',
    accentBg: 'bg-[#57534E]',
    accentBorder: 'border-[#78716C]/30',
    accentShadow: 'shadow-[#78716C]/20',

    buttonPrimary: 'bg-[#292524] hover:bg-[#1C1917] text-white shadow-md shadow-[#292524]/25 font-semibold',
    buttonSecondary: 'border border-[#78716C]/35 bg-white/70 text-[#44403C] hover:bg-white',

    sectionAltBg: 'bg-[#EFECE6]',
    quoteBannerBg: 'bg-[#1C1917]',
    quoteTextColor: 'text-[#FAF9F7]',
    quoteAccentColor: 'text-[#D6D3D1]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#78716C]/20',
    cardTitleText: 'text-[#1C1917]',
    cardSubText: 'text-[#57534E]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#78716C]/30',
    dockText: 'text-[#57534E]',
    dockActiveText: 'text-[#1C1917]',
    dockActiveBg: 'bg-[#78716C]/15',

    renderCorner: (props) => <PearlCorner {...props} />,
    renderDivider: (props) => <PearlDivider {...props} />,
};

export const BasicTheme20: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config20} />;
};

export default BasicTheme20;
