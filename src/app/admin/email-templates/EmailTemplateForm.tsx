
'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Send, Loader2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { updateEmailTemplate, sendTestEmail } from '@/actions/emailTemplate';
import { useRouter } from 'next/navigation';

export function EmailTemplateForm({ template }: { template: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        subject: template.subject,
        fromName: template.fromName || '',
        content: template.content,
        isActive: template.isActive,
    });

    const handleSave = async () => {
        setLoading(true);
        const res = await updateEmailTemplate(template._id, form);
        setLoading(false);
        setMessage(res.message);
        if (res.success) {
            router.refresh();
        }
    };

    const handleSendTest = async () => {
        if (!testEmail) return alert('Please enter an email address');
        setTestLoading(true);
        const res = await sendTestEmail(template._id, testEmail);
        setTestLoading(false);
        alert(res.message);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-800">{template.title}</h2>
                            <p className="text-xs text-slate-400 font-medium">Slug: {template.slug}</p>
                        </div>
                        {form.isActive ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">Active</span>
                        ) : (
                            <span className="px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-100">Draft</span>
                        )}
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {message.includes('success') ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message}</span>
                        </div>
                    )}

                    {/* Meta Config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Subject</label>
                            <input
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sender Name</label>
                            <input
                                value={form.fromName}
                                onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                                placeholder="e.g. MyStore Support"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Status</label>
                        <select
                            value={form.isActive ? 'enabled' : 'disabled'}
                            onChange={(e) => setForm({ ...form, isActive: e.target.value === 'enabled' })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all cursor-pointer"
                        >
                            <option value="enabled">Active</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">HTML Content</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full h-[500px] px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white font-mono transition-all leading-relaxed shadow-inner"
                            placeholder="Paste your HTML template here..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            {loading ? 'Saving...' : 'Update Template'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Info size={16} className="text-accent-500" /> Dynamic Fields
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {[
                            { label: 'Platform Logo', code: '{LOGO_URL}' },
                            { label: 'Site Domain', code: '{SITE_DOMAIN}' },
                            { label: 'Site Name', code: '{SITE_NAME}' },
                            { label: 'User Name', code: '{USER_NAME}' },
                            { label: 'User Email', code: '{USER_EMAIL}' },
                            { label: 'Signin URL', code: '{SIGNIN_URL}' },
                        ].map((field) => (
                            <div
                                key={field.code}
                                className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 hover:border-accent-100 cursor-pointer group transition-all"
                                onClick={() => setForm({ ...form, content: form.content + field.code })}
                            >
                                <span className="text-xs text-slate-500 font-medium">{field.label}</span>
                                <code className="text-accent-600 bg-accent-50 px-2 py-1 rounded text-[10px] font-bold group-hover:bg-accent-500 group-hover:text-white transition-all">{field.code}</code>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium border-t border-slate-50 pt-4">
                        Click a field to inject it into the editor at the current selection.
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-4">Test Template</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Recipient Email</label>
                            <input
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                type="email"
                                placeholder="test@example.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSendTest}
                            disabled={testLoading}
                            className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                        >
                            {testLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                            {testLoading ? 'Sending...' : 'Send Test Email'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
