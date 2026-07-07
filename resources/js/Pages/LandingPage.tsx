import { motion } from 'framer-motion';
import React from 'react';
import Catalog from '../sections/landing/Catalog';
import CTA from '../sections/landing/CTA';
import FAQ from '../sections/landing/FAQ';
import Features from '../sections/landing/Features';
import Footer from '../sections/landing/Footer';
import Hero from '../sections/landing/Hero';
import HowItWorks from '../sections/landing/HowItWorks';
import Navbar from '../sections/landing/Navbar';
import Pricing from '../sections/landing/Pricing';
import Problem from '../sections/landing/Problem';
import Solution from '../sections/landing/Solution';
import Testimonials from '../sections/landing/Testimonials';

const scrollRevealVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            staggerChildren: 0.1,
        },
    },
};

const AnimatedSection: React.FC<{ children: React.ReactNode; id?: string }> = ({
    children,
    id,
}) => (
    <motion.div
        id={id}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={scrollRevealVariants}
        className="w-full"
    >
        {children}
    </motion.div>
);

export const LandingPage: React.FC = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-white font-sans text-charcoal">
            <Navbar />
            <main>
                <Hero />
                <AnimatedSection id="problem">
                    <Problem />
                </AnimatedSection>
                <AnimatedSection id="solution">
                    <Solution />
                </AnimatedSection>
                <AnimatedSection id="catalog">
                    <Catalog />
                </AnimatedSection>
                <AnimatedSection id="features">
                    <Features />
                </AnimatedSection>
                <AnimatedSection id="how-it-works">
                    <HowItWorks />
                </AnimatedSection>
                <AnimatedSection id="testimonials">
                    <Testimonials />
                </AnimatedSection>
                <AnimatedSection id="pricing">
                    <Pricing />
                </AnimatedSection>
                <AnimatedSection id="faq">
                    <FAQ />
                </AnimatedSection>
                <AnimatedSection id="cta">
                    <CTA />
                </AnimatedSection>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
