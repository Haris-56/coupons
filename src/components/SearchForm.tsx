
'use client';

import { Search as SearchIcon, Command } from 'lucide-react';
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
                <div className="relative flex items-center bg-secondary-900/40 backdrop-blur-md border border-white/5 rounded-xl focus-within:border-primary-500/50 focus-within:bg-secondary-900/60 transition-all duration-300">
                    <SearchIcon className="ml-4 text-secondary-500 w-4 h-4 transition-colors group-focus-within:text-primary-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search stores..."
                        className="w-full py-2.5 px-3 bg-transparent rounded-xl focus:outline-none text-secondary-200 text-sm placeholder:text-secondary-600 font-medium"
                    />
                    <div className="mr-3 px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-[10px] text-secondary-500 font-mono hidden lg:block">
                        /
                    </div>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
            {/* Soft glow behind the search bar */}
            <div className="absolute -inset-2 bg-primary-600/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative bg-secondary-950/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden p-1.5 focus-within:border-primary-500/30 transition-all duration-500">
                <div className="flex items-center px-4">
                    <Command className="text-secondary-500 w-5 h-5 group-focus-within:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What are you looking for today? (e.g. Nike, Adidas, Amazon)"
                        className="w-full py-5 px-5 bg-transparent focus:outline-none text-white placeholder:text-secondary-600 font-medium text-lg"
                    />
                    <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-primary-600/20 hover:shadow-primary-600/40 active:scale-95 flex items-center gap-2"
                    >
                        <SearchIcon size={18} />
                        <span className="hidden sm:inline">Explore</span>
                    </button>
                </div>
            </div>
        </form>
    );
}
