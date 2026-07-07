import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hoverable = true,
    onClick,
}) => {
    const baseStyle =
        'bg-white rounded-2xl p-6 border border-gray-100 shadow-xs transition-colors duration-300';

    if (hoverable) {
        return (
            <motion.div
                whileHover={{
                    y: -6,
                    boxShadow:
                        '0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                    borderColor: 'rgba(236, 197, 126, 0.6)',
                }}
                onClick={onClick}
                className={`${baseStyle} ${onClick ? 'cursor-pointer' : ''} ${className}`}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`${baseStyle} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default Card;
