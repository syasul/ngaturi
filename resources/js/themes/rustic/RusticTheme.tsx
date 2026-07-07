import type { WeddingData } from '@wedding/shared';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';
import React from 'react';
import Card from '../../components/ui/Card';
import CountdownTimer from '../reusable/CountdownTimer';
import GuestWishes from '../reusable/GuestWishes';
import MapEmbed from '../reusable/MapEmbed';
import PhotoGallery from '../reusable/PhotoGallery';
import RSVPForm from '../reusable/RSVPForm';
import StackingSection from '../reusable/StackingSection';

export interface ThemeProps {
    data: WeddingData | any;
    weddingId: string;
    photos?: any[];
    guestName?: string;
    guestToken?: string;
    wishes: any[];
    onRsvpSubmit: (rsvpStatus: string, message: string) => Promise<void>;
}

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.05,
        },
    },
};

const childFadeUp: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' as any },
    },
};

const childScaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: 'easeOut' as any },
    },
};

export const RusticTheme: React.FC<ThemeProps> = ({
    data,
    weddingId,
    photos = [],
    guestName,
    guestToken,
    wishes,
    onRsvpSubmit,
}) => {
    const groom = data?.groom || {};
    const bride = data?.bride || {};
    const schedules = data?.schedules || data?.schedule || {};
    const stories = data?.stories || [];
    const quotes = data?.quotes || {};

    const getParents = (person: any) => {
        if (person.fatherName && person.motherName) {
            return `Putra dari Bpk. ${person.fatherName} & Ibu ${person.motherName}`;
        }
        return person.parents || '';
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const custom = data?.customStyle || {};
    const primaryColor = custom.primaryColor || '#8B6914';
    const secondaryColor = custom.secondaryColor || '#D4956A';
    const baseBg = custom.baseBg || '#F5EDE3';
    const panelBg = custom.panelBg || '#FAF6F0';
    const textColor = custom.textColor || '#3D352E';

    const titleFontFamily =
        custom.titleFont === 'font-sans'
            ? "'Poppins', sans-serif"
            : custom.titleFont === 'font-serif'
              ? "'Cormorant Garamond', Georgia, serif"
              : "'Dancing Script', cursive";

    const bodyFontFamily =
        custom.bodyFont === 'font-serif'
            ? "'Lora', serif"
            : "'Poppins', sans-serif";

    return (
        <div
            id={`wedding-theme-rustic-${weddingId}`}
            className="relative select-none bg-[#F5EDE3] font-sans text-[#3D352E]"
        >
            <style>{`
        #wedding-theme-rustic-${weddingId} {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
          --base-bg: ${baseBg};
          --panel-bg: ${panelBg};
          --text-color: ${textColor};
          --font-title: ${titleFontFamily};
          --font-body: ${bodyFontFamily};
        }
        #wedding-theme-rustic-${weddingId} .text-\\[\\#8B6914\\] { color: var(--primary-color) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#8B6914\\] { background-color: var(--primary-color) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#8B6914\\]\\/10 { background-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1) !important; }
        #wedding-theme-rustic-${weddingId} .fill-\\[\\#8B6914\\] { fill: var(--primary-color) !important; }
        #wedding-theme-rustic-${weddingId} .fill-\\[\\#8B6914\\]\\/10 { fill: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1) !important; }
        #wedding-theme-rustic-${weddingId} .text-\\[\\#D4956A\\] { color: var(--secondary-color) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#D4956A\\] { background-color: var(--secondary-color) !important; }
        #wedding-theme-rustic-${weddingId} .border-\\[\\#D4956A\\] { border-color: var(--secondary-color) !important; }
        #wedding-theme-rustic-${weddingId} .border-\\[\\#D4956A\\]\\/20 { border-color: rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.20) !important; }
        #wedding-theme-rustic-${weddingId} .border-\\[\\#D4956A\\]\\/30 { border-color: rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.30) !important; }
        #wedding-theme-rustic-${weddingId} .border-\\[\\#D4956A\\]\\/40 { border-color: rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.40) !important; }
        #wedding-theme-rustic-${weddingId} .border-\\[\\#D4956A\\]\\/50 { border-color: rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.50) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#D4956A\\]\\/10 { background-color: rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.1) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#D4956A\\]\\/20 { background-color: rgba(${parseInt(secondaryColor.slice(1, 3), 16)}, ${parseInt(secondaryColor.slice(3, 5), 16)}, ${parseInt(secondaryColor.slice(5, 7), 16)}, 0.2) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#F5EDE3\\] { background-color: var(--base-bg) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#FAF6F0\\] { background-color: var(--panel-bg) !important; }
        #wedding-theme-rustic-${weddingId} .bg-\\[\\#FAF6F0\\]\\/90 { background-color: rgba(${parseInt(panelBg.slice(1, 3), 16)}, ${parseInt(panelBg.slice(3, 5), 16)}, ${parseInt(panelBg.slice(5, 7), 16)}, 0.9) !important; }
        #wedding-theme-rustic-${weddingId} .text-\\[\\#3D352E\\] { color: var(--text-color) !important; }
        #wedding-theme-rustic-${weddingId} .text-\\[\\#3D352E\\]\\/70 { color: rgba(${parseInt(textColor.slice(1, 3), 16)}, ${parseInt(textColor.slice(3, 5), 16)}, ${parseInt(textColor.slice(5, 7), 16)}, 0.7) !important; }
        #wedding-theme-rustic-${weddingId} .text-\\[\\#3D352E\\]\\/80 { color: rgba(${parseInt(textColor.slice(1, 3), 16)}, ${parseInt(textColor.slice(3, 5), 16)}, ${parseInt(textColor.slice(5, 7), 16)}, 0.8) !important; }
        #wedding-theme-rustic-${weddingId} .font-cursive { font-family: var(--font-title) !important; }
        #wedding-theme-rustic-${weddingId} .font-sans { font-family: var(--font-body) !important; }
      `}</style>

            {/* Section 1: Hero Header */}
            <StackingSection
                id="hero"
                zIndex={10}
                bg="#F5EDE3"
                roundedVal="0px"
            >
                {/* Leaves ornament top-left */}
                <div className="pointer-events-none absolute left-0 top-0 h-36 w-36 bg-[url('/ornaments/rustic-leaves-left.png')] bg-contain bg-no-repeat opacity-15" />

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="relative z-10 mx-auto w-full max-w-2xl space-y-6 px-6 py-12 text-center"
                >
                    <motion.div
                        variants={childScaleIn}
                        className="mx-auto flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-[#8B6914]/10 text-[#8B6914]"
                    >
                        <Heart size={18} className="fill-[#8B6914]/10" />
                    </motion.div>
                    <motion.span
                        variants={childFadeUp}
                        className="block text-[10px] font-bold uppercase tracking-widest text-[#D4956A]"
                    >
                        Pernikahan Rustic Bohemian
                    </motion.span>
                    <motion.h1
                        variants={childFadeUp}
                        className="font-cursive text-5xl font-bold text-[#8B6914] md:text-6xl"
                    >
                        {groom.nickname || groom.name} &{' '}
                        {bride.nickname || bride.name}
                    </motion.h1>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto h-0.5 w-16 bg-[#D4956A]/60"
                    />
                    <motion.p
                        variants={childFadeUp}
                        className="mx-auto max-w-md px-4 font-sans text-xs italic leading-relaxed text-[#3D352E]/70"
                    >
                        "
                        {quotes.text ||
                            'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya...'}
                        "
                        {quotes.source && (
                            <span className="mt-1 block font-bold not-italic text-[#8B6914]">
                                — {quotes.source}
                            </span>
                        )}
                    </motion.p>
                </motion.div>
            </StackingSection>

            {/* Section 2: Countdown */}
            {schedules.akad?.date && (
                <StackingSection
                    id="countdown"
                    zIndex={20}
                    bg="#FAF6F0"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                        className="mx-auto w-full max-w-2xl px-6 py-12 text-center"
                    >
                        <motion.span
                            variants={childFadeUp}
                            className="text-[9px] font-bold uppercase tracking-widest text-[#8B6914]"
                        >
                            Menuju Hari Istimewa
                        </motion.span>
                        <motion.div variants={childScaleIn} className="mt-4">
                            <CountdownTimer targetDate={schedules.akad.date} />
                        </motion.div>
                    </motion.div>
                </StackingSection>
            )}

            {/* Section 3: Mempelai */}
            <StackingSection
                id="couple"
                zIndex={30}
                bg="#F5EDE3"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12"
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <h3 className="font-cursive text-3xl font-bold text-[#8B6914]">
                            Mempelai Kami
                        </h3>
                        <div className="mx-auto mt-2 h-0.5 w-10 bg-[#D4956A]/50" />
                    </motion.div>

                    <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Groom Card */}
                        <motion.div variants={childScaleIn}>
                            <Card className="space-y-4 rounded-3xl border border-[#D4956A]/30 bg-[#FAF6F0]/90 p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-[#D4956A]/40 bg-[#FAF6F0] p-1">
                                    {groom.photoUrl || groom.photo ? (
                                        <img
                                            src={groom.photoUrl || groom.photo}
                                            alt={groom.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="font-cursive flex h-full w-full items-center justify-center rounded-full bg-[#D4956A]/10 text-4xl font-bold text-[#8B6914]">
                                            {
                                                (groom.nickname ||
                                                    groom.name)?.[0]
                                            }
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-cursive text-2xl font-bold text-[#8B6914]">
                                    {groom.fullName || groom.name}
                                </h4>
                                <p className="text-[10px] font-bold text-charcoal/50">
                                    {getParents(groom)}
                                </p>
                                {groom.bio && (
                                    <p className="text-xs italic leading-relaxed text-[#3D352E]/70">
                                        "{groom.bio}"
                                    </p>
                                )}
                                {groom.instagram && (
                                    <a
                                        href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#8B6914] hover:underline"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="14"
                                            height="14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="inline-block"
                                        >
                                            <rect
                                                x="2"
                                                y="2"
                                                width="20"
                                                height="20"
                                                rx="5"
                                                ry="5"
                                            ></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line
                                                x1="17.5"
                                                y1="6.5"
                                                x2="17.51"
                                                y2="6.5"
                                            ></line>
                                        </svg>
                                        <span>{groom.instagram}</span>
                                    </a>
                                )}
                            </Card>
                        </motion.div>

                        {/* Bride Card */}
                        <motion.div variants={childScaleIn}>
                            <Card className="space-y-4 rounded-3xl border border-[#D4956A]/30 bg-[#FAF6F0]/90 p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-[#D4956A]/40 bg-[#FAF6F0] p-1">
                                    {bride.photoUrl || bride.photo ? (
                                        <img
                                            src={bride.photoUrl || bride.photo}
                                            alt={bride.name}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="font-cursive flex h-full w-full items-center justify-center rounded-full bg-[#D4956A]/10 text-4xl font-bold text-[#8B6914]">
                                            {
                                                (bride.nickname ||
                                                    bride.name)?.[0]
                                            }
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-cursive text-2xl font-bold text-[#8B6914]">
                                    {bride.fullName || bride.name}
                                </h4>
                                <p className="text-[10px] font-bold text-charcoal/50">
                                    {getParents(bride)}
                                </p>
                                {bride.bio && (
                                    <p className="text-xs italic leading-relaxed text-[#3D352E]/70">
                                        "{bride.bio}"
                                    </p>
                                )}
                                {bride.instagram && (
                                    <a
                                        href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#8B6914] hover:underline"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="14"
                                            height="14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="inline-block"
                                        >
                                            <rect
                                                x="2"
                                                y="2"
                                                width="20"
                                                height="20"
                                                rx="5"
                                                ry="5"
                                            ></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line
                                                x1="17.5"
                                                y1="6.5"
                                                x2="17.51"
                                                y2="6.5"
                                            ></line>
                                        </svg>
                                        <span>{bride.instagram}</span>
                                    </a>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </StackingSection>

            {/* Section 4: Jadwal */}
            <StackingSection
                id="events"
                zIndex={40}
                bg="#FAF6F0"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl animate-none space-y-8 px-6 py-12"
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <h3 className="font-cursive text-3xl font-bold text-[#8B6914]">
                            Agenda Hari H
                        </h3>
                        <div className="mx-auto mt-2 h-0.5 w-10 bg-[#D4956A]/50" />
                    </motion.div>

                    <div className="mt-6 grid grid-cols-1 gap-8 text-left md:grid-cols-2">
                        {/* Akad */}
                        {schedules.akad && (
                            <motion.div variants={childScaleIn}>
                                <Card className="animate-none space-y-4 rounded-3xl border border-[#D4956A]/30 bg-[#FAF6F0] p-6 shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-[#D4956A]/20 pb-3">
                                        <Calendar
                                            className="text-[#8B6914]"
                                            size={20}
                                        />
                                        <h4 className="font-serif text-lg font-bold text-[#8B6914]">
                                            Akad Nikah
                                        </h4>
                                    </div>
                                    <div className="space-y-2 text-xs text-charcoal/80">
                                        <p>
                                            <strong>Tanggal:</strong>{' '}
                                            {formatDate(schedules.akad.date)}
                                        </p>
                                        <p>
                                            <strong>Waktu:</strong>{' '}
                                            {schedules.akad.timeStart ||
                                                schedules.akad.time}{' '}
                                            -{' '}
                                            {schedules.akad.timeEnd ||
                                                'Selesai'}
                                        </p>
                                        <p>
                                            <strong>Lokasi:</strong>{' '}
                                            {schedules.akad.placeName ||
                                                schedules.akad.venue}
                                        </p>
                                        <p className="leading-relaxed">
                                            <strong>Alamat:</strong>{' '}
                                            {schedules.akad.address}
                                        </p>
                                    </div>
                                    <MapEmbed
                                        url={
                                            schedules.akad.googleMapsUrl ||
                                            schedules.akad.maps
                                        }
                                        placeName={schedules.akad.placeName}
                                        address={schedules.akad.address}
                                    />
                                </Card>
                            </motion.div>
                        )}

                        {/* Resepsi */}
                        {schedules.resepsi && (
                            <motion.div variants={childScaleIn}>
                                <Card className="animate-none space-y-4 rounded-3xl border border-[#D4956A]/30 bg-[#FAF6F0] p-6 shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-[#D4956A]/20 pb-3">
                                        <Calendar
                                            className="text-[#8B6914]"
                                            size={20}
                                        />
                                        <h4 className="font-serif text-lg font-bold text-[#8B6914]">
                                            Resepsi
                                        </h4>
                                    </div>
                                    <div className="space-y-2 text-xs text-charcoal/80">
                                        <p>
                                            <strong>Tanggal:</strong>{' '}
                                            {formatDate(schedules.resepsi.date)}
                                        </p>
                                        <p>
                                            <strong>Waktu:</strong>{' '}
                                            {schedules.resepsi.timeStart ||
                                                schedules.resepsi.time}{' '}
                                            -{' '}
                                            {schedules.resepsi.timeEnd ||
                                                'Selesai'}
                                        </p>
                                        <p>
                                            <strong>Lokasi:</strong>{' '}
                                            {schedules.resepsi.placeName ||
                                                schedules.resepsi.venue}
                                        </p>
                                        <p className="leading-relaxed">
                                            <strong>Alamat:</strong>{' '}
                                            {schedules.resepsi.address}
                                        </p>
                                    </div>
                                    <MapEmbed
                                        url={
                                            schedules.resepsi.googleMapsUrl ||
                                            schedules.resepsi.maps
                                        }
                                        placeName={schedules.resepsi.placeName}
                                        address={schedules.resepsi.address}
                                    />
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </StackingSection>

            {/* Section 5: Kisah */}
            {stories.length > 0 && (
                <StackingSection
                    id="story"
                    zIndex={50}
                    bg="#F5EDE3"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                        className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12"
                    >
                        <motion.div
                            className="text-center"
                            variants={childFadeUp}
                        >
                            <h3 className="font-cursive text-3xl font-bold text-[#8B6914]">
                                Cerita Kita
                            </h3>
                            <div className="mx-auto mt-2 h-0.5 w-10 bg-[#D4956A]/50" />
                        </motion.div>

                        <div className="relative ml-4 mt-6 space-y-8 border-l-2 border-[#D4956A]/30 pl-6 text-left">
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    variants={childFadeUp}
                                    className="relative space-y-2"
                                >
                                    <div className="absolute -left-[32px] top-1.5 flex w-4 items-center justify-center rounded-full border-2 border-[#8B6914] bg-[#F5EDE3]">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#8B6914]" />
                                    </div>
                                    <div className="inline-block rounded bg-[#8B6914]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#8B6914]">
                                        {story.date || story.year}
                                    </div>
                                    <h4 className="font-serif text-sm font-bold text-[#8B6914]">
                                        {story.title}
                                    </h4>
                                    <p className="text-xs leading-relaxed text-[#3D352E]/80">
                                        {story.content || story.story}
                                    </p>
                                    {story.imageUrl && (
                                        <img
                                            src={story.imageUrl}
                                            alt={story.title}
                                            className="mt-2 max-h-48 w-full rounded-xl border border-[#D4956A]/20 object-cover shadow-sm"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </StackingSection>
            )}

            {/* Section 6: Galeri */}
            {photos.length > 0 && (
                <StackingSection
                    id="gallery"
                    zIndex={60}
                    bg="#FAF6F0"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                        className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12"
                    >
                        <motion.div
                            className="text-center"
                            variants={childFadeUp}
                        >
                            <h3 className="font-cursive text-3xl font-bold text-[#8B6914]">
                                Memori Bahagia
                            </h3>
                            <div className="mx-auto mt-2 h-0.5 w-10 bg-[#D4956A]/50" />
                        </motion.div>
                        <motion.div variants={childScaleIn}>
                            <PhotoGallery photos={photos} />
                        </motion.div>
                    </motion.div>
                </StackingSection>
            )}

            {/* Section 7: RSVP */}
            <StackingSection
                id="rsvp"
                zIndex={70}
                bg="#F5EDE3"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12"
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <h3 className="font-cursive text-3xl font-bold text-[#8B6914]">
                            Kehadiran Tamu
                        </h3>
                        <div className="mx-auto mt-2 h-0.5 w-10 bg-[#D4956A]/50" />
                    </motion.div>
                    <motion.div variants={childScaleIn}>
                        <RSVPForm
                            guestName={guestName}
                            guestToken={guestToken}
                            onRsvpSubmit={onRsvpSubmit}
                            initialStatus="hadir"
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>

            {/* Section 8: Wishes */}
            <StackingSection
                id="wishes"
                zIndex={80}
                bg="#FAF6F0"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                {/* Leaves ornament bottom-right */}
                <div className="pointer-events-none absolute bottom-0 right-0 h-36 w-36 bg-[url('/ornaments/rustic-leaves-right.png')] bg-contain bg-no-repeat opacity-15" />

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="relative z-10 mx-auto w-full max-w-2xl space-y-8 px-6 py-12"
                >
                    <motion.div variants={childFadeUp} className="w-full">
                        <GuestWishes
                            initialWishes={wishes}
                            weddingId={weddingId}
                        />
                    </motion.div>
                </motion.div>
            </StackingSection>
        </div>
    );
};

export default RusticTheme;
