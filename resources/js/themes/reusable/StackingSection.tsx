import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'framer-motion';
import React, { useRef } from 'react';

export interface StackingSectionProps {
    id: string;
    zIndex: number;
    bg: string;
    pattern?: string;
    roundedVal?: string;
    borderTop?: string;
    boxShadow?: string;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export const StackingSection: React.FC<StackingSectionProps> = ({
    id,
    zIndex,
    bg,
    pattern,
    roundedVal = '2.5rem',
    borderTop,
    boxShadow,
    className = '',
    style = {},
    children,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    // Track scroll progress of this specific section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    // Track global scroll velocity
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 60,
        stiffness: 250,
        mass: 0.4,
    });

    // Map velocity to dynamic transforms (skew and elastic scale) for scroll feedback
    const skewY = useTransform(
        smoothVelocity,
        [-3000, 3000],
        prefersReducedMotion ? [0, 0] : [-0.7, 0.7],
    );
    const scaleY = useTransform(
        smoothVelocity,
        [-3000, 3000],
        prefersReducedMotion ? [1, 1] : [0.995, 1.005],
    );

    // Map progress to card-stacking depth transforms (scaling down & dimming overlay)
    const scale = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? [1, 1] : [1, 0.94],
    );
    const y = useTransform(
        scrollYProgress,
        [0, 1],
        prefersReducedMotion ? [0, 0] : [0, -18],
    );
    const opacityOverlay = useTransform(scrollYProgress, [0, 0.85], [0, 0.45]);
    const revealOpacity = useTransform(
        scrollYProgress,
        [0, 0.12, 0.9],
        [0.45, 0, 0],
    );

    return (
        <div
            ref={containerRef}
            data-section-id={id}
            className={`relative flex w-full flex-col items-center justify-center overflow-hidden ${className}`}
            style={{
                position: 'sticky',
                top: 0,
                zIndex,
                minHeight: '100dvh',
                height: '100dvh',
                background: bg,
                backgroundImage: pattern || 'none',
                borderRadius: roundedVal,
                borderTop,
                boxShadow,
                ...style,
            }}
        >
            <motion.div
                className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-4 py-10"
                style={{
                    scale,
                    y,
                    skewY,
                    scaleY,
                    transformOrigin: 'center center',
                }}
            >
                <motion.div
                    initial={
                        prefersReducedMotion
                            ? false
                            : { opacity: 0, y: 28, scale: 0.98 }
                    }
                    whileInView={
                        prefersReducedMotion
                            ? undefined
                            : { opacity: 1, y: 0, scale: 1 }
                    }
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 mx-auto my-auto flex w-full max-w-2xl flex-col items-center justify-center"
                >
                    {children}
                </motion.div>

                <motion.div
                    className="pointer-events-none absolute inset-0 z-[98]"
                    style={{
                        opacity: revealOpacity,
                        background:
                            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.28), transparent 35%), linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)',
                    }}
                />

                {/* Dimming overlay when card gets stacked underneath */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-[99] bg-black"
                    style={{ opacity: opacityOverlay }}
                />
            </motion.div>
        </div>
    );
};

export default StackingSection;
