
'use client';

import { useActionState, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateStore } from '@/actions/store';
import { ArrowLeft, Save, Upload, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { CountrySelect } from '@/components/admin/CountrySelect';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {pending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <Save size={18} />
                    Update Store
                </>
            )}
        </button>
    );
}

export default function EditForm({ store }: { store: any }) {
    // @ts-ignore
    const [state, formAction] = useActionState(updateStore, initialState);
    const [preview, setPreview] = useState<string | null>(store.logoUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePreview = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <form action={formAction} className="pb-20 space-y-8">
            <input type="hidden" name="id" value={store._id} />

            <div className="flex items-center gap-4">
                <Link href="/admin/stores" className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 text-slate-500 transition-all shadow-sm">
                    <ArrowLeft size={18} />
                </Link>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Edit Store <span className="text-accent-500 ml-2">#{store._id.slice(-6)}</span>
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>
            </div>

            {state?.message && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center gap-3 border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{state.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        {/* Title Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Store Name <span className="text-rose-500">*</span></label>
                            <input
                                name="name"
                                type="text"
                                required
                                defaultValue={store.name}
                                placeholder="e.g. Amazon"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                            {state?.errors?.name && <p className="text-rose-500 text-xs mt-1">{state.errors.name[0]}</p>}
                        </div>

                        {/* Slug Area */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">URL Slug</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">/</span>
                                <input
                                    name="slug"
                                    type="text"
                                    defaultValue={store.slug}
                                    placeholder="store-slug"
                                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all lowercase"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                            <textarea
                                name="description"
                                rows={6}
                                defaultValue={store.description}
                                placeholder="Enter store details..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Connectivity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Affiliate Link</label>
                                <input
                                    name="affiliateLink"
                                    type="url"
                                    defaultValue={store.affiliateLink}
                                    placeholder="https://affiliate.link/..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Store URL</label>
                                <input
                                    name="url"
                                    type="url"
                                    defaultValue={store.url}
                                    placeholder="https://store.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all font-mono"
                                />
                            </div>
                        </div>

                        {/* Region & Network */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Country</label>
                                <CountrySelect name="country" defaultValue={store.country || 'Global'} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Affiliate Network</label>
                                <select
                                    name="network"
                                    defaultValue={store.network || ''}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all cursor-pointer"
                                >
                                    <option value="">None / Other</option>
                                    <option value="Admitad">Admitad</option>
                                    <option value="Commission junction">Commission junction</option>
                                    <option value="Clixgalore">Clixgalore</option>
                                    <option value="Awin">Awin</option>
                                    <option value="Admitad lite">Admitad lite</option>
                                    <option value="Share a sale">Share a sale</option>
                                    <option value="Affiliate one">Affiliate one</option>
                                    <option value="Link bux">Link bux</option>
                                    <option value="Commission factory">Commission factory</option>
                                    <option value="Affiliate future">Affiliate future</option>
                                    <option value="Rakuten">Rakuten</option>
                                    <option value="Skimlinks">Skimlinks</option>
                                    <option value="Trade doubler">Trade doubler</option>
                                    <option value="Impact radius">Impact radius</option>
                                    <option value="Trade tracker">Trade tracker</option>
                                    <option value="indoleads">indoleads</option>
                                    <option value="Pepperjam">Pepperjam</option>
                                    <option value="Paid of results">Paid of results</option>
                                </select>
                            </div>
                        </div>

                        {/* Store Options */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Featured Store</label>
                            <select name="isFeatured" defaultValue={store.isFeatured ? 'yes' : 'no'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all cursor-pointer">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>

                        {/* SEO Config */}
                        <div className="pt-4 space-y-6 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800">SEO Configuration</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Title</label>
                                    <input name="seoTitle" type="text" defaultValue={store.seoTitle} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Description</label>
                                    <textarea name="seoDescription" rows={3} defaultValue={store.seoDescription} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    {/* Public Status */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <h3 className="text-sm font-bold text-slate-800">Status</h3>
                        <select name="isActive" defaultValue={store.isActive ? 'enabled' : 'disabled'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all cursor-pointer">
                            <option value="enabled">Active</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>

                    {/* Media Upload */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-800">Store Logo</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Square recommended</p>
                        </div>

                        <div
                            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center relative group cursor-pointer hover:border-accent-500 hover:bg-white transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {preview ? (
                                <div className="space-y-4">
                                    <img src={preview} alt="Preview" className="max-h-48 rounded-xl shadow-lg mx-auto" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePreview(); }}
                                        className="absolute -top-3 -right-3 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg active:scale-90"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-4 rounded-xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <Upload size={24} className="text-slate-300 group-hover:text-accent-500 transition-colors" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">Click to upload</span>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
