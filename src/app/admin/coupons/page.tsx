
import { Search, Ticket, X, CheckCircle, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import { CouponsClientConfig } from './client';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteCoupon } from '@/actions/coupon';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Coupons
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>
                <CouponsClientConfig />
            </header>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* Search & Actions */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/30">
                    <form className="relative flex-1 w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-500 transition-colors pointer-events-none" size={18} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Find coupons by code or title..."
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
                                <th className="px-6 py-4">Title & Store</th>
                                <th className="px-6 py-4 text-center">Category</th>
                                <th className="px-6 py-4 text-center">Coupon Code</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-32 text-center text-slate-400 font-medium italic">
                                        No coupons found in registry
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon: any, index: number) => (
                                    <tr key={coupon._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-xs text-slate-400 text-center tabular-nums">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-1.5 shadow-sm">
                                                    {coupon.store?.logoUrl ? (
                                                        <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" />
                                                    ) : (
                                                        <Ticket className="text-slate-200 w-4 h-4" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-slate-700 group-hover:text-accent-600 transition-colors text-sm line-clamp-1">
                                                        {coupon.title}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{coupon.store?.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-slate-50 text-slate-600 rounded-full px-3 py-1 text-[10px] font-bold border border-slate-100">
                                                {coupon.category?.name || 'Category'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {coupon.code ? (
                                                <code className="bg-accent-50 text-accent-700 px-2 py-1 rounded text-[11px] font-bold border border-accent-100 uppercase">{coupon.code}</code>
                                            ) : (
                                                <span className="text-slate-300 text-[10px] font-medium italic">Automatic deal</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {coupon.isActive ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 italic">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 italic">
                                                        Disabled
                                                    </span>
                                                )}
                                            </div>
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
                            href={`/admin/coupons?page=${Math.max(1, page - 1)}&q=${q}`}
                            className={`w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-accent-500 hover:border-accent-200 transition-all shadow-sm ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <Link
                            href={`/admin/coupons?page=${Math.min(totalPages, page + 1)}&q=${q}`}
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
