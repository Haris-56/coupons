
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm({ compact = false }: { compact?: boolean }) {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    if (compact) {
        return (
            <form onSubmit={handleSearch} className="w-full relative group">
                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl focus-within:border-accent-400 focus-within:shadow-2xl focus-within:shadow-accent-500/5 transition-all duration-500">
                    <SearchIcon className="ml-5 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-accent-600" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search stores..."
                        className="w-full py-3 px-4 bg-transparent rounded-2xl focus:outline-none text-slate-900 text-[10px] font-black uppercase tracking-widest placeholder:text-slate-300"
                    />
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearch} className="max-w-3xl relative group">
            <div className="relative bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-slate-900/5 overflow-hidden p-2 focus-within:border-accent-300 transition-all duration-500">
                <div className="flex items-center">
                    <div className="pl-6 text-slate-300 group-focus-within:text-accent-500 transition-colors">
                        <SearchIcon size={22} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for stores, brands or categories..."
                        className="w-full py-5 px-6 bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-300 font-black text-base md:text-lg uppercase tracking-tight"
                    />
                    <button
                        type="submit"
                        className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-[1.25rem] font-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                    >
                        SEARCH
                    </button>
                </div>
            </div>
        </form>
    );
}
