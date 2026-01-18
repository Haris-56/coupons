
'use client';

import { useState } from 'react';
import { Save, HelpCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsForm() {
    return (
        <div className="space-y-6 pb-20">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Site Settings</h3>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Maintenance Mode */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Maintenance Mode</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                                <option value="disabled">Disabled</option>
                                <option value="enabled">Enabled</option>
                            </select>
                        </div>

                        {/* Language Direction */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Language Direction</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                                <option value="LTR">Left to Right (LTR)</option>
                                <option value="RTL">Right to Left (RTL)</option>
                            </select>
                        </div>

                        {/* Currency Symbol */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Currency Symbol</label>
                            <input defaultValue="$" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>

                        {/* Date Format */}
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Date Format</label>
                            <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all">
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Company Info */}
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Company Info</h3>
                    <div className="space-y-4">
                        {['Facebook', 'Twitter', 'YouTube', 'Instagram', 'LinkedIn', 'WhatsApp'].map((platform) => (
                            <div key={platform} className="grid grid-cols-1 gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">{platform}</label>
                                <input placeholder={`https://www.${platform.toLowerCase()}.com/`} type="url" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* General / Analytics */}
                <div className="p-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">General</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Analytics / Tracking Code</label>
                            <textarea rows={4} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:outline-none focus:border-blue-500 transition-all" placeholder="<script>...</script>" />
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Google Recaptcha Key</label>
                            <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Google Recaptcha Secret Key</label>
                            <input type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>
                    </div>
                </div>


            </div>

            <div className="fixed bottom-6 right-6 flex flex-col gap-3">
                <button className="bg-[#2c3e50] hover:bg-[#34495e] text-white p-3 rounded-full shadow-lg transition-transform hover:-translate-y-1">
                    <ArrowUp size={20} />
                </button>
            </div>

            <div className="flex justify-start">
                <button className="bg-[#2c3e50] hover:bg-[#34495e] text-white px-8 py-3 rounded-md font-bold text-xs uppercase tracking-wider transition-colors shadow-lg">
                    Save Changes
                </button>
            </div>
        </div>
    );
}
