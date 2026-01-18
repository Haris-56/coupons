
'use client';

import { useActionState, useEffect, useState } from 'react';
import { createStore } from '@/actions/store';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StoreModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [state, action, isPending] = useActionState(createStore, undefined);
    const [slug, setSlug] = useState('');

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    };

    useEffect(() => {
        if ((state as any)?.success) {
            onClose();
            // Reset form/state if needed, but modal unmounts usually
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Add New Store</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form action={action} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
                            <input
                                name="name"
                                onChange={handleNameChange}
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {state?.errors?.name && <p className="text-red-500 text-xs">{state.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug</label>
                            <input
                                name="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            {state?.errors?.slug && <p className="text-red-500 text-xs">{state.errors.slug}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Affiliate Link Base</label>
                        <input
                            name="affiliateLink"
                            placeholder="https://store.com?ref=..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {state?.errors?.affiliateLink && <p className="text-red-500 text-xs">{state.errors.affiliateLink}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isFeatured" className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-slate-700">Featured Store</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="isActive" defaultChecked className="accent-blue-600 w-4 h-4" />
                            <span className="text-sm text-slate-700">Active</span>
                        </label>
                    </div>

                    {state?.message && !(state as any).success && (
                        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{state.message}</p>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">
                            Cancel
                        </button>
                        <button
                            disabled={isPending}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {isPending ? 'Saving...' : 'Create Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
