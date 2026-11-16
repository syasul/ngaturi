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
import BasicTheme11 from './basic-11/BasicTheme11';
import BasicTheme12 from './basic-12/BasicTheme12';
import BasicTheme13 from './basic-13/BasicTheme13';
import BasicTheme14 from './basic-14/BasicTheme14';
import BasicTheme15 from './basic-15/BasicTheme15';
import BasicTheme16 from './basic-16/BasicTheme16';
import BasicTheme17 from './basic-17/BasicTheme17';
import BasicTheme18 from './basic-18/BasicTheme18';
import BasicTheme19 from './basic-19/BasicTheme19';
import BasicTheme20 from './basic-20/BasicTheme20';

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
            normalizedId.includes('basic-20') ||
            normalizedId.includes('basic_20') ||
            normalizedId.includes('basic20')
        ) {
            return (
                <BasicTheme20
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-19') ||
            normalizedId.includes('basic_19') ||
            normalizedId.includes('basic19')
        ) {
            return (
                <BasicTheme19
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-18') ||
            normalizedId.includes('basic_18') ||
            normalizedId.includes('basic18')
        ) {
            return (
                <BasicTheme18
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-17') ||
            normalizedId.includes('basic_17') ||
            normalizedId.includes('basic17')
        ) {
            return (
                <BasicTheme17
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-16') ||
            normalizedId.includes('basic_16') ||
            normalizedId.includes('basic16')
        ) {
            return (
                <BasicTheme16
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-15') ||
            normalizedId.includes('basic_15') ||
            normalizedId.includes('basic15')
        ) {
            return (
                <BasicTheme15
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-14') ||
            normalizedId.includes('basic_14') ||
            normalizedId.includes('basic14')
        ) {
            return (
                <BasicTheme14
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-13') ||
            normalizedId.includes('basic_13') ||
            normalizedId.includes('basic13')
        ) {
            return (
                <BasicTheme13
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-12') ||
            normalizedId.includes('basic_12') ||
            normalizedId.includes('basic12')
        ) {
            return (
                <BasicTheme12
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

        if (
            normalizedId.includes('basic-11') ||
            normalizedId.includes('basic_11') ||
            normalizedId.includes('basic11')
        ) {
            return (
                <BasicTheme11
                    {...props}
                    isOpened={isOpened}
                    onOpen={onOpen}
                    isPlayingMusic={isPlayingMusic}
                    setIsPlayingMusic={setIsPlayingMusic}
                />
            );
        }

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
