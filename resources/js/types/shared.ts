import { z } from 'zod';

// 1. User Validation & Types
export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export const UserStatusSchema = z.enum(['PENDING', 'ACTIVE', 'BLOCKED']);

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: UserRoleSchema,
    status: UserStatusSchema,
    createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// 2. Package Validation & Types
export const PackageSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1), // 'BASIC', 'PREMIUM', 'CUSTOM'
    price: z.number().int().nonnegative(),
    features: z.array(z.string()),
    maxGuests: z.number().int().nonnegative(),
    durationDays: z.number().int().positive(),
    createdAt: z.date(),
});

export type Package = z.infer<typeof PackageSchema>;

// 3. Order Validation & Types
export const OrderStatusSchema = z.enum([
    'PENDING',
    'PAID',
    'EXPIRED',
    'REFUNDED',
]);

export const OrderSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    packageId: z.string().uuid(),
    status: OrderStatusSchema,
    amount: z.number().int().nonnegative(),
    paymentMethod: z.string().optional(),
    gatewayRef: z.string().optional(),
    paidAt: z.date().nullable(),
    createdAt: z.date(),
});

export type Order = z.infer<typeof OrderSchema>;

// 4. Guest Validation & Types
export const GuestRsvpStatusSchema = z.enum([
    'pending',
    'hadir',
    'tidak',
    'ragu',
]);

export const GuestSchema = z.object({
    id: z.string().uuid(),
    weddingId: z.string().uuid(),
    name: z.string().min(1, 'Guest name is required'),
    phone: z.string().optional(),
    uniqueToken: z.string(),
    rsvpStatus: GuestRsvpStatusSchema,
    message: z.string().optional().nullable(),
    respondedAt: z.date().nullable(),
    createdAt: z.date(),
});

export type Guest = z.infer<typeof GuestSchema>;

// 5. Theme Validation & Types
export const ThemeSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    thumbnailUrl: z.string().optional(),
    previewUrl: z.string().optional(),
    packageLevel: z.enum(['BASIC', 'PREMIUM']),
    isActive: z.boolean(),
    usedCount: z.number().int().nonnegative(),
});

export type Theme = z.infer<typeof ThemeSchema>;

// 6. Photo Validation & Types
export const PhotoSchema = z.object({
    id: z.string().uuid(),
    weddingId: z.string().uuid(),
    url: z.string().url(),
    order: z.number().int(),
    type: z.enum(['gallery', 'cover', 'prewed']),
});

export type Photo = z.infer<typeof PhotoSchema>;

// 7. Transaction Validation & Types
export const TransactionSchema = z.object({
    id: z.string().uuid(),
    orderId: z.string().uuid(),
    gateway: z.string(),
    payload: z.record(z.string(), z.any()),
    status: z.string(),
    createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// 8. WeddingData (JSONB config structure)
export const PersonProfileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    fullName: z.string().min(1, 'Full name is required'),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    photoUrl: z.string().url().optional().or(z.literal('')),
    instagram: z.string().optional(),
    bio: z.string().optional(),
});

export const EventScheduleSchema = z.object({
    date: z.string(), // YYYY-MM-DD
    timeStart: z.string(), // HH:MM
    timeEnd: z.string(), // HH:MM
    placeName: z.string().min(1, 'Place name is required'),
    address: z.string().min(1, 'Address is required'),
    googleMapsUrl: z.string().url().optional().or(z.literal('')),
});

export type EventSchedule = z.infer<typeof EventScheduleSchema>;

export const LoveStorySchema = z.object({
    title: z.string(),
    date: z.string(),
    content: z.string(),
    imageUrl: z.string().url().optional(),
});

export const WeddingDataSchema = z.object({
    groom: PersonProfileSchema,
    bride: PersonProfileSchema,
    schedules: z.object({
        akad: EventScheduleSchema,
        resepsi: EventScheduleSchema.optional(),
    }),
    stories: z.array(LoveStorySchema).default([]),
    quotes: z
        .object({
            text: z.string().optional(),
            source: z.string().optional(),
        })
        .optional(),
    musicUrl: z.string().url().optional().or(z.literal('')),
});

export type WeddingData = z.infer<typeof WeddingDataSchema>;
export type PersonProfile = z.infer<typeof PersonProfileSchema>;
export type LoveStory = z.infer<typeof LoveStorySchema>;

// 9. Auth Input Validation Schemas
export const RegisterInputSchema = z.object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(8, 'Kata sandi minimal harus 8 karakter'),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const VerifyEmailInputSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    otp: z.string().length(6, 'OTP harus tepat 6 digit'),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

export const LoginInputSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(1, 'Kata sandi wajib diisi'),
    rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const ForgotPasswordInputSchema = z.object({
    email: z.string().email('Format email tidak valid'),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordInputSchema>;

export const ResetPasswordInputSchema = z
    .object({
        token: z.string().min(1, 'Token wajib diisi'),
        password: z.string().min(8, 'Kata sandi baru minimal harus 8 karakter'),
        confirmPassword: z.string().min(8, 'Konfirmasi kata sandi wajib diisi'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Konfirmasi kata sandi tidak cocok',
        path: ['confirmPassword'],
    });

export type ResetPasswordInput = z.infer<typeof ResetPasswordInputSchema>;
