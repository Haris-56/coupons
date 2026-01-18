
'use server';

import { connectToDatabase } from '@/lib/db';
import EmailTemplate from '@/models/EmailTemplate';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function updateEmailTemplate(id: string, data: any) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await EmailTemplate.findByIdAndUpdate(id, {
            subject: data.subject,
            fromName: data.fromName,
            content: data.content,
            isActive: data.isActive,
        });
        revalidatePath('/admin/email-templates');
        revalidatePath(`/admin/email-templates/${id}/edit`);
        return { success: true, message: 'Template updated successfully' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteEmailTemplate(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await EmailTemplate.findByIdAndDelete(id);
        revalidatePath('/admin/email-templates');
        return { success: true, message: 'Template deleted' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function sendTestEmail(id: string, targetEmail: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { success: false, message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        const template = await EmailTemplate.findById(id);
        if (!template) return { success: false, message: 'Template not found' };

        // For now, just simulate success. In a real app, you'd use Nodemailer or an API
        console.log(`Simulating sending email to ${targetEmail} using template ${template.title}`);

        return { success: true, message: `Test email sent to ${targetEmail}` };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
