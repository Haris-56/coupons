
import Link from 'next/link';
import { Plus, Search, ExternalLink, Store, Filter, ChevronLeft, ChevronRight, Globe, Network } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import { StoresClientConfig } from './client';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteStore } from '@/actions/store';

export const dynamic = 'force-dynamic';

async function getStores(searchQuery?: string, page: number = 1, limit: number = 10) {
    await connectToDatabase();
    let query = {};
    if (searchQuery) {
        query = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { country: { $regex: searchQuery, $options: 'i' } }
            ]
        };
    }
    const skip = (page - 1) * limit;
    const [stores, total] = await Promise.all([
        StoreModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        StoreModel.countDocuments(query)
    ]);

    return {
        stores: JSON.parse(JSON.stringify(stores)),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

export default async function StoresPage(props: { searchParams: Promise<{ q?: string, page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || '';
    const page = parseInt(searchParams?.page || '1');
    const limit = 10;

    const { stores, total, totalPages } = await getStores(q, page, limit);

    return (
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-secondary-500 font-black text-xs uppercase tracking-[0.3em]">Retailer Registry</h2>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Brand <span className="text-primary-500">Directory</span></h1>
                </div>
                <StoresClientConfig />
            </header>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl shadow-black/50">
                {/* Toolbar */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center gap-6 bg-white/[0.02]">
                    <form className="relative flex-1 w-full max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="SEARCH BY BRAND NAME OR REGION..."
                            className="w-full pl-16 pr-6 py-4 bg-secondary-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-secondary-600 uppercase tracking-tight"
                        />
                    </form>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="bg-primary-600/10 border border-primary-500/20 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <Store size={16} className="text-primary-500" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">{total} Total Merchants</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/20 text-secondary-500 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6 w-16 text-center">REF</th>
                                <th className="px-8 py-6 w-20">Identity</th>
                                <th className="px-8 py-6">Vndr Name</th>
                                <th className="px-8 py-6 text-center">Geo Region</th>
                                <th className="px-8 py-6 text-center">Aff Network</th>
                                <th className="px-8 py-6">Domain Index</th>
                                <th className="px-8 py-6">Tracking Pth</th>
                                <th className="px-8 py-6 text-right">Terminal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stores.map((store: any, index: number) => (
                                <tr key={store._id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-8 py-7 font-black text-[10px] text-secondary-600 group-hover:text-secondary-400 transition-colors text-center tabular-nums">
                                        #{(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500 mx-auto shadow-lg">
                                            {store.logoUrl ? (
                                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full bg-secondary-900 flex items-center justify-center text-[10px] font-black text-white uppercase">{store.name?.charAt(0)}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 font-black text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">
                                        {store.name}
                                    </td>
                                    <td className="px-8 py-7 text-center font-bold text-[10px] text-secondary-500 uppercase tracking-widest">
                                        <div className="flex items-center justify-center gap-2">
                                            <Globe size={12} className="text-secondary-700" />
                                            {store.country || 'GLOBAL'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 text-center font-bold text-[10px] text-secondary-500 uppercase tracking-widest">
                                        <div className="flex items-center justify-center gap-2">
                                            <Network size={12} className="text-secondary-700" />
                                            {store.network || '—'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 font-bold text-xs text-secondary-500 truncate max-w-[150px] lowercase italic">
                                        {store.url || 'N/A'}
                                    </td>
                                    <td className="px-8 py-7 font-bold text-xs text-secondary-500 truncate max-w-[150px] lowercase italic">
                                        {store.affiliateLink || 'N/A'}
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <AdminActionMenu
                                            editUrl={`/admin/stores/edit/${store._id}`}
                                            onDelete={async () => {
                                                'use server';
                                                return await deleteStore(store._id);
                                            }}
                                            itemName="store"
                                        />
                                    </td>
                                </tr>
                            ))}

                            {stores.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-8 py-32 text-center text-secondary-600 font-black uppercase tracking-widest bg-white/[0.01]">
                                        <Store className="mx-auto mb-6 opacity-10" size={48} />
                                        No Branch Index Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02]">
                    <span className="text-xs font-black text-secondary-500 uppercase tracking-widest italic">
                        Processing index <span className="text-white">{(page - 1) * limit + 1}</span> — <span className="text-white">{Math.min(page * limit, total)}</span> of <span className="text-white">{total}</span>
                    </span>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/stores?page=1&q=${q}`}
                            className={`w-12 h-12 flex items-center justify-center border border-white/5 rounded-2xl bg-white/5 text-secondary-500 hover:bg-white/10 hover:text-white transition-all ${page === 1 ? 'pointer-events-none opacity-30' : ''}`}
                        >
                            <ChevronLeft size={16} />
                        </Link>

                        <div className="flex gap-2 mx-2">
                            {[...Array(totalPages)].map((_, i) => {
                                const p = i + 1;
                                if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                                    if (p === 2 || p === totalPages - 1) return <span key={p} className="flex items-center px-1 text-secondary-700 font-black">...</span>;
                                    return null;
                                }
                                return (
                                    <Link
                                        key={p}
                                        href={`/admin/stores?page=${p}&q=${q}`}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xs transition-all border ${page === p ? 'bg-primary-600 text-white border-primary-500 shadow-xl shadow-primary-600/20' : 'bg-white/5 text-secondary-500 border-white/5 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {p}
                                    </Link>
                                );
                            })}
                        </div>

                        <Link
                            href={`/admin/stores?page=${Math.min(totalPages, page + 1)}&q=${q}`}
                            className={`w-12 h-12 flex items-center justify-center border border-white/5 rounded-2xl bg-white/5 text-secondary-500 hover:bg-white/10 hover:text-white transition-all ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-30' : ''}`}
                        >
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
