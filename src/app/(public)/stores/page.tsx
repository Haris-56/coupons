
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
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary-600 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Stores</h1>
                    <div className="h-1 w-16 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 space-y-8">
                {/* Search & Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative mb-8">
                        <form action="/stores" method="GET">
                            {selectedChar && <input type="hidden" name="char" value={selectedChar} />}
                            <input
                                name="q"
                                type="text"
                                defaultValue={q}
                                placeholder="Search your favorite store..."
                                className="w-full pl-12 pr-4 py-3 border border-secondary-200 rounded-full focus:outline-none focus:border-primary-500 transition-all font-medium text-secondary-800"
                            />
                            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400">
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* A-Z Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link
                            href={`/stores${q ? `?q=${q}` : ''}`}
                            className={cn(
                                "w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold transition-all",
                                !selectedChar
                                    ? "bg-primary-600 text-white shadow-md"
                                    : "bg-secondary-100 text-secondary-600 hover:bg-white hover:shadow-md hover:text-primary-600"
                            )}
                        >
                            ALL
                        </Link>
                        {alphabet.map((char) => (
                            <Link
                                key={char}
                                href={`/stores?char=${char}${q ? `&q=${q}` : ''}`}
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold transition-all",
                                    selectedChar === char
                                        ? "bg-primary-600 text-white shadow-md"
                                        : "bg-secondary-100 text-secondary-600 hover:bg-white hover:shadow-md hover:text-primary-600"
                                )}
                            >
                                {char}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stores Grid */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="space-y-12">
                        {/* Group by Letter just for visuals, or just list them if filtered */}
                        {selectedChar ? (
                            <div>
                                <h2 className="text-2xl font-bold text-secondary-800 mb-6 border-b border-secondary-100 pb-2">{selectedChar}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                    {filteredStores.map((store: any) => (
                                        <Link
                                            href={`/store/${store.slug}`}
                                            key={store._id}
                                            className="flex items-center gap-4 group p-3 rounded-xl hover:bg-secondary-50 transition-all border border-transparent hover:border-secondary-100"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-white shadow-sm border border-secondary-100 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                                                {store.logoUrl ? (
                                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="text-lg font-bold text-secondary-300">{store.name.charAt(0)}</div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-secondary-700 group-hover:text-primary-600 transition-colors">{store.name}</span>
                                        </Link>
                                    ))}
                                    {filteredStores.length === 0 && <p className="text-secondary-400 italic">No stores found.</p>}
                                </div>
                            </div>
                        ) : (
                            // Show all filtered stores grouped by letter
                            <>
                                {alphabet.map(char => {
                                    const charStores = filteredStores.filter((s: any) => s.name.charAt(0).toUpperCase() === char);
                                    if (charStores.length === 0) return null;
                                    return (
                                        <div key={char}>
                                            <h2 className="text-2xl font-bold text-secondary-800 mb-6 border-b border-secondary-100 pb-2">{char}</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                                {charStores.map((store: any) => (
                                                    <Link
                                                        href={`/store/${store.slug}`}
                                                        key={store._id}
                                                        className="flex items-center gap-4 group p-3 rounded-xl hover:bg-secondary-50 transition-all border border-transparent hover:border-secondary-100"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg bg-white shadow-sm border border-secondary-100 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                                                            {store.logoUrl ? (
                                                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <div className="text-lg font-bold text-secondary-300">{store.name.charAt(0)}</div>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-bold text-secondary-700 group-hover:text-primary-600 transition-colors">{store.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                {filteredStores.length === 0 && (
                                    <div className="text-center py-20">
                                        <p className="text-secondary-400 italic text-lg text-center w-full">No stores found matching "{q}".</p>
                                        <Link href="/stores" className="text-primary-600 font-bold hover:underline mt-4 inline-block">View all stores</Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
