import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['"Playfair Display"', 'Georgia', ...defaultTheme.fontFamily.serif],
                display: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', ...defaultTheme.fontFamily.serif],
                poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
                handwriting: ['"Dancing Script"', 'cursive'],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                gold: {
                    50:  '#fdf9ee',
                    100: '#faf0d0',
                    200: '#f5dfa0',
                    300: '#efc96a',
                    400: '#e8b440',
                    500: '#C9A84C',
                    600: '#a8822c',
                    700: '#7f6020',
                    800: '#5a4318',
                    900: '#3a2b10',
                },
                rustic: {
                    50:  '#fdf5ee',
                    100: '#fae4cc',
                    200: '#f5c99a',
                    300: '#eba568',
                    400: '#df8a42',
                    500: '#d4704e',
                    600: '#b85738',
                    700: '#8f3f27',
                    800: '#662c1a',
                    900: '#421a0e',
                },
                cream: '#fdf8f0',
                sand:  '#e8dccb',
                charcoal: '#2C2C2C',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            backgroundImage: {
                'radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
            },
            keyframes: {
                marquee: {
                    '0%':   { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                'float-y': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%':      { transform: 'translateY(-18px) rotate(5deg)' },
                },
                'float-y-slow': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%':      { transform: 'translateY(-12px) rotate(-4deg)' },
                },
                'petal-fall': {
                    '0%':   { transform: 'translateY(-40px) rotate(0deg)', opacity: '0' },
                    '10%':  { opacity: '1' },
                    '90%':  { opacity: '0.6' },
                    '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
                },
                'spin-slow': {
                    from: { transform: 'rotate(0deg)' },
                    to:   { transform: 'rotate(360deg)' },
                },
                'fade-in-up': {
                    '0%':   { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
                    '50%':      { boxShadow: '0 0 0 12px rgba(201,168,76,0)' },
                },
            },
            animation: {
                'marquee':       'marquee 30s linear infinite',
                'float-y':       'float-y 6s ease-in-out infinite',
                'float-y-slow':  'float-y-slow 8s ease-in-out infinite',
                'petal-fall':    'petal-fall 8s linear infinite',
                'spin-slow':     'spin-slow 12s linear infinite',
                'fade-in-up':    'fade-in-up 0.8s ease-out forwards',
                'pulse-gold':    'pulse-gold 2s ease-in-out infinite',
            },
            transitionTimingFunction: {
                'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },

    plugins: [forms, require('@tailwindcss/container-queries')],
};

