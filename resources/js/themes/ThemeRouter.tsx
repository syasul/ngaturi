import React from 'react';
import BurgundyBloomTheme from './burgundy-bloom/BurgundyBloomTheme';
import ElegantTheme, { type ThemeProps } from './elegant/ElegantTheme';
import ModernTheme from './modern/ModernTheme';
import RusticTheme from './rustic/RusticTheme';
import {
    BotanicalMinimalTheme,
    EditorialMonoTheme,
    RoyalYogyakartaTheme,
} from './samples/SampleDesignTheme';
import Theme1 from './theme-1/Theme1';

interface ThemeRouterProps extends ThemeProps {
    themeId: string;
}

export const ThemeRouter: React.FC<ThemeRouterProps> = ({
    themeId,
    ...props
}) => {
    // Map normalized themeId to components
    const normalizedId = (themeId || 'elegant').toLowerCase();

    if (normalizedId.includes('rustic')) {
        return <RusticTheme {...props} />;
    }

    if (normalizedId.includes('modern')) {
        return <ModernTheme {...props} />;
    }

    if (normalizedId.includes('royal-yogyakarta')) {
        return <RoyalYogyakartaTheme {...props} />;
    }

    if (normalizedId.includes('botanical-minimal')) {
        return <BotanicalMinimalTheme {...props} />;
    }

    if (normalizedId.includes('editorial-mono')) {
        return <EditorialMonoTheme {...props} />;
    }

    if (normalizedId.includes('burgundy-bloom')) {
        return <BurgundyBloomTheme {...props} />;
    }

    if (normalizedId.includes('theme-1') || normalizedId.includes('theme_1')) {
        return <Theme1 {...props} />;
    }

    // Fallback to Elegant Gold
    return <ElegantTheme {...props} />;
};

export default ThemeRouter;
