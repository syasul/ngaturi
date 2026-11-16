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
import CustomTheme1 from './custom-theme-1/CustomTheme1';
import BasicTheme1 from './basic-1/BasicTheme1';
import BasicTheme2 from './basic-2/BasicTheme2';
import BasicTheme3 from './basic-3/BasicTheme3';
import BasicTheme4 from './basic-4/BasicTheme4';
import BasicTheme5 from './basic-5/BasicTheme5';
import BasicTheme6 from './basic-6/BasicTheme6';
import BasicTheme7 from './basic-7/BasicTheme7';
import BasicTheme8 from './basic-8/BasicTheme8';
import BasicTheme9 from './basic-9/BasicTheme9';
import BasicTheme10 from './basic-10/BasicTheme10';

const Theme2 = React.lazy(() => import('./theme-2/Theme2'));
const Theme3 = React.lazy(() => import('./theme-3/Theme3'));

interface ThemeRouterProps extends ThemeProps {
    themeId: string;
    isOpened?: boolean;
    onOpen?: () => void;
    isPlayingMusic?: boolean;
    setIsPlayingMusic?: (playing: boolean) => void;
}

export const ThemeRouter: React.FC<ThemeRouterProps> = ({
    themeId,
    isOpened = true,
    onOpen,
    isPlayingMusic,
    setIsPlayingMusic,
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
            !normalizedId.includes('theme-3') &&
            !normalizedId.includes('premium-10') &&
            !normalizedId.includes('burgundy-bloom') &&
            !normalizedId.includes('custom-theme-1') &&
            !normalizedId.includes('basic'));

    const renderTheme = () => {
        if (
            normalizedId.includes('basic-10') ||
            normalizedId.includes('basic_10') ||
            normalizedId.includes('basic10')
        ) {
            return (
                <BasicTheme10
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-9') ||
            normalizedId.includes('basic_9') ||
            normalizedId.includes('basic9')
        ) {
            return (
                <BasicTheme9
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-8') ||
            normalizedId.includes('basic_8') ||
            normalizedId.includes('basic8')
        ) {
            return (
                <BasicTheme8
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-7') ||
            normalizedId.includes('basic_7') ||
            normalizedId.includes('basic7')
        ) {
            return (
                <BasicTheme7
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-6') ||
            normalizedId.includes('basic_6') ||
            normalizedId.includes('basic6')
        ) {
            return (
                <BasicTheme6
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-5') ||
            normalizedId.includes('basic_5')
        ) {
            return (
                <BasicTheme5
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-4') ||
            normalizedId.includes('basic_4')
        ) {
            return (
                <BasicTheme4
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-3') ||
            normalizedId.includes('basic_3')
        ) {
            return (
                <BasicTheme3
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-2') ||
            normalizedId.includes('basic_2')
        ) {
            return (
                <BasicTheme2
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-1') ||
            normalizedId.includes('basic_1') ||
            normalizedId.includes('basic')
        ) {
            return (
                <BasicTheme1
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }
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
            normalizedId.includes('custom-theme-1') ||
            normalizedId.includes('custom_theme_1')
        ) {
            return (
                <CustomTheme1
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('theme-1') ||
            normalizedId.includes('theme_1')
        ) {
            return (
                <Theme1
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('theme-2') ||
            normalizedId.includes('premium-10') ||
            normalizedId.includes('theme_2')
        ) {
            return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Theme2
                        {...props}
                        isOpened={isOpened}
                        onOpen={onOpen}
                        isPlayingMusic={isPlayingMusic}
                        setIsPlayingMusic={setIsPlayingMusic}
                    />
                </React.Suspense>
            );
        }

        if (
            normalizedId.includes('theme-3') ||
            normalizedId.includes('theme_3')
        ) {
            return (
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Theme3
                        {...props}
                        isOpened={isOpened}
                        onOpen={onOpen}
                        isPlayingMusic={isPlayingMusic}
                        setIsPlayingMusic={setIsPlayingMusic}
                    />
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
                        monogramUrl={props.data?.customStyle?.monogramUrl || props.data?.customStyle?.monogramUrlDark}
                        onOpen={onOpen}
                    />
                )}
            </AnimatePresence>

            {(isLegacyTheme ? isOpened : true) && renderTheme()}
        </>
    );
};

export default ThemeRouter;
