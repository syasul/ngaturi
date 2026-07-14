import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import Theme1 from '../theme-1/Theme1';

interface BurgundyBloomThemeProps extends ThemeProps {
    isOpened?: boolean;
    onOpen?: () => void;
}

export const BurgundyBloomTheme: React.FC<BurgundyBloomThemeProps> = (
    props,
) => {
    return <Theme1 {...props} />;
};

export default BurgundyBloomTheme;
