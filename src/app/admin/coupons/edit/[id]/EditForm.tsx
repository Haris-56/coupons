
'use client';

import { useActionState, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateCoupon, deleteCoupon } from '@/actions/coupon';
import { ArrowLeft, Save, Upload, AlertCircle, X, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
                    Update Coupon
                </>
            )}
        </button>
    );
}

export default function EditForm({ coupon, stores, categories }: { coupon: any, stores: any[], categories: any[] }) {
    // @ts-ignore
    const [state, formAction] = useActionState(updateCoupon, initialState);
    const [preview, setPreview] = useState<string | null>(coupon.imageUrl || null);
    const [couponType, setCouponType] = useState(coupon.couponType || 'Code');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mainCategories = categories.filter(c => !c.parentCategory);
    const subCategories = categories.filter(c => c.parentCategory);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert('Image size exceeds 3MB limit');
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
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

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        await deleteCoupon(coupon._id);
    };

    return (
        <form action={formAction} className="pb-20 space-y-8">
            <input type="hidden" name="id" value={coupon._id} />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/coupons" className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 text-slate-500 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            Edit Coupon <span className="text-accent-500 ml-2">#{coupon._id.slice(-6)}</span>
                        </h1>
                        <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                >
                    <Trash2 size={16} /> Delete Coupon
                </button>
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
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Coupon Title <span className="text-rose-500">*</span></label>
                            <input
                                name="title"
                                type="text"
                                required
                                defaultValue={coupon.title}
                                placeholder="e.g. 20% Off All Orders"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                            {state?.errors?.title && <p className="text-rose-500 text-xs mt-1">{state.errors.title[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Description</label>
                            <textarea
                                name="description"
                                defaultValue={coupon.description}
                                rows={3}
                                placeholder="Enter coupon details..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Tag Line */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tag Line</label>
                            <input
                                name="tagLine"
                                type="text"
                                defaultValue={coupon.tagLine}
                                placeholder="e.g. Limited Time Offer"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {/* Selectors */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category <span className="text-rose-500">*</span></label>
                                <select name="categoryId" defaultValue={coupon.category} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm cursor-pointer">
                                    <option value="">Select Category</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sub Category</label>
                                <select name="subCategoryId" defaultValue={coupon.subCategory} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm cursor-pointer">
                                    <option value="">None</option>
                                    {subCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Store <span className="text-rose-500">*</span></label>
                                <select name="storeId" defaultValue={coupon.store} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm cursor-pointer">
                                    <option value="">Select Store</option>
                                    {stores.map(store => (
                                        <option key={store._id} value={store._id}>{store.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Values & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Coupon Code {couponType === 'Code' && <span className="text-rose-500">*</span>}</label>
                                <input
                                    name="code"
                                    type="text"
                                    required={couponType === 'Code'}
                                    defaultValue={coupon.code}
                                    placeholder="e.g. SAVE20"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tracking Link <span className="text-rose-500">*</span></label>
                                <input
                                    name="trackingLink"
                                    type="url"
                                    required
                                    defaultValue={coupon.trackingLink}
                                    placeholder="https://merchant.link/..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Dates & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Start Date</label>
                                <input
                                    name="startDate"
                                    type="date"
                                    defaultValue={coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : ''}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Expiry Date</label>
                                <input
                                    name="expiryDate"
                                    type="date"
                                    defaultValue={coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ''}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Coupon Type</label>
                                <select
                                    name="couponType"
                                    defaultValue={coupon.couponType}
                                    onChange={(e) => setCouponType(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm cursor-pointer"
                                >
                                    <option value="Code">Code</option>
                                    <option value="Deals">Deals</option>
                                    <option value="Exclusive">Exclusive</option>
                                    <option value="Freeshipping">Freeshipping</option>
                                    <option value="Clearance">Clearance</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { name: 'isFeatured', label: 'Featured', val: coupon.isFeatured ? 'yes' : 'no' },
                                { name: 'isVerified', label: 'Verified', val: coupon.isVerified ? 'yes' : 'no' },
                                { name: 'isExclusive', label: 'Exclusive', val: coupon.isExclusive ? 'yes' : 'no' },
                                { name: 'isActive', label: 'Status', val: coupon.isActive ? 'enabled' : 'disabled', options: [{ v: 'enabled', l: 'Active' }, { v: 'disabled', l: 'Disabled' }] }
                            ].map((item: any) => (
                                <div key={item.name} className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{item.label}</label>
                                    <select name={item.name} defaultValue={item.val} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-accent-500 transition-all shadow-sm cursor-pointer">
                                        {item.options ? item.options.map((o: any) => <option key={o.v} value={o.v}>{o.l}</option>) : (
                                            <>
                                                <option value="no">No</option>
                                                <option value="yes">Yes</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="space-y-6">
                    {/* Media Upload */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-sm font-bold text-slate-800">Coupon Image</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Recommended: 600x400px</p>
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

                    {/* Discount Label */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <h3 className="text-sm font-bold text-slate-800">Banner Details</h3>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Discount Label</label>
                            <input
                                name="discountValue"
                                type="text"
                                defaultValue={coupon.discountValue}
                                placeholder="e.g. 50% OFF"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-accent-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* SEO Config */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <h3 className="text-sm font-bold text-slate-800">SEO Settings</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Title</label>
                                <input name="seoTitle" type="text" defaultValue={coupon.seoTitle} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">SEO Description</label>
                                <textarea name="seoDescription" rows={3} defaultValue={coupon.seoDescription} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
