
'use server';

import Category from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { uploadImage } from '@/lib/cloudinary';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const CategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
    description: z.string().optional(),
    icon: z.string().optional(),
    isShowInMenu: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    imageUrl: z.string().optional(),
});

// Local file upload handling removed in favor of Cloudinary

export async function createCategory(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    let slug = formData.get('slug') as string;
    if (!slug && formData.get('name')) {
        slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    try {
        const imageFile = formData.get('image') as File | null;
        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImage(imageFile, 'categories');
        }

        const validatedFields = CategorySchema.safeParse({
            name: formData.get('name'),
            slug: slug,
            description: formData.get('description'),
            icon: formData.get('icon'),
            isShowInMenu: formData.get('isShowInMenu') === 'yes',
            isFeatured: formData.get('isFeatured') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            imageUrl: imageUrl || undefined,
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;
        await connectToDatabase();

        const existing = await Category.findOne({ slug: data.slug });
        if (existing) {
            return { errors: { slug: ['Slug already exists'] } };
        }

        await Category.create(data);
        revalidatePath('/admin/categories');
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to create category' };
    }

    redirect('/admin/categories');
}

export async function updateCategory(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    const id = formData.get('id') as string;
    if (!id) return { message: 'Category ID is required' };

    try {
        await connectToDatabase();
        const existingCategory = await Category.findById(id);
        if (!existingCategory) return { message: 'Category not found' };

        const imageFile = formData.get('image') as File | null;
        let imageUrl = existingCategory.imageUrl;
        if (imageFile && imageFile.size > 0) {
            imageUrl = (await uploadImage(imageFile, 'categories')) || existingCategory.imageUrl;
        }

        const validatedFields = CategorySchema.safeParse({
            name: formData.get('name'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            icon: formData.get('icon'),
            isShowInMenu: formData.get('isShowInMenu') === 'yes',
            isFeatured: formData.get('isFeatured') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            imageUrl: imageUrl || existingCategory.imageUrl,
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;

        // Check if slug is taken
        const slugCheck = await Category.findOne({ slug: data.slug, _id: { $ne: id } });
        if (slugCheck) return { errors: { slug: ['Slug already exists'] } };

        await Category.findByIdAndUpdate(id, data);

        revalidatePath('/admin/categories');
        revalidatePath(`/admin/categories/edit/${id}`);
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to update category' };
    }

    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await Category.findByIdAndDelete(id);
        revalidatePath('/admin/categories');
        return { message: 'Category deleted' };
    } catch (error) {
        return { message: 'Error deleting category' };
    }
}
