import React from 'react';
import type { ThemeProps } from '../elegant/ElegantTheme';
import Theme1 from '../theme-1/Theme1';

export const BurgundyBloomTheme: React.FC<ThemeProps> = (props) => {
    return <Theme1 {...props} />;
};

export default BurgundyBloomTheme;
