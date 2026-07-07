import { motion } from 'framer-motion';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const baseStyle =
        'inline-flex items-center justify-center font-poppins font-medium rounded-full transition-colors duration-300 focus:outline-none cursor-pointer';

    const variants = {
        primary:
            'bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg',
        secondary:
            'bg-rustic-500 hover:bg-rustic-600 text-white shadow-md hover:shadow-lg',
        outline: 'border border-gold-500 text-gold-600 hover:bg-gold-50',
        ghost: 'text-charcoal hover:bg-cream',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-xs sm:text-sm',
        md: 'px-6 py-2.5 text-sm sm:text-base',
        lg: 'px-8 py-3.5 text-base sm:text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
        >
            {children}
        </motion.button>
    );
};

export default Button;
