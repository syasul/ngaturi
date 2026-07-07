import type { WeddingData } from '@wedding/shared';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
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
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

const childFadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as any },
    },
};

const childScaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' as any },
    },
};

export const ModernTheme: React.FC<ThemeProps> = ({
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
    const primaryColor = custom.primaryColor || '#D4A0A0';
    const secondaryColor = custom.secondaryColor || '#E2C2C2';
    const baseBg = custom.baseBg || '#ffffff';
    const panelBg = custom.panelBg || '#F8F8F8';
    const textColor = custom.textColor || '#111111';

    const titleFontFamily =
        custom.titleFont === 'font-sans'
            ? "'Poppins', sans-serif"
            : custom.titleFont === 'font-cursive'
              ? "'Dancing Script', cursive"
              : "'Cormorant Garamond', Georgia, serif";

    const bodyFontFamily =
        custom.bodyFont === 'font-serif'
            ? "'Lora', serif"
            : "'Poppins', sans-serif";

    return (
        <div
            id={`wedding-theme-modern-${weddingId}`}
            className="relative select-none bg-white font-sans text-[#111111]"
        >
            <style>{`
        #wedding-theme-modern-${weddingId} {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
          --base-bg: ${baseBg};
          --panel-bg: ${panelBg};
          --text-color: ${textColor};
          --font-title: ${titleFontFamily};
          --font-body: ${bodyFontFamily};
        }
        #wedding-theme-modern-${weddingId} .text-\\[\\#D4A0A0\\] { color: var(--primary-color) !important; }
        #wedding-theme-modern-${weddingId} .bg-\\[\\#D4A0A0\\] { background-color: var(--primary-color) !important; }
        #wedding-theme-modern-${weddingId} .bg-\\[\\#D4A0A0\\]\\/10 { background-color: rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1) !important; }
        #wedding-theme-modern-${weddingId} .border-\\[\\#D4A0A0\\] { border-color: var(--primary-color) !important; }
        #wedding-theme-modern-${weddingId} .fill-\\[\\#D4A0A0\\] { fill: var(--primary-color) !important; }
        
        #wedding-theme-modern-${weddingId} .bg-white { background-color: var(--base-bg) !important; }
        #wedding-theme-modern-${weddingId} .bg-\\[\\#ffffff\\] { background-color: var(--base-bg) !important; }
        #wedding-theme-modern-${weddingId} .bg-\\[\\#F8F8F8\\] { background-color: var(--panel-bg) !important; }
        
        #wedding-theme-modern-${weddingId} .text-\\[\\#111111\\] { color: var(--text-color) !important; }
        #wedding-theme-modern-${weddingId} .font-serif { font-family: var(--font-title) !important; }
        #wedding-theme-modern-${weddingId} .font-sans { font-family: var(--font-body) !important; }
      `}</style>

            {/* Section 1: Hero Header */}
            <StackingSection
                id="hero"
                zIndex={10}
                bg="#ffffff"
                roundedVal="0px"
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12 text-center"
                >
                    <motion.span
                        variants={childFadeUp}
                        className="block text-[10px] font-bold uppercase tracking-widest text-[#D4A0A0]"
                    >
                        JOIN US TO CELEBRATE
                    </motion.span>
                    <motion.h1
                        variants={childFadeUp}
                        className="text-5xl font-black uppercase leading-none tracking-tight text-neutral-900 md:text-6xl"
                    >
                        {groom.nickname || groom.name}
                        <br />
                        <span className="my-2 block font-serif text-3xl font-light lowercase italic text-[#D4A0A0]">
                            &amp;
                        </span>
                        {bride.nickname || bride.name}
                    </motion.h1>
                    <motion.div
                        variants={childFadeUp}
                        className="mx-auto mt-4 h-0.5 w-12 bg-neutral-900"
                    />
                    {quotes.text && (
                        <motion.p
                            variants={childFadeUp}
                            className="mx-auto max-w-md px-6 pt-2 font-sans text-xs leading-relaxed text-neutral-500"
                        >
                            "{quotes.text}"
                            {quotes.source && (
                                <span className="mt-1.5 block font-semibold text-neutral-800">
                                    — {quotes.source}
                                </span>
                            )}
                        </motion.p>
                    )}
                </motion.div>
            </StackingSection>

            {/* Section 2: Countdown */}
            {schedules.akad?.date && (
                <StackingSection
                    id="countdown"
                    zIndex={20}
                    bg="#F8F8F8"
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
                            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                        >
                            COUNTDOWN TO THE BIG DAY
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
                bg="#ffffff"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-12 px-6 py-12"
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-950">
                            THE COUPLE
                        </h3>
                        <div className="mx-auto mt-1 h-0.5 w-8 bg-neutral-900" />
                    </motion.div>

                    <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
                        {/* Groom Card */}
                        <motion.div variants={childScaleIn}>
                            <Card className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 text-center shadow-none">
                                <div className="mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-0.5">
                                    {groom.photoUrl || groom.photo ? (
                                        <img
                                            src={groom.photoUrl || groom.photo}
                                            alt={groom.name}
                                            className="h-full w-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-200 font-bold text-neutral-400">
                                            {
                                                (groom.nickname ||
                                                    groom.name)?.[0]
                                            }
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold uppercase tracking-tight text-neutral-900">
                                    {groom.fullName || groom.name}
                                </h4>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                                    {getParents(groom)}
                                </p>
                                {groom.bio && (
                                    <p className="text-xs font-light leading-relaxed text-neutral-600">
                                        {groom.bio}
                                    </p>
                                )}
                                {groom.instagram && (
                                    <a
                                        href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#D4A0A0] hover:underline"
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
                            <Card className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 text-center shadow-none">
                                <div className="mx-auto h-28 w-28 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-0.5">
                                    {bride.photoUrl || bride.photo ? (
                                        <img
                                            src={bride.photoUrl || bride.photo}
                                            alt={bride.name}
                                            className="h-full w-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-200 font-bold text-neutral-400">
                                            {
                                                (bride.nickname ||
                                                    bride.name)?.[0]
                                            }
                                        </div>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold uppercase tracking-tight text-neutral-900">
                                    {bride.fullName || bride.name}
                                </h4>
                                <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                                    {getParents(bride)}
                                </p>
                                {bride.bio && (
                                    <p className="text-xs font-light leading-relaxed text-neutral-600">
                                        {bride.bio}
                                    </p>
                                )}
                                {bride.instagram && (
                                    <a
                                        href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#D4A0A0] hover:underline"
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
                bg="#F8F8F8"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-12 px-6 py-12"
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
                            EVENTS
                        </h3>
                        <div className="mx-auto mt-1 h-0.5 w-8 bg-neutral-900" />
                    </motion.div>

                    <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
                        {/* Akad */}
                        {schedules.akad && (
                            <motion.div variants={childScaleIn}>
                                <Card className="animate-none space-y-4 rounded-2xl border border-neutral-100 bg-white p-6 text-left shadow-none">
                                    <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                                        <Calendar
                                            className="text-[#D4A0A0]"
                                            size={20}
                                        />
                                        <h4 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                                            Akad Nikah
                                        </h4>
                                    </div>
                                    <div className="space-y-2.5 text-xs font-light text-neutral-600">
                                        <p>
                                            <strong className="font-semibold text-neutral-800">
                                                Tanggal:
                                            </strong>{' '}
                                            {formatDate(schedules.akad.date)}
                                        </p>
                                        <p>
                                            <strong className="font-semibold text-neutral-800">
                                                Waktu:
                                            </strong>{' '}
                                            {schedules.akad.timeStart ||
                                                schedules.akad.time}{' '}
                                            -{' '}
                                            {schedules.akad.timeEnd ||
                                                'Selesai'}
                                        </p>
                                        <p>
                                            <strong className="font-semibold text-neutral-800">
                                                Tempat:
                                            </strong>{' '}
                                            {schedules.akad.placeName ||
                                                schedules.akad.venue}
                                        </p>
                                        <p className="leading-relaxed">
                                            <strong className="font-semibold text-neutral-800">
                                                Alamat:
                                            </strong>{' '}
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
                                <Card className="animate-none space-y-4 rounded-2xl border border-neutral-100 bg-white p-6 text-left shadow-none">
                                    <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
                                        <Calendar
                                            className="text-[#D4A0A0]"
                                            size={20}
                                        />
                                        <h4 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                                            Resepsi
                                        </h4>
                                    </div>
                                    <div className="space-y-2.5 text-xs font-light text-neutral-600">
                                        <p>
                                            <strong className="font-semibold text-neutral-800">
                                                Tanggal:
                                            </strong>{' '}
                                            {formatDate(schedules.resepsi.date)}
                                        </p>
                                        <p>
                                            <strong className="font-semibold text-neutral-800">
                                                Waktu:
                                            </strong>{' '}
                                            {schedules.resepsi.timeStart ||
                                                schedules.resepsi.time}{' '}
                                            -{' '}
                                            {schedules.resepsi.timeEnd ||
                                                'Selesai'}
                                        </p>
                                        <p>
                                            <strong className="font-semibold text-neutral-800">
                                                Tempat:
                                            </strong>{' '}
                                            {schedules.resepsi.placeName ||
                                                schedules.resepsi.venue}
                                        </p>
                                        <p className="leading-relaxed">
                                            <strong className="font-semibold text-neutral-800">
                                                Alamat:
                                            </strong>{' '}
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
                    bg="#ffffff"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                        className="mx-auto w-full max-w-2xl space-y-12 px-6 py-12"
                    >
                        <motion.div
                            className="text-center"
                            variants={childFadeUp}
                        >
                            <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
                                OUR LOVE STORY
                            </h3>
                            <div className="mx-auto mt-1 h-0.5 w-8 bg-neutral-900" />
                        </motion.div>

                        <div className="relative ml-4 mt-6 space-y-8 border-l border-neutral-200 pl-6 text-left">
                            {stories.map((story: any, idx: number) => (
                                <motion.div
                                    key={idx}
                                    variants={childFadeUp}
                                    className="relative space-y-2"
                                >
                                    <div className="w-4.5 h-4.5 absolute -left-[31px] top-1.5 flex items-center justify-center rounded-full border border-neutral-300 bg-white">
                                        <div className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
                                    </div>
                                    <div className="inline-block rounded bg-[#D4A0A0]/10 px-2 py-0.5 text-[10px] font-bold text-[#D4A0A0]">
                                        {story.date || story.year}
                                    </div>
                                    <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-800">
                                        {story.title}
                                    </h4>
                                    <p className="text-xs font-light leading-relaxed text-neutral-500">
                                        {story.content || story.story}
                                    </p>
                                    {story.imageUrl && (
                                        <img
                                            src={story.imageUrl}
                                            alt={story.title}
                                            className="mt-2 max-h-48 w-full rounded-lg border border-neutral-100 object-cover"
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
                    bg="#F8F8F8"
                    roundedVal="2.5rem"
                    boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={containerVariants}
                        className="mx-auto w-full max-w-2xl space-y-12 px-6 py-12"
                    >
                        <motion.div
                            className="text-center"
                            variants={childFadeUp}
                        >
                            <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
                                GALLERY
                            </h3>
                            <div className="mx-auto mt-1 h-0.5 w-8 bg-neutral-900" />
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
                bg="#ffffff"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-12 px-6 py-12"
                >
                    <motion.div className="text-center" variants={childFadeUp}>
                        <h3 className="text-2xl font-black uppercase tracking-wider text-neutral-900">
                            RSVP
                        </h3>
                        <div className="mx-auto mt-1 h-0.5 w-8 bg-neutral-900" />
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
                bg="#F8F8F8"
                roundedVal="2.5rem"
                boxShadow="0 -15px 40px rgba(0, 0, 0, 0.05), 0 -4px 10px rgba(0, 0, 0, 0.02)"
            >
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={containerVariants}
                    className="mx-auto w-full max-w-2xl space-y-12 px-6 py-12"
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

export default ModernTheme;
