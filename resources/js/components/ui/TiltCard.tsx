import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const TiltCard: React.FC<TiltCardProps> = ({
    children,
    className = '',
    onClick,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Mouse position relative to center of the card
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Map mouse movement to rotation degrees (-10deg to 10deg) for subtle elegant feel
    const rotateX = useTransform(y, [-150, 150], [10, -10]);
    const rotateY = useTransform(x, [-150, 150], [-10, 10]);

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left - width / 2;
        const mouseY = e.clientY - rect.top - height / 2;

        x.set(mouseX);
        y.set(mouseY);
    };

    const handleMouseLeave = () => {
        // Smooth transition back to center
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000,
            }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default TiltCard;
