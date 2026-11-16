import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Scandinavian Pine Branch Corner
const PineCorner = ({
    position = 'top-left',
    color = '#2E5E45',
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
            {/* Pine Needle Tufts */}
            <path d="M26 36 L16 30 M26 36 L18 24 M26 36 L24 20" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
            <path d="M42 22 L34 14 M42 22 L38 8 M42 22 L44 6" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
            <ellipse cx="28" cy="38" rx="4" ry="6" transform="rotate(-30 28 38)" fill="#B89368" fillOpacity="0.6" />
        </svg>
    );
};

const PineDivider = ({
    color = '#2E5E45',
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
        <div className="flex items-center gap-1.5 text-[#2E5E45]">
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-2 w-2 rounded-full border border-[#2E5E45] bg-[#B89368]/60" />
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

export const config14: BasicThemeConfig = {
    id: 'basic-14',
    name: 'Nordic Pine',
    editionTitle: 'Nordic Pine & Birchwood Edition',
    hashTag: '#AryaNabilaNordic',
    heroIllustration: '/assets/wedding/couple-foliage.png',

    desktopBg: 'bg-[#12241B]',
    desktopGradient: 'from-[#0A1610] via-[#12241B]/85 to-transparent',
    desktopTextColor: 'text-[#F4F8F5]',
    desktopAccentText: 'text-[#D2B28A]',
    desktopBadgeBorder: 'border-[#D2B28A]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#F4F8F5]',
    containerTextColor: 'text-[#172D21]',
    containerId: 'basic14-scroll-container',

    accentColor: '#2E5E45',
    accentColorAlt: '#B89368',
    accentText: 'text-[#2E5E45]',
    accentBg: 'bg-[#2E5E45]',
    accentBorder: 'border-[#2E5E45]/25',
    accentShadow: 'shadow-[#2E5E45]/20',

    buttonPrimary: 'bg-[#2E5E45] hover:bg-[#234A36] text-white shadow-md shadow-[#2E5E45]/25 font-semibold',
    buttonSecondary: 'border border-[#2E5E45]/35 bg-white/70 text-[#2E5E45] hover:bg-white',

    sectionAltBg: 'bg-[#E7EFE9]',
    quoteBannerBg: 'bg-[#12241B]',
    quoteTextColor: 'text-[#F4F8F5]',
    quoteAccentColor: 'text-[#D2B28A]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#2E5E45]/20',
    cardTitleText: 'text-[#172D21]',
    cardSubText: 'text-[#4D6558]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#2E5E45]/25',
    dockText: 'text-[#4D6558]',
    dockActiveText: 'text-[#2E5E45]',
    dockActiveBg: 'bg-[#2E5E45]/15',

    renderCorner: (props) => <PineCorner {...props} />,
    renderDivider: (props) => <PineDivider {...props} />,
};

export const BasicTheme14: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config14} />;
};

export default BasicTheme14;
