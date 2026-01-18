
import { connectToDatabase } from '@/lib/db';
import EmailTemplate from '@/models/EmailTemplate';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getTemplates() {
    await connectToDatabase();
    const templates = await EmailTemplate.find().sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(templates));
}

export default async function EmailTemplatesPage() {
    const templates = await getTemplates();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Email Templates</h1>
                    <div className="h-1 w-12 bg-blue-600 rounded-full mt-1"></div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-bold uppercase tracking-tighter">Site Email Configurations</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-[#fafbfc] border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-16">Id</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 text-center w-32">Status</th>
                                <th className="px-6 py-4 text-right w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {templates.map((template: any, index: number) => (
                                <tr key={template._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">#{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{template.title}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">SLUG: {template.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            {template.isActive ? (
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-wider">
                                                    <CheckCircle size={10} /> Enabled
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full border border-slate-200 uppercase tracking-wider">
                                                    Disabled
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/email-templates/${template._id}/edit`}
                                                className="px-3.5 py-1.5 bg-[#2c3e50] hover:bg-[#34495e] text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 uppercase tracking-wider px-4"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
                    <span>Showing 1 to {templates.length} of {templates.length} entries</span>
                </div>
            </div>
        </div>
    );
}
