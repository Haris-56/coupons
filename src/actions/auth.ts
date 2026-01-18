
'use server';

import { z } from 'zod';
import { SignupFormSchema, LoginFormSchema } from '@/lib/definitions';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '@/models/User';
import { connectToDatabase } from '@/lib/db';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signup(prevState: any, formData: FormData) {
    // 1. Validate form fields
    const validatedFields = SignupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = validatedFields.data;

    // 2. Prepare data for insertion
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Insert into database
    try {
        await connectToDatabase();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                message: 'User already exists with this email.',
            };
        }

        // Create user
        const newUser = await User.create({
            name,
            email,
            passwordHash,
            role: 'USER', // Default role
        });

        // 4. Create session
        await createSession(newUser._id.toString(), newUser.role);

    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User.',
        };
    }

    // 5. Redirect user
    redirect('/');
}

export async function login(prevState: any, formData: FormData) {
    // 1. Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await connectToDatabase();

        // 2. Fetch user
        const user = await User.findOne({ email });
        if (!user) {
            return {
                message: 'Invalid credentials.',
            };
        }

        // 3. Verify password
        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) {
            return {
                message: 'Invalid credentials.',
            };
        }

        // 4. Create session
        await createSession(user._id.toString(), user.role);

        // 5. Check capabilities for redirect
        if (user.role === 'ADMIN') {
            // We could redirect to admin, but let's stick to home or dashboard
        }

    } catch (error) {
        return {
            message: 'Something went wrong.',
        };
    }

    redirect('/admin'); // Or home, but VIP request implies Admin focus
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
