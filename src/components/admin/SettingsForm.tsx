
'use client';

import { useState } from 'react';
import { Save, HelpCircle, ArrowUp, Globe, Share2, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsForm() {
    return (
        <div className="space-y-10 pb-20">
            <header className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase p-1">
                    System Settings
                </h1>
                <p className="text-slate-500 font-medium italic text-xs border-l-4 border-accent-500/20 pl-4 uppercase tracking-widest">Global Configuration</p>
            </header>

            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5 divide-y divide-slate-100">
                {/* General Settings */}
                <div className="p-8 lg:p-12 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                            <Globe className="text-white" size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">General Registry</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Maintenance Mode */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Maintenance Status</label>
                            <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 focus:outline-none focus:border-accent-300 transition-all uppercase tracking-widest cursor-pointer">
                                <option value="disabled">Live (Public)</option>
                                <option value="enabled">Maintenance (Private)</option>
                            </select>
                        </div>

                        {/* Language Direction */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Text Direction</label>
                            <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 focus:outline-none focus:border-accent-300 transition-all uppercase tracking-widest cursor-pointer">
                                <option value="LTR">Left-to-Right (LTR)</option>
                                <option value="RTL">Right-to-Left (RTL)</option>
                            </select>
                        </div>

                        {/* Currency Symbol */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Currency Symbol</label>
                            <input defaultValue="$" type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 focus:outline-none focus:border-accent-300 transition-all font-mono" />
                        </div>

                        {/* Date Format */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Expression</label>
                            <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-900 focus:outline-none focus:border-accent-300 transition-all uppercase tracking-widest cursor-pointer">
                                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="p-8 lg:p-12 space-y-8 bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/20">
                            <Share2 className="text-white" size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Social Network Hub</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['Facebook', 'Twitter', 'YouTube', 'Instagram', 'LinkedIn', 'WhatsApp'].map((platform) => (
                            <div key={platform} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{platform}</label>
                                <input placeholder={`URL...`} type="url" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 focus:outline-none focus:border-accent-300 transition-all lowercase" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracking & Analytics */}
                <div className="p-8 lg:p-12 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-400">
                            <MousePointer2 size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Telemetry & Tracking</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Analytics Source Injection</label>
                            <textarea rows={6} className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-xs font-mono text-slate-600 focus:outline-none focus:bg-white focus:border-accent-300 transition-all custom-scrollbar shadow-inner" placeholder="<script>...</script>" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recaptcha Site Key</label>
                                <input type="text" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-accent-300 transition-all" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recaptcha Secret Key</label>
                                <input type="password" placeholder="••••••••••••••••" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-accent-300 transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 lg:p-12 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PROPAGATE CHANGES TO PRODUCTION INSTANTLY.</span>
                    </div>
                    <button className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95">
                        <Save size={16} />
                        Commit Changes
                    </button>
                </div>
            </div>

            {/* Scroll Up Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="bg-white border border-slate-200 text-slate-500 p-4 rounded-2xl shadow-xl hover:bg-slate-900 hover:text-white transition-all group active:scale-95"
                >
                    <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
