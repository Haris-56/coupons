
'use client';

import { useActionState, useEffect, useState } from 'react';
import { createCoupon } from '@/actions/coupon';
import { X } from 'lucide-react';

export function CouponModal({
    isOpen,
    onClose,
    stores
}: {
    isOpen: boolean;
    onClose: () => void;
    stores: any[];
}) {
    const [state, action, isPending] = useActionState(createCoupon, undefined);

    useEffect(() => {
        if ((state as any)?.success) {
            onClose();
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Add New Coupon</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form action={action} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Coupon Title</label>
                            <input
                                name="title"
                                placeholder="e.g. 50% OFF Entire Order"
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {state?.errors?.title && <p className="text-red-500 text-xs">{state.errors.title}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
                            <input
                                name="code"
                                placeholder="SAVE50"
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {state?.errors?.code && <p className="text-red-500 text-xs">{state.errors.code}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Discount Value</label>
                            <input
                                name="discountValue"
                                placeholder="20%"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Store</label>
                        <select
                            name="storeId"
                            required
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                            <option value="">Select a Store</option>
                            {stores.map((store) => (
                                <option key={store._id} value={store._id}>{store.name}</option>
                            ))}
                        </select>
                        {state?.errors?.storeId && <p className="text-red-500 text-xs">{state.errors.storeId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (Optional)</label>
                        <input
                            type="date"
                            name="expiryDate"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <input type="checkbox" name="isExclusive" className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-slate-700">Exclusive</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <input type="checkbox" name="isFeatured" className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-slate-700">Featured</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <input type="checkbox" name="isActive" defaultChecked className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-slate-700">Active</span>
                        </label>
                    </div>

                    {state?.message && !(state as any).success && (
                        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.message}</p>
                    )}

                    <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 mt-auto">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Add Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
