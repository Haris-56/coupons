
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
            <form onSubmit={handleSearch} className="w-full relative">
                <div className="relative flex items-center bg-secondary-900 border border-secondary-800 rounded-full focus-within:ring-1 focus-within:ring-primary-500/50 focus-within:bg-secondary-800 transition-all">
                    <SearchIcon className="ml-4 text-secondary-500 w-4 h-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for stores and brands..."
                        className="w-full py-2 px-3 bg-transparent rounded-full focus:outline-none text-secondary-200 text-sm placeholder:text-secondary-600 font-light"
                    />
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-secondary-900 border border-secondary-800 rounded-full shadow-2xl">
                <SearchIcon className="ml-6 text-secondary-500" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for stores like 'Nike', 'Amazon'..."
                    className="w-full py-4 px-4 bg-transparent rounded-full focus:outline-none text-secondary-100 placeholder:text-secondary-600 font-medium"
                />
                <button type="submit" className="mr-2 my-2 bg-primary-600 text-white px-8 py-2 rounded-full font-bold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-900/20">
                    Search Offers
                </button>
            </div>
        </form>
    );
}
