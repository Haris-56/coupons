
import { connectToDatabase } from '@/lib/db';
import EmailTemplate from '@/models/EmailTemplate';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EmailTemplateForm } from '../../EmailTemplateForm';

export default async function EditEmailTemplatePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    await connectToDatabase();
    const template = await EmailTemplate.findById(params.id);

    if (!template) {
        notFound();
    }

    return (
        <div className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/email-templates" className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Email Template Editor</h1>
                    <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
                </div>
            </div>

            <EmailTemplateForm template={JSON.parse(JSON.stringify(template))} />
        </div>
    );
}
