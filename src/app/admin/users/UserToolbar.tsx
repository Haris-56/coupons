
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, Layers } from 'lucide-react';

export function UserToolbar({ initialLimit, initialQuery }: { initialLimit: number, initialQuery: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [q, setQ] = useState(initialQuery);

    const updateParams = (newParams: Record<string, string>) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) current.set(key, value);
            else current.delete(key);
        });
        current.set('page', '1'); // Reset to page 1 on search/limit change
        router.push(`/admin/users?${current.toString()}`);
    };

    return (
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/30">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateParams({ q });
                }}
                className="relative flex-1 w-full max-w-md group"
            >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-500 transition-colors pointer-events-none" size={18} />
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Find users..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 shadow-sm transition-all"
                />
            </form>

            <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
                    <span className="text-xs font-medium text-slate-500">Rows:</span>
                    <select
                        defaultValue={initialLimit}
                        className="bg-transparent border-none text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                        onChange={(e) => updateParams({ limit: e.target.value })}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>

                <div className="bg-slate-100 text-slate-500 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
                    <Layers size={14} />
                    <span className="text-xs font-bold text-slate-700">Registry</span>
                </div>
            </div>
        </div>
    );
}
