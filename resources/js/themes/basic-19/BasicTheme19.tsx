import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import BaseBasicTheme, { type BasicThemeConfig } from '../base/BaseBasicTheme';

// Peachy Coral Blossom Corner
const CoralCorner = ({
    position = 'top-left',
    color = '#E36353',
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
            {/* Peach Blossom 5-petal flower */}
            <circle cx="28" cy="24" r="5" fill={color} fillOpacity="0.5" />
            <circle cx="22" cy="30" r="5" fill={color} fillOpacity="0.5" />
            <circle cx="34" cy="30" r="5" fill={color} fillOpacity="0.5" />
            <circle cx="25" cy="36" r="5" fill={color} fillOpacity="0.5" />
            <circle cx="31" cy="36" r="5" fill={color} fillOpacity="0.5" />
            <circle cx="28" cy="31" r="2.5" fill="#FFF" />
            <circle cx="48" cy="14" r="1.5" fill={color} fillOpacity="0.5" />
            <circle cx="14" cy="48" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
    );
};

const CoralDivider = ({
    color = '#E36353',
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
        <div className="flex items-center gap-1.5 text-[#E36353]">
            <span className="font-serif text-xs italic">&bull;</span>
            <span className="h-2 w-2 rounded-full border border-[#E36353] bg-[#E36353]" />
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

export const config19: BasicThemeConfig = {
    id: 'basic-19',
    name: 'Peachy Coral',
    editionTitle: 'Peachy Coral Blossom Edition',
    hashTag: '#AryaNabilaCoral',
    heroIllustration: '/assets/wedding/hero-floral.png',

    desktopBg: 'bg-[#29110E]',
    desktopGradient: 'from-[#190806] via-[#29110E]/85 to-transparent',
    desktopTextColor: 'text-[#FFF5EE]',
    desktopAccentText: 'text-[#FFA194]',
    desktopBadgeBorder: 'border-[#FFA194]/40',
    desktopBadgeBg: 'bg-white/5',

    containerBg: 'bg-[#FFF5EE]',
    containerTextColor: 'text-[#331713]',
    containerId: 'basic19-scroll-container',

    accentColor: '#E36353',
    accentColorAlt: '#B83E30',
    accentText: 'text-[#B83E30]',
    accentBg: 'bg-[#E36353]',
    accentBorder: 'border-[#E36353]/30',
    accentShadow: 'shadow-[#E36353]/25',

    buttonPrimary: 'bg-[#E36353] hover:bg-[#CC4F3F] text-white shadow-md shadow-[#E36353]/25 font-semibold',
    buttonSecondary: 'border border-[#E36353]/35 bg-white/70 text-[#B83E30] hover:bg-white',

    sectionAltBg: 'bg-[#FEE5D8]',
    quoteBannerBg: 'bg-[#29110E]',
    quoteTextColor: 'text-[#FFF5EE]',
    quoteAccentColor: 'text-[#FFA194]',

    cardBg: 'bg-white/85',
    cardBorder: 'border-[#E36353]/20',
    cardTitleText: 'text-[#331713]',
    cardSubText: 'text-[#734A44]',

    dockBg: 'bg-white/95',
    dockBorder: 'border-[#E36353]/30',
    dockText: 'text-[#734A44]',
    dockActiveText: 'text-[#B83E30]',
    dockActiveBg: 'bg-[#E36353]/15',

    renderCorner: (props) => <CoralCorner {...props} />,
    renderDivider: (props) => <CoralDivider {...props} />,
};

export const BasicTheme19: React.FC<ThemeProps & {
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}> = (props) => {
    return <BaseBasicTheme {...props} config={config19} />;
};

export default BasicTheme19;
