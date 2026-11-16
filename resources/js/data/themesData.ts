export interface CatalogTheme {
    id: string;
    demoTier: 'b' | 'p' | 'c';
    demoCode: string;
    name: string;
    tag: 'BASIC' | 'PREMIUM' | 'CUSTOM';
    color: string;
    textColor: string;
    description: string;
    accent: 'rustic' | 'gold';
    thumbnailUrl?: string;
    category: 'basic' | 'premium' | 'custom';
    features: string[];
}

export const ALL_THEMES: CatalogTheme[] = [
    {
        id: 'basic-1',
        demoTier: 'b',
        demoCode: 'tv6akl',
        name: 'Minimalist Sage',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#F2F6F3] border-[#7F9F8B]',
        textColor: 'text-[#2D4F3E]',
        description:
            'Desain minimalis modern bernuansa sage green & warm sand yang bersih, menenangkan, dan elegan.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-foliage.png',
        features: ['Scrollspy Dock', 'Sage Botanical', 'Live Countdown', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-2',
        demoTier: 'b',
        demoCode: 'b2x8k1',
        name: 'Terracotta Bloom',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#FDF6F0] border-[#D97D54]',
        textColor: 'text-[#8F3D24]',
        description:
            'Nuansa hangat terracotta dan boho sunset dengan polaroid galeri, lengkungan estetik, dan navigasi modern.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-rustic.png',
        features: ['Boho Sunset', 'Polaroid Gallery', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-3',
        demoTier: 'b',
        demoCode: 'b3v7x2',
        name: 'Dusty Rose',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#FDF8F8] border-[#D48B99]',
        textColor: 'text-[#9E4A5B]',
        description:
            'Nuansa romantis dusty rose & blush porcelain dengan ornamen floral mawar, countdown mewah, dan bingkai anggun.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/hero-floral.png',
        features: ['Romantic Rose', 'Floral Ornaments', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-4',
        demoTier: 'b',
        demoCode: 'b4k8n1',
        name: 'Classic Ivory Noir',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#FAF9F5] border-neutral-300',
        textColor: 'text-[#18181B]',
        description:
            'Desain monokrom modern editorial bernuansa warm ivory dan aksen emas sampanye yang elegan & abadi.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-royal.png',
        features: ['Modern Editorial', 'Hairline Dividers', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-5',
        demoTier: 'b',
        demoCode: 'b5w9p3',
        name: 'Ocean Breeze',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#F3F7FA] border-[#5B82A1]',
        textColor: 'text-[#244B66]',
        description:
            'Nuansa sejuk dusty ocean blue & pasir pantai dengan ornamen ombak estetik dan detail keemasan anggun.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-foliage.png',
        features: ['Dusty Ocean Blue', 'Wave Ornaments', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-6',
        demoTier: 'b',
        demoCode: 'b6m4k2',
        name: 'Olive Earth',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#F7F5EE] border-[#7F9A60]',
        textColor: 'text-[#3E4D2A]',
        description:
            'Nuansa hangat bumi & zaitun rustic bernuansa earthy beige, aksen kayu hangat, dan keanggunan natural.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-rustic.png',
        features: ['Olive Botanical', 'Earthy Beige', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-7',
        demoTier: 'b',
        demoCode: 'b7p9x5',
        name: 'Lavender Mist',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#FAF7FD] border-[#BCA3E5]',
        textColor: 'text-[#6C499C]',
        description:
            'Nuansa romantis dreamy lavender mist & silver lilac dengan ornamen floret anggun dan sentuhan peri dongeng.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/hero-floral.png',
        features: ['Silver Lilac', 'Dreamy Lavender', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-8',
        demoTier: 'b',
        demoCode: 'b8s3t7',
        name: 'Golden Sunset',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#FDF8F2] border-[#E89B55]',
        textColor: 'text-[#B85215]',
        description:
            'Kehangatan golden hour sunset bernuansa amber, terracotta oranye lembut, dan cahaya senja memukau.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-rustic.png',
        features: ['Sunset Amber', 'Radiant Sunburst', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-9',
        demoTier: 'b',
        demoCode: 'b9e2r8',
        name: 'Emerald Royal',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#F1F7F4] border-[#0F4435]',
        textColor: 'text-[#0F4435]',
        description:
            'Kemegahan royal emerald green dipadu filigree emas antik sampanye yang agung, klasik, dan berwibawa.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/couple-royal.png',
        features: ['Deep Emerald', 'Imperial Filigree', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'basic-10',
        demoTier: 'b',
        demoCode: 'b10w7q',
        name: 'Sakura Blossom',
        tag: 'BASIC',
        category: 'basic',
        color: 'bg-[#FFF8F7] border-[#DE7E91]',
        textColor: 'text-[#C26D7C]',
        description:
            'Ketenangan zen bernuansa pastel sakura blossom, peach blush, dan aksen charcoal slate modern yang memikat.',
        accent: 'rustic',
        thumbnailUrl: '/assets/wedding/hero-floral.png',
        features: ['Zen Sakura', 'Pastel Blossom', 'Scrollspy Dock', 'RSVP & Guestbook', 'Kado Digital'],
    },
    {
        id: 'theme-1',
        demoTier: 'p',
        demoCode: 'emikvq',
        name: 'Burgundy Bloom',
        tag: 'PREMIUM',
        category: 'premium',
        color: 'bg-[#3A0511] border-[#C9A84C]',
        textColor: 'text-[#FAF3EC]',
        description:
            'Desain royal burgundy mewah dengan aksen emas berkelas dan layout responsif eksklusif.',
        accent: 'gold',
        thumbnailUrl: '/assets/theme_1/burgundy-envelope-closed.png',
        features: ['Royal Burgundy', 'Gold Accent Foil', 'Amplop 3D Interaktif', 'RSVP & QR Check-in', 'Custom Story'],
    },
    {
        id: 'theme-2',
        demoTier: 'p',
        demoCode: 't2ltgr',
        name: 'Premium 10 Animasi',
        tag: 'PREMIUM',
        category: 'premium',
        color: 'bg-slate-900 border-gold-400',
        textColor: 'text-gold-200',
        description:
            'Template sinematik dengan 10 animasi visual memukau dan pengalaman interaktif istimewa.',
        accent: 'gold',
        thumbnailUrl: '/assets/wedding/couple-royal.png',
        features: ['10 Animasi Mewah', 'Sinematik Visual', 'Latar Gelap Elegan', 'QR Check-in', 'Custom Musik'],
    },
    {
        id: 'custom-theme-1',
        demoTier: 'c',
        demoCode: 'rgudhs',
        name: 'Exclusive Custom',
        tag: 'CUSTOM',
        category: 'custom',
        color: 'bg-stone-900 border-amber-500',
        textColor: 'text-amber-100',
        description:
            'Layanan kustomisasi penuh dari tim desainer Ngaturi untuk konsep pernikahan impian yang unik dan personal.',
        accent: 'gold',
        thumbnailUrl: '/assets/wedding/hero-floral.png',
        features: ['Full Custom Design', 'Dedicated Designer', 'Revisi Fleksibel', 'Custom Domain', 'Dukungan Prioritas'],
    },
];

// Curated 3 featured samples for the landing page
export const LANDING_SAMPLE_THEMES = ALL_THEMES.filter((t) =>
    ['basic-1', 'basic-2', 'theme-1'].includes(t.id),
);
