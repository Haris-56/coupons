
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
            return nameMatch && firstChar === selectedChar;
        }

        return nameMatch;
    });

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <section className="pt-24 pb-12">
                <div className="container-width">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-[2px] w-8 bg-accent-500" />
                                <h2 className="text-accent-500 font-black uppercase tracking-[0.4em] text-[10px]">Brand Directory</h2>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase p-2 pr-16 bg-transparent">
                                Stores
                            </h1>
                        </div>
                        <div className="w-full md:w-[450px]">
                            <form action="/stores" method="GET" className="relative group">
                                {selectedChar && <input type="hidden" name="char" value={selectedChar} />}
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent-500 transition-colors pointer-events-none">
                                    <Search size={22} strokeWidth={2.5} />
                                </div>
                                <input
                                    name="q"
                                    type="text"
                                    defaultValue={q}
                                    placeholder="SEARCH MERCHANTS..."
                                    className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:border-accent-300 focus:shadow-2xl focus:shadow-accent-500/5 transition-all font-black text-xs text-slate-900 placeholder:text-slate-300 uppercase tracking-widest shadow-xl shadow-slate-900/5"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-width space-y-12">
                {/* A-Z Index Bar - Updated for Deep Purple Theme */}
                <div className="sticky top-20 z-40 py-6 -mx-4 px-4 bg-white/80 backdrop-blur-xl border-y border-slate-100">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar scroll-smooth">
                        <Link
                            href={`/stores${q ? `?q=${q}` : ''}`}
                            className={cn(
                                "flex-shrink-0 min-w-[80px] h-12 flex items-center justify-center rounded-2xl text-[10px] font-black transition-all border uppercase px-5 tracking-widest",
                                !selectedChar
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20"
                                    : "bg-white text-slate-500 border-slate-100 hover:border-accent-300 hover:text-accent-600 shadow-sm"
                            )}
                        >
                            ALL
                        </Link>
                        {alphabet.map((char) => (
                            <Link
                                key={char}
                                href={`/stores?char=${char}${q ? `&q=${q}` : ''}`}
                                className={cn(
                                    "flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl text-[11px] font-black transition-all border uppercase shadow-sm",
                                    selectedChar === char
                                        ? "bg-accent-500 text-white border-accent-500 shadow-xl shadow-accent-500/20"
                                        : "bg-white text-slate-500 border-slate-100 hover:border-accent-300 hover:text-accent-600"
                                )}
                            >
                                {char}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-24">
                    {selectedChar ? (
                        <div className="animate-in fade-in duration-700">
                            <div className="flex items-center gap-6 mb-12">
                                <span className="text-5xl font-black text-accent-500 italic">[{selectedChar}]</span>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                                {filteredStores.map((store: any) => (
                                    <Link
                                        href={`/store/${store.slug}`}
                                        key={store._id}
                                        className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:border-accent-200 hover:shadow-xl hover:shadow-slate-200/50"
                                    >
                                        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-5 p-3 group-hover:rotate-6 transition-all duration-300 shadow-sm border border-slate-100">
                                            {store.logoUrl ? (
                                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="text-3xl font-black text-slate-200 uppercase">{store.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 group-hover:text-accent-600 transition-colors text-center w-full uppercase tracking-[0.2em] truncate relative z-10">{store.name}</span>
                                    </Link>
                                ))}
                                {filteredStores.length === 0 && <p className="text-slate-400 font-bold italic col-span-full py-16 uppercase tracking-[0.3em] text-[10px] text-center">No merchants found in this register.</p>}
                            </div>
                        </div>
                    ) : (
                        alphabet.map(char => {
                            const charStores = filteredStores.filter((s: any) => s.name.charAt(0).toUpperCase() === char);
                            if (charStores.length === 0) return null;
                            return (
                                <div key={char} className="animate-in fade-in duration-700">
                                    <div className="flex items-center gap-6 mb-10">
                                        <span className="text-4xl font-black text-slate-200 tracking-tighter uppercase italic">{char}</span>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-100 to-transparent" />
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                                        {charStores.map((store: any) => (
                                            <Link
                                                href={`/store/${store.slug}`}
                                                key={store._id}
                                                className="group relative bg-white border border-slate-200 p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:border-accent-200 hover:shadow-xl hover:shadow-slate-200/50"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-4 p-2.5 group-hover:rotate-6 transition-all duration-300 shadow-sm border border-slate-100">
                                                    {store.logoUrl ? (
                                                        <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <div className="text-2xl font-black text-slate-200 uppercase">{store.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <span className="text-[9px] font-black text-slate-400 group-hover:text-accent-600 transition-colors text-center w-full uppercase tracking-[0.2em] truncate relative z-10">{store.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {filteredStores.length === 0 && (
                        <div className="text-center py-40 space-y-8">
                            <p className="text-slate-400 font-bold text-xl italic uppercase tracking-widest">No brands found matching "{q}".</p>
                            <Link href="/stores" className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-slate-900/20">Clear Selection</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
