import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Autumn Maple Leaf Corner
const AmberCorner = ({
    position = 'top-left',
    color = '#B87333',
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
                d="M6 74 C16 48 38 24 74 6"
                stroke={color}
                strokeWidth="1.6"
                strokeOpacity="0.4"
                strokeLinecap="round"
            />
            {/* Maple / Oak Autumn Leaf */}
            <path
                d="M24 38 C20 30 26 22 34 26 C38 18 46 22 46 30 C54 32 50 42 42 44 C34 48 28 44 24 38 Z"
                fill={color}
                fillOpacity="0.4"
            />
            <path d="M24 44 L16 52" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
            <circle cx="52" cy="18" r="2" fill={color} fillOpacity="0.5" />
            <circle cx="18" cy="52" r="2" fill={color} fillOpacity="0.5" />
        </svg>
    );
};

const AmberDivider = ({
    color = '#B87333',
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
        <div className="flex items-center gap-1.5 text-[#B87333]">
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-2 w-2 rounded-full bg-[#B87333]/80" />
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

export const config16: BasicThemeConfig = {
    id: 'basic-16',
    name: 'Warm Amber',
    editionTitle: 'Warm Amber Autumn Edition',
    hashTag: '#AryaNabilaAmber',
    heroIllustration: '/assets/wedding/couple-rustic.png',

    desktopBg: 'bg-[#21140A]',
    desktopGradient: 'from-[#140A04] via-[#21140A]/85 to-transparent',
    desktopTextColor: 'text-[#FDF7ED]',
    desktopAccentText: 'text-[#E5A86B]',
    desktopBadgeBorder: 'border-[#E5A86B]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#FDF7ED]',
    containerTextColor: 'text-[#2D1B0F]',
    containerId: 'basic16-scroll-container',

    accentColor: '#B87333',
    accentColorAlt: '#91531C',
    accentText: 'text-[#91531C]',
    accentBg: 'bg-[#B87333]',
    accentBorder: 'border-[#B87333]/30',
    accentShadow: 'shadow-[#B87333]/25',

    buttonPrimary: 'bg-[#B87333] hover:bg-[#9E5E24] text-white shadow-md shadow-[#B87333]/25 font-semibold',
    buttonSecondary: 'border border-[#B87333]/35 bg-white/70 text-[#91531C] hover:bg-white',

    sectionAltBg: 'bg-[#F7EBD8]',
    quoteBannerBg: 'bg-[#21140A]',
    quoteTextColor: 'text-[#FDF7ED]',
    quoteAccentColor: 'text-[#E5A86B]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#B87333]/20',
    cardTitleText: 'text-[#2D1B0F]',
    cardSubText: 'text-[#694E3B]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#B87333]/30',
    dockText: 'text-[#694E3B]',
    dockActiveText: 'text-[#91531C]',
    dockActiveBg: 'bg-[#B87333]/15',

    renderCorner: (props) => <AmberCorner {...props} />,
    renderDivider: (props) => <AmberDivider {...props} />,
};

export const BasicTheme16: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config16} />;
};

export default BasicTheme16;
