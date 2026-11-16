import { Heart } from 'lucide-react';
import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Crimson Velvet Floral Corner
const CrimsonCorner = ({
    position = 'top-left',
    color = '#A3283B',
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
                d="M4 76 C16 50 36 32 76 4"
                stroke={color}
                strokeWidth="1.5"
                strokeOpacity="0.35"
                strokeLinecap="round"
            />
            {/* Rose Blossom Petals */}
            <circle cx="28" cy="28" r="8" fill={color} fillOpacity="0.4" />
            <circle cx="24" cy="24" r="5" fill={color} fillOpacity="0.6" />
            <circle cx="22" cy="22" r="2.5" fill="#FFF" fillOpacity="0.8" />
            <path d="M42 20 C46 16 52 18 54 22 C56 26 48 30 42 20 Z" fill={color} fillOpacity="0.35" />
            <path d="M20 42 C16 46 18 52 22 54 C26 56 30 48 20 42 Z" fill={color} fillOpacity="0.35" />
        </svg>
    );
};

const CrimsonDivider = ({
    color = '#A3283B',
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
        <div className="flex items-center gap-1.5 text-[#A3283B]">
            <span className="font-serif text-xs italic">&bull;</span>
            <Heart size={13} className="fill-current opacity-80" />
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

export const config13: BasicThemeConfig = {
    id: 'basic-13',
    name: 'Crimson Velvet',
    editionTitle: 'Crimson Velvet Edition',
    hashTag: '#AryaNabilaVelvet',
    heroIllustration: '/assets/wedding/hero-floral.png',

    desktopBg: 'bg-[#2A080E]',
    desktopGradient: 'from-[#1A0307] via-[#2A080E]/85 to-transparent',
    desktopTextColor: 'text-[#FFF5F5]',
    desktopAccentText: 'text-[#E58896]',
    desktopBadgeBorder: 'border-[#E58896]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#FFF8F8]',
    containerTextColor: 'text-[#30161A]',
    containerId: 'basic13-scroll-container',

    accentColor: '#A3283B',
    accentColorAlt: '#C94A58',
    accentText: 'text-[#A3283B]',
    accentBg: 'bg-[#A3283B]',
    accentBorder: 'border-[#A3283B]/30',
    accentShadow: 'shadow-[#A3283B]/25',

    buttonPrimary: 'bg-[#A3283B] hover:bg-[#851D2D] text-white shadow-md shadow-[#A3283B]/25 font-semibold',
    buttonSecondary: 'border border-[#A3283B]/35 bg-white/70 text-[#A3283B] hover:bg-white',

    sectionAltBg: 'bg-[#FBEBEB]',
    quoteBannerBg: 'bg-[#2A080E]',
    quoteTextColor: 'text-[#FFF5F5]',
    quoteAccentColor: 'text-[#E58896]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#A3283B]/20',
    cardTitleText: 'text-[#30161A]',
    cardSubText: 'text-[#754E54]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#A3283B]/30',
    dockText: 'text-[#754E54]',
    dockActiveText: 'text-[#A3283B]',
    dockActiveBg: 'bg-[#A3283B]/15',

    renderCorner: (props) => <CrimsonCorner {...props} />,
    renderDivider: (props) => <CrimsonDivider {...props} />,
};

export const BasicTheme13: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config13} />;
};

export default BasicTheme13;
