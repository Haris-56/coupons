
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStores() {
    await connectToDatabase();
    const stores = await StoreModel.find({ isActive: true }).select('name slug logoUrl').sort({ name: 1 });
    return JSON.parse(JSON.stringify(stores));
}

export default async function StoresPage(props: { searchParams: Promise<{ char?: string; q?: string }> }) {
    const searchParams = await props.searchParams;
    const stores = await getStores();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

    const selectedChar = (searchParams.char || '').toUpperCase();
    const q = (searchParams.q || '').toLowerCase();

    const filteredStores = stores.filter((store: any) => {
        const nameMatch = q ? store.name.toLowerCase().includes(q) : true;

        if (selectedChar) {
            const firstChar = store.name.charAt(0).toUpperCase();
            const charMatch = /^\d/.test(selectedChar)
                ? firstChar === selectedChar
                : firstChar === selectedChar;
            return nameMatch && charMatch;
        }

        return nameMatch;
    });

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <section className="pt-32 pb-16">
                <div className="container-width">
                    <div className="space-y-4">
                        <h2 className="text-secondary-500 font-bold uppercase tracking-[0.2em] text-sm">Brand Directory</h2>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none">STORES</h1>
                        <p className="text-secondary-400 max-w-2xl font-medium">Browse our full collection of partner retailers and exclusive boutiques.</p>
                    </div>
                </div>
            </section>

            <div className="container-width space-y-12">
                {/* Search & Filter */}
                <div className="glass-card rounded-3xl p-8 md:p-10">
                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative mb-12">
                        <form action="/stores" method="GET">
                            {selectedChar && <input type="hidden" name="char" value={selectedChar} />}
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                <input
                                    name="q"
                                    type="text"
                                    defaultValue={q}
                                    placeholder="Search your favorite store..."
                                    className="w-full pl-14 pr-6 py-4 bg-secondary-900/50 border border-white/5 rounded-2xl focus:outline-none focus:border-primary-500/50 focus:bg-secondary-900 transition-all font-bold text-white placeholder:text-secondary-600"
                                />
                            </div>
                        </form>
                    </div>

                    {/* A-Z Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link
                            href={`/stores${q ? `?q=${q}` : ''}`}
                            className={cn(
                                "min-w-[48px] h-12 flex items-center justify-center rounded-xl text-xs font-black transition-all border uppercase px-4",
                                !selectedChar
                                    ? "bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-600/20"
                                    : "bg-white/5 text-secondary-400 border-white/5 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            ALL
                        </Link>
                        {alphabet.map((char) => (
                            <Link
                                key={char}
                                href={`/stores?char=${char}${q ? `&q=${q}` : ''}`}
                                className={cn(
                                    "w-12 h-12 flex items-center justify-center rounded-xl text-xs font-black transition-all border uppercase",
                                    selectedChar === char
                                        ? "bg-primary-600 text-white border-primary-500 shadow-lg shadow-primary-600/20"
                                        : "bg-white/5 text-secondary-400 border-white/5 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {char}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stores Grid */}
                <div className="space-y-20">
                    {selectedChar ? (
                        <div className="animate-in fade-in duration-700">
                            <h2 className="text-4xl font-black text-white mb-10 border-b border-white/5 pb-6">
                                <span className="text-primary-500">#</span> {selectedChar}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {filteredStores.map((store: any) => (
                                    <Link
                                        href={`/store/${store.slug}`}
                                        key={store._id}
                                        className="group glass-card p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:border-primary-500/30"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-4 p-2 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm">
                                            {store.logoUrl ? (
                                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="text-2xl font-black text-secondary-900 uppercase">{store.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black text-secondary-500 group-hover:text-primary-400 transition-colors text-center w-full uppercase tracking-widest truncate">{store.name}</span>
                                    </Link>
                                ))}
                                {filteredStores.length === 0 && <p className="text-secondary-500 font-bold italic col-span-full py-10">No stores found under this section.</p>}
                            </div>
                        </div>
                    ) : (
                        alphabet.map(char => {
                            const charStores = filteredStores.filter((s: any) => s.name.charAt(0).toUpperCase() === char);
                            if (charStores.length === 0) return null;
                            return (
                                <div key={char} className="animate-in fade-in duration-700">
                                    <h2 className="text-4xl font-black text-white mb-10 border-b border-white/5 pb-6">
                                        <span className="text-primary-500">#</span> {char}
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                        {charStores.map((store: any) => (
                                            <Link
                                                href={`/store/${store.slug}`}
                                                key={store._id}
                                                className="group glass-card p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:border-primary-500/30"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-4 p-2 grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm">
                                                    {store.logoUrl ? (
                                                        <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="text-2xl font-black text-secondary-900 uppercase">{store.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black text-secondary-500 group-hover:text-primary-400 transition-colors text-center w-full uppercase tracking-widest truncate">{store.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {filteredStores.length === 0 && (
                        <div className="text-center py-32 space-y-6">
                            <p className="text-secondary-500 font-bold text-xl italic">No brands found matching "{q}".</p>
                            <Link href="/stores" className="inline-flex items-center gap-2 bg-primary-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest hover:bg-primary-500 transition-all">Clear Selection</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
