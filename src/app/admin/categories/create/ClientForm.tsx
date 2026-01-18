'use client';

import { useActionState, useState, useRef } from 'react';
import { createCategory } from '@/actions/category';
import { ArrowLeft, Save, Upload, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

export default function ClientForm() {
    // @ts-ignore
    const [state, formAction] = useActionState(createCategory, initialState);
    const [preview, setPreview] = useState<string | null>(null);
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
        <form action={formAction} className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/categories" className="bg-white border border-secondary-200 p-2 rounded-full hover:bg-secondary-50 text-secondary-500 transition-all shadow-sm">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-secondary-900">Add New Category</h1>
                    <div className="h-1 w-10 bg-primary-600 rounded-full mt-1"></div>
                </div>
            </div>

            {state?.message && (
                <div className="p-4 rounded-lg mb-6 flex items-center gap-2 border bg-red-50 text-red-600 border-red-100">
                    <AlertCircle size={20} />
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-secondary-200 rounded-xl shadow-sm p-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase">Title <span className="text-red-500">*</span></label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                            />
                            {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
                        </div>

                        {/* Slug - Auto/Optional */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase">Slug <span className="text-secondary-400 font-normal normal-case">(Auto-generated if empty)</span></label>
                            <input
                                name="slug"
                                type="text"
                                placeholder="custom-slug-url"
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-mono bg-white"
                            />
                            {state?.errors?.slug && <p className="text-red-500 text-xs mt-1">{state.errors.slug[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                            />
                        </div>

                        {/* Icon Selector */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase flex items-center justify-between">
                                Icon
                                <span className="text-[10px] text-primary-500 font-normal normal-case cursor-pointer hover:underline">FontAwesome Class</span>
                            </label>
                            <input
                                name="icon"
                                type="text"
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                placeholder="fa-solid fa-home"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Show in Menu</label>
                                <select name="isShowInMenu" className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Featured</label>
                                <select name="isFeatured" className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>

                        {/* SEO Divider */}
                        <div className="relative pt-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-secondary-200"></div>
                            </div>
                            <div className="relative flex justify-start">
                                <span className="pr-2 bg-white text-xs font-bold text-secondary-400 uppercase tracking-widest">SEO Optimization</span>
                            </div>
                        </div>

                        {/* SEO Fields */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Meta Title</label>
                                <input
                                    name="seoTitle"
                                    type="text"
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Meta Description</label>
                                <textarea
                                    name="seoDescription"
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-secondary-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-secondary-700">Display Status</h3>
                        <select name="isActive" className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                            <option value="enabled">Enabled (Public)</option>
                            <option value="disabled">Disabled (Private)</option>
                        </select>
                    </div>

                    <div className="bg-white border border-secondary-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-secondary-700">Image <span className="text-red-500">*</span></h3>

                        <div
                            className="bg-secondary-50 border-2 border-dashed border-secondary-200 rounded-xl p-6 flex flex-col items-center justify-center text-center relative group cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {preview ? (
                                <div className="space-y-2">
                                    <img src={preview} alt="Preview" className="max-h-40 rounded-lg shadow-md mx-auto" />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removePreview(); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-lg active:scale-90"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={20} className="text-secondary-400 group-hover:text-primary-500" />
                                    </div>
                                    <span className="text-sm font-bold text-secondary-600 mb-1">Choose File</span>
                                    <span className="text-xs text-secondary-400 italic">Drag and drop or click</span>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                name="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-[10px] text-center text-secondary-400 font-bold uppercase tracking-tight">RECOMMENDED: 350 X 350</p>
                    </div>

                    <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary-200 active:scale-95 flex items-center justify-center gap-2">
                        <Save size={18} />
                        Save Category
                    </button>
                </div>
            </div>
        </form>
    );
}
