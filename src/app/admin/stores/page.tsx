
import Link from 'next/link';
import { Plus, Search, ExternalLink, Store } from 'lucide-react';
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-secondary-900">Store Management</h1>
                <StoresClientConfig />
            </div>

            <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-secondary-100 flex items-center gap-4 bg-secondary-50/50">
                    <form className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search stores..."
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </form>

                    <div className="text-sm text-secondary-500 ml-auto">
                        Total: <span className="font-bold text-secondary-900">{total}</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-secondary-600">
                        <thead className="bg-secondary-50 text-secondary-700 font-semibold uppercase text-xs border-b border-secondary-200">
                            <tr>
                                <th className="px-6 py-4 w-16 text-secondary-500">Id</th>
                                <th className="px-6 py-4 w-20">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 text-center">Country</th>
                                <th className="px-6 py-4 text-center">Network</th>
                                <th className="px-6 py-4">Url/Link</th>
                                <th className="px-6 py-4">Tracking Link</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {stores.map((store: any, index: number) => (
                                <tr key={store._id} className="hover:bg-secondary-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-secondary-400 font-mono text-xs">
                                        #{(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-10 h-10 object-contain rounded border border-secondary-100 bg-white p-1" />
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-secondary-100 flex items-center justify-center text-[10px] font-bold text-secondary-400">
                                                NO IMG
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-secondary-900">
                                        {store.name}
                                    </td>
                                    <td className="px-6 py-4 text-center text-secondary-600">
                                        {store.country || 'Global'}
                                    </td>
                                    <td className="px-6 py-4 text-center text-secondary-600">
                                        {store.network || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px] truncate text-secondary-500 hover:text-primary-600 transition-colors" title={store.url}>
                                            {store.url || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px] truncate text-secondary-500 hover:text-primary-600 transition-colors" title={store.affiliateLink}>
                                            {store.affiliateLink || '-'}
                                        </div>
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
                            ))}

                            {stores.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-secondary-400">
                                        <Store className="mx-auto mb-2 opacity-50" />
                                        No stores found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-secondary-100 flex items-center justify-between text-sm text-secondary-500 bg-secondary-50/30">
                    <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries</span>
                    <div className="flex gap-1">
                        <Link
                            href={`/admin/stores?page=1&q=${q}`}
                            className={`px-3 py-1 border border-secondary-200 rounded bg-white hover:bg-secondary-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            First
                        </Link>
                        {[...Array(totalPages)].map((_, i) => {
                            const p = i + 1;
                            if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                                if (p === 2 || p === totalPages - 1) return <span key={p} className="px-2">...</span>;
                                return null;
                            }
                            return (
                                <Link
                                    key={p}
                                    href={`/admin/stores?page=${p}&q=${q}`}
                                    className={`px-3 py-1 border border-secondary-200 rounded ${page === p ? 'bg-primary-600 text-white border-primary-600' : 'bg-white hover:bg-secondary-50'}`}
                                >
                                    {p}
                                </Link>
                            );
                        })}
                        <Link
                            href={`/admin/stores?page=${Math.min(totalPages, page + 1)}&q=${q}`}
                            className={`px-3 py-1 border border-secondary-200 rounded bg-white hover:bg-secondary-50 ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Next
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
