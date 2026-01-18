
import { Search, Ticket, X, CheckCircle } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import { CouponsClientConfig } from './client';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteCoupon } from '@/actions/coupon';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getData(searchQuery?: string, page: number = 1, limit: number = 10) {
    await connectToDatabase();
    let query = {};
    if (searchQuery) {
        query = {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { code: { $regex: searchQuery, $options: 'i' } }
            ]
        };
    }
    const skip = (page - 1) * limit;
    const [coupons, total, stores] = await Promise.all([
        Coupon.find(query).populate('store').populate('category').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Coupon.countDocuments(query),
        StoreModel.find({ isActive: true }).select('name _id')
    ]);

    return {
        coupons: JSON.parse(JSON.stringify(coupons)),
        stores: JSON.parse(JSON.stringify(stores)),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

export default async function CouponsPage(props: { searchParams: Promise<{ q?: string, page?: string }> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || '';
    const page = parseInt(searchParams?.page || '1');
    const limit = 10;

    const { coupons, stores, total, totalPages } = await getData(q, page, limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-secondary-900">Coupon Management</h1>
                <CouponsClientConfig />
            </div>

            <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-secondary-100 flex items-center gap-4 bg-secondary-50/50">
                    <form className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search coupons..."
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
                                <th className="px-6 py-4 w-20">ID</th>
                                <th className="px-6 py-4 w-24">Image</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-center">Code</th>
                                <th className="px-6 py-4 text-center">Featured</th>
                                <th className="px-6 py-4 text-center">Verify</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {coupons.map((coupon: any, index: number) => (
                                <tr key={coupon._id} className="hover:bg-secondary-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-secondary-400 text-center">
                                        #{(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-10 bg-secondary-100 rounded overflow-hidden border border-secondary-200 flex items-center justify-center">
                                            {coupon.store?.logoUrl ? (
                                                <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <Ticket className="text-secondary-300 w-5 h-5" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-secondary-900 line-clamp-2 max-w-[250px]">{coupon.title}</span>
                                            <span className="text-xs text-secondary-400 mt-0.5">{coupon.store?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary-600">
                                        {coupon.category?.name || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {coupon.code ? (
                                            <code className="text-xs font-bold text-secondary-700 bg-secondary-100 px-1.5 py-0.5 rounded">{coupon.code}</code>
                                        ) : (
                                            <span className="text-secondary-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {coupon.isFeatured ? (
                                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-amber-100 text-amber-500">
                                                <CheckCircle size={14} />
                                            </span>
                                        ) : (
                                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-300">
                                                <X size={14} />
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {coupon.isVerified ? (
                                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-500">
                                                <CheckCircle size={14} />
                                            </span>
                                        ) : (
                                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-300">
                                                <X size={14} />
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {coupon.isActive ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                                                Enabled
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
                                                Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <AdminActionMenu
                                            editUrl={`/admin/coupons/edit/${coupon._id}`}
                                            onDelete={async () => {
                                                'use server';
                                                return await deleteCoupon(coupon._id);
                                            }}
                                            itemName="coupon"
                                        />
                                    </td>
                                </tr>
                            ))}

                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-secondary-400">
                                        <Ticket className="mx-auto mb-2 opacity-50" />
                                        No coupons found.
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
                            href={`/admin/coupons?page=1&q=${q}`}
                            className={`px-3 py-1 border border-secondary-200 rounded bg-white hover:bg-secondary-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            First
                        </Link>
                        <Link
                            href={`/admin/coupons?page=${Math.max(1, page - 1)}&q=${q}`}
                            className={`px-3 py-1 border border-secondary-200 rounded bg-white hover:bg-secondary-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Previous
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
                                    href={`/admin/coupons?page=${p}&q=${q}`}
                                    className={`px-3 py-1 border border-secondary-200 rounded ${page === p ? 'bg-primary-600 text-white border-primary-600' : 'bg-white hover:bg-secondary-50'}`}
                                >
                                    {p}
                                </Link>
                            );
                        })}

                        <Link
                            href={`/admin/coupons?page=${Math.min(totalPages, page + 1)}&q=${q}`}
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
