'use client';

import { useActionState, useState, useRef } from 'react';
import { updateCoupon, deleteCoupon } from '@/actions/coupon';
import { ArrowLeft, Save, Upload, AlertCircle, X, Trash } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

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
        <form action={formAction} className="pb-20">
            <input type="hidden" name="id" value={coupon._id} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/coupons" className="bg-white border border-secondary-200 p-2 rounded-full hover:bg-secondary-50 text-secondary-500 transition-all shadow-sm">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-secondary-900">Edit Coupon</h1>
                        <div className="h-1 w-10 bg-primary-600 rounded-full mt-1"></div>
                    </div>
                </div>
                <button type="button" onClick={handleDelete} className="text-red-600 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <Trash size={16} /> Delete
                </button>
            </div>

            {state?.message && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2 border border-red-100">
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
                                name="title"
                                type="text"
                                defaultValue={coupon.title}
                                required
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                            />
                            {state?.errors?.title && <p className="text-red-500 text-xs mt-1">{state.errors.title[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase">Description</label>
                            <textarea
                                name="description"
                                defaultValue={coupon.description}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                            />
                        </div>

                        {/* Tag Line */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase">Tag Line</label>
                            <input
                                name="tagLine"
                                type="text"
                                defaultValue={coupon.tagLine}
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                            />
                        </div>

                        {/* Selectors Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Category <span className="text-red-500">*</span></label>
                                <select name="categoryId" defaultValue={coupon.category} required className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="">---</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                {state?.errors?.categoryId && <p className="text-red-500 text-xs mt-1">{state.errors.categoryId[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Sub Category</label>
                                <select name="subCategoryId" defaultValue={coupon.subCategory} className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="">---</option>
                                    {subCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Store <span className="text-red-500">*</span></label>
                                <select name="storeId" defaultValue={coupon.store} required className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="">---</option>
                                    {stores.map(store => (
                                        <option key={store._id} value={store._id}>{store.name}</option>
                                    ))}
                                </select>
                                {state?.errors?.storeId && <p className="text-red-500 text-xs mt-1">{state.errors.storeId[0]}</p>}
                            </div>
                        </div>

                        {/* Code & Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Code {couponType === 'Code' && <span className="text-red-500">*</span>}</label>
                                <input
                                    name="code"
                                    type="text"
                                    defaultValue={coupon.code}
                                    required={couponType === 'Code'}
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white font-mono"
                                />
                                {state?.errors?.code && <p className="text-red-500 text-xs mt-1">{state.errors.code[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Start Date</label>
                                <input
                                    name="startDate"
                                    type="date"
                                    defaultValue={coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : ''}
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Expire Date</label>
                                <input
                                    name="expiryDate"
                                    type="date"
                                    defaultValue={coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : ''}
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                />
                            </div>
                        </div>

                        {/* Tracking & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Tracking Link <span className="text-red-500">*</span></label>
                                <input
                                    name="trackingLink"
                                    type="url"
                                    defaultValue={coupon.trackingLink}
                                    required
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                />
                                {state?.errors?.trackingLink && <p className="text-red-500 text-xs mt-1">{state.errors.trackingLink[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Coupon Type</label>
                                <select
                                    name="couponType"
                                    defaultValue={coupon.couponType}
                                    onChange={(e) => setCouponType(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
                                >
                                    <option value="Code">Code</option>
                                    <option value="Deals">Deals</option>
                                    <option value="Exclusive">Exclusive</option>
                                    <option value="Freeshipping">Freeshipping</option>
                                    <option value="Clearance">Clearance</option>
                                </select>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Featured</label>
                                <select name="isFeatured" defaultValue={coupon.isFeatured ? 'yes' : 'no'} className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Verify</label>
                                <select name="isVerified" defaultValue={coupon.isVerified ? 'yes' : 'no'} className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="no">No</option>
                                    <option value="yes">Yes (Verified Badge)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">Exclusive</label>
                                <select name="isExclusive" defaultValue={coupon.isExclusive ? 'yes' : 'no'} className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>

                        {/* SEO Section */}
                        <div className="relative pt-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-secondary-200"></div>
                            </div>
                            <div className="relative flex justify-start">
                                <span className="pr-2 bg-white text-xs font-bold text-secondary-400 uppercase tracking-widest">SEO Optimization</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">SEO Title</label>
                                <input
                                    name="seoTitle"
                                    type="text"
                                    defaultValue={coupon.seoTitle}
                                    className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-secondary-500 uppercase">SEO Description</label>
                                <textarea
                                    name="seoDescription"
                                    defaultValue={coupon.seoDescription}
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
                        <select name="isActive" defaultValue={coupon.isActive ? 'enabled' : 'disabled'} className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm">
                            <option value="enabled">Enabled (Public)</option>
                            <option value="disabled">Disabled (Private)</option>
                        </select>
                    </div>

                    <div className="bg-white border border-secondary-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-secondary-700">Image / Logo</h3>

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
                                name="imageFile"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-[10px] text-center text-secondary-400 font-bold uppercase tracking-tight">RECOMMENDED: 650 X 350</p>
                    </div>

                    <div className="bg-white border border-secondary-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-secondary-700">Discount Label</h3>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary-500 uppercase">Value</label>
                            <input
                                name="discountValue"
                                type="text"
                                defaultValue={coupon.discountValue}
                                placeholder="e.g. 50% OFF"
                                className="w-full px-4 py-2.5 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary-200 active:scale-95 flex items-center justify-center gap-2">
                        <Save size={18} />
                        Update Coupon
                    </button>
                </div>
            </div>
        </form>
    );
}
