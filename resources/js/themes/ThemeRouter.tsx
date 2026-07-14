import { AnimatePresence } from 'framer-motion';
import React from 'react';
import BurgundyBloomTheme from './burgundy-bloom/BurgundyBloomTheme';
import ElegantTheme, { type ThemeProps } from './elegant/ElegantTheme';
import ModernTheme from './modern/ModernTheme';
import OpeningCover from './reusable/OpeningCover';
import RusticTheme from './rustic/RusticTheme';
import {
    BotanicalMinimalTheme,
    EditorialMonoTheme,
    RoyalYogyakartaTheme,
} from './samples/SampleDesignTheme';
import Theme1 from './theme-1/Theme1';

const Theme2 = React.lazy(() => import('./theme-2/Theme2'));

interface ThemeRouterProps extends ThemeProps {
    themeId: string;
    isOpened?: boolean;
    onOpen?: () => void;
}

export const ThemeRouter: React.FC<ThemeRouterProps> = ({
    themeId,
    isOpened = true,
    onOpen,
    ...props
}) => {
    // Map normalized themeId to components
    const normalizedId = String(themeId || 'elegant').toLowerCase();

    const legacyThemeIds = [
        'elegant',
        'rustic',
        'modern',
        'royal-yogyakarta',
        'botanical-minimal',
        'editorial-mono',
    ];
    const isLegacyTheme =
        legacyThemeIds.some((id) => normalizedId.includes(id)) ||
        (!normalizedId.includes('theme-1') &&
            !normalizedId.includes('theme-2') &&
            !normalizedId.includes('premium-10') &&
            !normalizedId.includes('burgundy-bloom'));

    const renderTheme = () => {
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
            return (
                <BurgundyBloomTheme
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                />
            );
        }

        if (
            normalizedId.includes('theme-1') ||
            normalizedId.includes('theme_1')
        ) {
            return <Theme1 {...props} isOpened={isOpened} onOpen={onOpen} />;
        }

        if (
            normalizedId.includes('theme-2') ||
            normalizedId.includes('premium-10') ||
            normalizedId.includes('theme_2')
        ) {
            return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Theme2 {...props} isOpened={isOpened} onOpen={onOpen} />
                </React.Suspense>
            );
        }

        // Fallback to Elegant Gold
        return <ElegantTheme {...props} />;
    };

    return (
        <>
            <AnimatePresence>
                {isLegacyTheme && !isOpened && onOpen && (
                    <OpeningCover
                        groomName={
                            props.data?.groom?.nickname ||
                            props.data?.groom?.name ||
                            'Groom'
                        }
                        brideName={
                            props.data?.bride?.nickname ||
                            props.data?.bride?.name ||
                            'Bride'
                        }
                        guestName={props.guestName}
                        themeId={themeId}
                        onOpen={onOpen}
                    />
                )}
            </AnimatePresence>

            {(isLegacyTheme ? isOpened : true) && renderTheme()}
        </>
    );
};

export default ThemeRouter;
