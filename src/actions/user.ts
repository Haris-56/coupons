
'use server';

import User from '@/models/User';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

export async function deleteUser(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await User.findByIdAndDelete(id);
        revalidatePath('/admin/users');
        return { message: 'User deleted successfully' };
    } catch (error) {
        return { message: 'Error deleting user' };
    }
}

export async function updateUser(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    try {
        await connectToDatabase();
        const updateData: any = { name, email, role };

        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        await User.findByIdAndUpdate(id, updateData);
        revalidatePath('/admin/users');
    } catch (error: any) {
        return { message: error.message || 'Error updating user' };
    }

    redirect('/admin/users');
}

export async function createUser(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!password) return { message: 'Password is required' };

    try {
        await connectToDatabase();

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return { message: 'Email already exists' };

        const passwordHash = await bcrypt.hash(password, 10);
        await User.create({ name, email, passwordHash, role });

        revalidatePath('/admin/users');
    } catch (error: any) {
        return { message: error.message || 'Error creating user' };
    }

    redirect('/admin/users');
}
