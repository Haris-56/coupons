
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
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/email-templates" className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 text-slate-500 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Edit Email Template
                        </h1>
                        <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                    </div>
                </div>
            </header>

            <EmailTemplateForm template={JSON.parse(JSON.stringify(template))} />
        </div>
    );
}
