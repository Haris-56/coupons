
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Plus, Search, Store, Filter, ChevronLeft, ChevronRight, Globe, Network } from 'lucide-react';
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
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Stores
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>
                <StoresClientConfig />
            </header>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* Search & Actions */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/30">
                    <form className="relative flex-1 w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-500 transition-colors pointer-events-none" size={18} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Find stores..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 shadow-sm transition-all"
                        />
                    </form>

                    <div className="text-slate-500 text-xs font-medium ml-auto">
                        <span className="bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-700">{total}</span> Total Records
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">S.No</th>
                                <th className="px-6 py-4 w-20 text-center">Logo</th>
                                <th className="px-6 py-4">Store Name</th>
                                <th className="px-6 py-4 text-center">Country</th>
                                <th className="px-6 py-4 text-center">Network</th>
                                <th className="px-6 py-4">Direct URL</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stores.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-32 text-center text-slate-400 font-medium italic">
                                        No stores found in registry
                                    </td>
                                </tr>
                            ) : (
                                stores.map((store: any, index: number) => (
                                    <tr key={store._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-xs text-slate-400 text-center tabular-nums">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-1.5 shadow-sm mx-auto">
                                                {store.logoUrl ? (
                                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-300 uppercase">{store.name?.charAt(0)}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-700 group-hover:text-accent-600 transition-colors text-sm">
                                                {store.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs text-slate-500 font-medium">
                                                {store.country || 'Global'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs text-slate-500 font-medium">
                                                {store.network || '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[11px] text-slate-400 truncate max-w-[150px] inline-block font-mono">
                                                {store.url || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
                    <span className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{(page - 1) * limit + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-slate-900 font-bold">{total}</span>
                    </span>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/stores?page=${Math.max(1, page - 1)}&q=${q}`}
                            className={`w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-accent-500 hover:border-accent-200 transition-all shadow-sm ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <Link
                            href={`/admin/stores?page=${Math.min(totalPages, page + 1)}&q=${q}`}
                            className={`w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-accent-500 hover:border-accent-200 transition-all shadow-sm ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
