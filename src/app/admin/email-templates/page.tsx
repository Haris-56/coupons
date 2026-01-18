
import { connectToDatabase } from '@/lib/db';
import EmailTemplate from '@/models/EmailTemplate';
import { Mail, CheckCircle, XCircle, Search, Edit } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getTemplates() {
    await connectToDatabase();
    const templates = await EmailTemplate.find().sort({ createdAt: 1 });
    return JSON.parse(JSON.stringify(templates));
}

export default async function EmailTemplatesPage() {
    const templates = await getTemplates();

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase p-2 pr-16 bg-transparent">
                        Email Templates
                    </h1>
                    <p className="text-slate-500 font-medium italic text-sm border-l-4 border-accent-500/20 pl-4 uppercase tracking-widest">Notification System</p>
                </div>
            </header>

            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5">
                {/* Toolbar */}
                <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50">
                    <div className="relative flex-1 w-full max-w-2xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent-500 transition-colors pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH TEMPLATES..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-accent-300 shadow-sm transition-all placeholder:text-slate-300 uppercase tracking-widest"
                        />
                    </div>
                    <div className="bg-accent-500 text-white px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg shadow-accent-500/20 ml-auto">
                        <Mail size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{templates.length} Templates</span>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase font-black tracking-widest border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 w-20 text-center">S.No</th>
                                <th className="px-8 py-5">Configuration Title</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {templates.map((template: any, index: number) => (
                                <tr key={template._id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6 font-black text-[10px] text-slate-300 group-hover:text-accent-500 transition-colors text-center tabular-nums">
                                        #{(index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-slate-900 group-hover:text-accent-600 transition-colors uppercase tracking-tight text-xs">
                                                {template.title}
                                            </span>
                                            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest italic">
                                                ID: {template.slug}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex justify-center">
                                            {template.isActive ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic">
                                                    ACTIVE
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-rose-50 text-rose-500 border border-rose-100 italic">
                                                    DORMANT
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/email-templates/${template._id}/edit`}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                                        >
                                            <Edit size={12} />
                                            Edit Template
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

