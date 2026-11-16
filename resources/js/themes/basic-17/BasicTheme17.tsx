import { Sparkles } from 'lucide-react';
import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Orchid Lilac Bloom Corner
const LilacCorner = ({
    position = 'top-left',
    color = '#8E54B0',
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
                d="M4 76 C18 52 38 32 76 4"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.35"
                strokeLinecap="round"
            />
            {/* 4-Petal Orchid Floret */}
            <circle cx="28" cy="22" r="6" fill={color} fillOpacity="0.4" />
            <circle cx="22" cy="28" r="6" fill={color} fillOpacity="0.4" />
            <circle cx="34" cy="28" r="6" fill={color} fillOpacity="0.4" />
            <circle cx="28" cy="34" r="6" fill={color} fillOpacity="0.4" />
            <circle cx="28" cy="28" r="2" fill="#FFF" />
            <circle cx="48" cy="14" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="14" cy="48" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
    );
};

const LilacDivider = ({
    color = '#8E54B0',
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
        <div className="flex items-center gap-1.5 text-[#8E54B0]">
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

export const config17: BasicThemeConfig = {
    id: 'basic-17',
    name: 'Lilac Dream',
    editionTitle: 'Lilac Dream Pastel Edition',
    hashTag: '#AryaNabilaLilac',
    heroIllustration: '/assets/wedding/couple-rustic.png',

    desktopBg: 'bg-[#1E1128]',
    desktopGradient: 'from-[#120719] via-[#1E1128]/85 to-transparent',
    desktopTextColor: 'text-[#F8F3FC]',
    desktopAccentText: 'text-[#CF9EF0]',
    desktopBadgeBorder: 'border-[#CF9EF0]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#F8F3FC]',
    containerTextColor: 'text-[#281636]',
    containerId: 'basic17-scroll-container',

    accentColor: '#8E54B0',
    accentColorAlt: '#662D85',
    accentText: 'text-[#662D85]',
    accentBg: 'bg-[#8E54B0]',
    accentBorder: 'border-[#8E54B0]/30',
    accentShadow: 'shadow-[#8E54B0]/20',

    buttonPrimary: 'bg-[#8E54B0] hover:bg-[#783F99] text-white shadow-md shadow-[#8E54B0]/25 font-semibold',
    buttonSecondary: 'border border-[#8E54B0]/35 bg-white/70 text-[#662D85] hover:bg-white',

    sectionAltBg: 'bg-[#EFE3F7]',
    quoteBannerBg: 'bg-[#1E1128]',
    quoteTextColor: 'text-[#F8F3FC]',
    quoteAccentColor: 'text-[#CF9EF0]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#8E54B0]/20',
    cardTitleText: 'text-[#281636]',
    cardSubText: 'text-[#5F4673]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#8E54B0]/30',
    dockText: 'text-[#5F4673]',
    dockActiveText: 'text-[#662D85]',
    dockActiveBg: 'bg-[#8E54B0]/15',

    renderCorner: (props) => <LilacCorner {...props} />,
    renderDivider: (props) => <LilacDivider {...props} />,
};

export const BasicTheme17: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config17} />;
};

export default BasicTheme17;
