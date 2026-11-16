import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Wabi-Sabi Desert Clay Arch Corner
const DesertCorner = ({
    position = 'top-left',
    color = '#A86942',
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
            {/* Minimalist Arch Curves */}
            <path
                d="M6 74 V28 C6 15.85 15.85 6 28 6 H74"
                stroke={color}
                strokeWidth="1.6"
                strokeOpacity="0.4"
            />
            <path
                d="M16 66 V32 C16 23.16 23.16 16 32 16 H66"
                stroke={color}
                strokeWidth="1.2"
                strokeOpacity="0.25"
            />
            <circle cx="34" cy="34" r="5" fill={color} fillOpacity="0.4" />
            <circle cx="50" cy="18" r="2" fill={color} fillOpacity="0.5" />
            <circle cx="18" cy="50" r="2" fill={color} fillOpacity="0.5" />
        </svg>
    );
};

const DesertDivider = ({
    color = '#A86942',
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
        <div className="flex items-center gap-1.5 text-[#A86942]">
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-2 w-3 rounded-t-full border border-[#A86942] bg-[#A86942]/50" />
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

export const config18: BasicThemeConfig = {
    id: 'basic-18',
    name: 'Desert Sand',
    editionTitle: 'Desert Sand & Clay Edition',
    hashTag: '#AryaNabilaDesert',
    heroIllustration: '/assets/wedding/couple-rustic.png',

    desktopBg: 'bg-[#20150E]',
    desktopGradient: 'from-[#140C07] via-[#20150E]/85 to-transparent',
    desktopTextColor: 'text-[#F8F4EE]',
    desktopAccentText: 'text-[#DCA07A]',
    desktopBadgeBorder: 'border-[#DCA07A]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#F8F4EE]',
    containerTextColor: 'text-[#291B13]',
    containerId: 'basic18-scroll-container',

    accentColor: '#A86942',
    accentColorAlt: '#7B4321',
    accentText: 'text-[#7B4321]',
    accentBg: 'bg-[#A86942]',
    accentBorder: 'border-[#A86942]/30',
    accentShadow: 'shadow-[#A86942]/20',

    buttonPrimary: 'bg-[#A86942] hover:bg-[#8F532F] text-white shadow-md shadow-[#A86942]/25 font-semibold',
    buttonSecondary: 'border border-[#A86942]/35 bg-white/70 text-[#7B4321] hover:bg-white',

    sectionAltBg: 'bg-[#EDE4D5]',
    quoteBannerBg: 'bg-[#20150E]',
    quoteTextColor: 'text-[#F8F4EE]',
    quoteAccentColor: 'text-[#DCA07A]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#A86942]/20',
    cardTitleText: 'text-[#291B13]',
    cardSubText: 'text-[#695143]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#A86942]/30',
    dockText: 'text-[#695143]',
    dockActiveText: 'text-[#7B4321]',
    dockActiveBg: 'bg-[#A86942]/15',

    renderCorner: (props) => <DesertCorner {...props} />,
    renderDivider: (props) => <DesertDivider {...props} />,
};

export const BasicTheme18: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config18} />;
};

export default BasicTheme18;
