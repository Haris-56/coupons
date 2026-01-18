
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-medium">Show</span>
                <select
                    defaultValue={initialLimit}
                    className="border border-slate-300 rounded-md text-sm p-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={(e) => updateParams({ limit: e.target.value })}
                >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
                <span className="text-sm text-slate-500 font-medium">entries</span>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateParams({ q });
                }}
                className="relative w-full md:w-auto"
            >
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs uppercase tracking-wider">Search:</span>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Name or Email"
                    className="w-full md:w-64 pl-16 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
            </form>
        </div>
    );
}
