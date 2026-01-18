
'use server';

import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import CategoryModel from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

import { uploadImage } from '@/lib/cloudinary';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const CouponSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    code: z.string().optional(),
    tagLine: z.string().optional(),
    description: z.string().optional(),
    storeId: z.string().min(1, 'Store is required'),
    categoryId: z.string().min(1, 'Category is required'),
    subCategoryId: z.string().optional(),
    startDate: z.string().optional().or(z.literal('')),
    expiryDate: z.string().optional().or(z.literal('')),
    trackingLink: z.string().min(1, 'Tracking Link is required').url('Invalid URL'),
    couponType: z.enum(['Code', 'Deals', 'Exclusive', 'Freeshipping', 'Clearance']),
    isExclusive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
    discountValue: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    imageUrl: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.couponType === 'Code' && (!data.code || data.code.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Coupon Code is required for type 'Code'",
            path: ["code"],
        });
    }
});

// Local file upload handling removed in favor of Cloudinary

export async function createCoupon(prevState: any, formData: FormData) {
    console.log("--- createCoupon Action Started ---");
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        console.log("Auth failed");
        return { message: 'Unauthorized' };
    }

    try {
        console.log("Handling file upload...");
        const imageFile = formData.get('imageFile') as File | null;
        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImage(imageFile, 'coupons');
        }
        console.log("File upload result:", imageUrl);

        // Prepare data handling checkboxes and selects
        // HELPER: Convert null from formData to undefined for simple strings to satisfy Zod .optional()
        const getString = (key: string) => {
            const val = formData.get(key);
            return (val && typeof val === 'string' && val.trim() !== '') ? val.trim() : undefined;
        };

        const rawData = {
            title: formData.get('title'), // Required, let Zod catch if missing
            code: getString('code') || '', // Special case: default to empty string if missing, handled by superRefine
            tagLine: getString('tagLine'),
            description: getString('description'),
            storeId: formData.get('storeId'),
            categoryId: formData.get('categoryId'),
            subCategoryId: getString('subCategoryId'),
            startDate: getString('startDate'), // If empty string, returns undefined
            expiryDate: getString('expiryDate'),
            trackingLink: getString('trackingLink'),
            couponType: formData.get('couponType') as any,
            isExclusive: formData.get('isExclusive') === 'yes',
            isFeatured: formData.get('isFeatured') === 'yes',
            isVerified: formData.get('isVerified') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            discountValue: getString('discountValue'),
            seoTitle: getString('seoTitle'),
            seoDescription: getString('seoDescription'),
            imageUrl: imageUrl || undefined,
        };
        console.log("Raw Data:", JSON.stringify(rawData, null, 2));

        const validatedFields = CouponSchema.safeParse(rawData);

        if (!validatedFields.success) {
            console.log("Validation Failed:", validatedFields.error.flatten().fieldErrors);
            return { errors: validatedFields.error.flatten().fieldErrors, message: 'Validation Failed: Please check the highlighted fields.' };
        }

        console.log("Validation Success. Connecting to DB...");
        const data = validatedFields.data;
        await connectToDatabase();

        console.log("Checking Store and Category...");
        const store = await StoreModel.findById(data.storeId);
        if (!store) {
            console.log("Store not found:", data.storeId);
            return { message: 'Selected store does not exist' };
        }

        const category = await CategoryModel.findById(data.categoryId);
        if (!category) {
            console.log("Category not found:", data.categoryId);
            return { message: 'Selected category does not exist' };
        }

        console.log("Creating Coupon Document...");
        const newCoupon = await Coupon.create({
            title: data.title,
            code: data.code,
            tagLine: data.tagLine,
            description: data.description,
            store: data.storeId,
            category: data.categoryId,
            subCategory: data.subCategoryId || undefined,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
            trackingLink: data.trackingLink,
            couponType: data.couponType,
            isExclusive: data.isExclusive || false,
            isFeatured: data.isFeatured || false,
            isVerified: data.isVerified || false,
            isActive: data.isActive || true,
            discountValue: data.discountValue,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            imageUrl: data.imageUrl,
        });
        console.log("Coupon Created Successfully:", newCoupon._id);

        revalidatePath('/admin/coupons');
    } catch (error: any) {
        console.error("CRITICAL ERROR in createCoupon:", error);
        return { message: error.message || 'Failed to create coupon' };
    }

    console.log("Redirecting...");
    redirect('/admin/coupons');
}

export async function updateCoupon(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    const id = formData.get('id') as string;
    if (!id) return { message: 'Coupon ID is required' };

    try {
        await connectToDatabase();
        const existingCoupon = await Coupon.findById(id);
        if (!existingCoupon) return { message: 'Coupon not found' };

        const imageFile = formData.get('imageFile') as File | null;
        let imageUrl = existingCoupon.imageUrl;
        if (imageFile && imageFile.size > 0) {
            imageUrl = (await uploadImage(imageFile, 'coupons')) || existingCoupon.imageUrl;
        }

        const rawData = {
            title: formData.get('title'),
            code: formData.get('code') || '',
            tagLine: formData.get('tagLine'),
            description: formData.get('description'),
            storeId: formData.get('storeId'),
            categoryId: formData.get('categoryId'),
            subCategoryId: formData.get('subCategoryId'),
            startDate: formData.get('startDate'),
            expiryDate: formData.get('expiryDate'),
            trackingLink: formData.get('trackingLink'),
            couponType: formData.get('couponType') as any,
            isExclusive: formData.get('isExclusive') === 'yes',
            isFeatured: formData.get('isFeatured') === 'yes',
            isVerified: formData.get('isVerified') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            discountValue: formData.get('discountValue'),
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            imageUrl: imageUrl || existingCoupon.imageUrl,
        };

        const validatedFields = CouponSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;

        await Coupon.findByIdAndUpdate(id, {
            title: data.title,
            code: data.code,
            tagLine: data.tagLine,
            description: data.description,
            store: data.storeId,
            category: data.categoryId,
            subCategory: data.subCategoryId || undefined,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
            trackingLink: data.trackingLink,
            couponType: data.couponType,
            isExclusive: data.isExclusive || false,
            isFeatured: data.isFeatured || false,
            isVerified: data.isVerified || false,
            isActive: data.isActive || true,
            discountValue: data.discountValue,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            imageUrl: data.imageUrl,
        });

        revalidatePath('/admin/coupons');
        revalidatePath(`/admin/coupons/edit/${id}`);
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to update coupon' };
    }

    redirect('/admin/coupons');
}

export async function deleteCoupon(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await Coupon.findByIdAndDelete(id);
        revalidatePath('/admin/coupons');
        return { message: 'Coupon deleted' };
    } catch (error) {
        return { message: 'Error deleting coupon' };
    }
}

export async function voteCoupon(id: string, isUp: boolean) {
    try {
        await connectToDatabase();
        const update = isUp ? { $inc: { votesUp: 1 } } : { $inc: { votesDown: 1 } };
        await Coupon.findByIdAndUpdate(id, update);
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}
