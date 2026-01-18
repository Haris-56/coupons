
'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
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
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                    <h2 className="text-lg font-bold text-slate-700 pb-2 border-b border-slate-100">{template.title}</h2>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {message}
                        </div>
                    )}

                    {/* Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                            <input
                                value={form.subject}
                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">From Name</label>
                            <input
                                value={form.fromName}
                                onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                                placeholder="e.g. SavingCouponsHub"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                        <select
                            value={form.isActive ? 'enabled' : 'disabled'}
                            onChange={(e) => setForm({ ...form, isActive: e.target.value === 'enabled' })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        >
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>

                    {/* Content Editor */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">HTML Content</label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full h-96 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-mono transition-all"
                            placeholder="Enter HTML template content..."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-[#2c3e50] hover:bg-[#34495e] text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {loading ? 'Saving...' : 'Save Template'}
                    </button>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                        Available Fields
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Dynamic Variables</span>
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Logo', code: '{LOGO_URL}' },
                            { label: 'Site Domain', code: '{SITE_DOMAIN}' },
                            { label: 'Site Name', code: '{SITE_NAME}' },
                            { label: 'User Name', code: '{USER_NAME}' },
                            { label: 'User Email', code: '{USER_EMAIL}' },
                            { label: 'Sign In URL', code: '{SIGNIN_URL}' },
                        ].map((field) => (
                            <div key={field.code} className="flex items-center justify-between text-sm group cursor-pointer" onClick={() => {
                                setForm({ ...form, content: form.content + field.code });
                            }}>
                                <span className="text-slate-600 font-medium">{field.label}</span>
                                <code className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">{field.code}</code>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-[10px] text-slate-400 leading-relaxed">Click a field to append it to the content editor. These will be replaced automatically during sending.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                    <h3 className="text-sm font-bold text-slate-700">Send a Test Email</h3>
                    <div className="space-y-3">
                        <input
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            type="email"
                            placeholder="admin@example.com"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                        />
                        <button
                            onClick={handleSendTest}
                            disabled={testLoading}
                            className="w-full bg-[#34495e] hover:bg-[#2c3e50] text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                        >
                            {testLoading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                            {testLoading ? 'Sending...' : 'Send Test Email'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
