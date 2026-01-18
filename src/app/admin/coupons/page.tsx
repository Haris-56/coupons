
import { Search, Ticket, X, CheckCircle, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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
        <div className="space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-secondary-500 font-black text-xs uppercase tracking-[0.3em]">Curation Hub</h2>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Coupon <span className="text-primary-500">Database</span></h1>
                </div>
                <CouponsClientConfig />
            </header>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl shadow-black/50">
                {/* Toolbar */}
                <div className="p-8 border-b border-white/5 flex flex-col md:flex-row items-center gap-6 bg-white/[0.02]">
                    <form className="relative flex-1 w-full max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="SEARCH BY CODE OR PRODUCT TITLE..."
                            className="w-full pl-16 pr-6 py-4 bg-secondary-900 border border-white/5 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-secondary-600 uppercase tracking-tight"
                        />
                    </form>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="bg-white/5 border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <Filter size={16} className="text-secondary-500" />
                            <span className="text-xs font-black text-secondary-400 uppercase tracking-widest">Filters Applied: 0</span>
                        </div>
                        <div className="bg-primary-600/10 border border-primary-500/20 px-6 py-4 rounded-2xl flex items-center gap-3">
                            <Ticket size={16} className="text-primary-500" />
                            <span className="text-xs font-black text-white uppercase tracking-widest">{total} Total Deals</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/20 text-secondary-500 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6 w-20 text-center">REF</th>
                                <th className="px-8 py-6">Identity</th>
                                <th className="px-8 py-6">Context</th>
                                <th className="px-8 py-6 text-center">Auth Code</th>
                                <th className="px-8 py-6 text-center">Premium</th>
                                <th className="px-8 py-6 text-center">Verification</th>
                                <th className="px-8 py-6 text-center">System State</th>
                                <th className="px-8 py-6 text-right">Terminal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {coupons.map((coupon: any, index: number) => (
                                <tr key={coupon._id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-8 py-7 font-black text-[10px] text-secondary-600 group-hover:text-secondary-400 transition-colors text-center tabular-nums">
                                        #{(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-10 bg-white rounded-xl overflow-hidden border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-500">
                                                {coupon.store?.logoUrl ? (
                                                    <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <Ticket className="text-secondary-900 w-5 h-5" />
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-white group-hover:text-primary-400 transition-colors line-clamp-1 max-w-[200px] uppercase tracking-tight">{coupon.title}</span>
                                                <span className="text-[10px] font-black text-secondary-600 uppercase tracking-widest mt-1">{coupon.store?.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 font-bold text-xs text-secondary-500 uppercase">
                                        {coupon.category?.name || 'GENERIC'}
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        {coupon.code ? (
                                            <code className="text-[10px] font-black text-primary-400 bg-primary-600/10 border border-primary-500/20 px-3 py-1.5 rounded-lg uppercase tracking-widest">{coupon.code}</code>
                                        ) : (
                                            <span className="text-secondary-700 font-black">—</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        {coupon.isFeatured ? (
                                            <div className="inline-flex justify-center items-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                                                <CheckCircle size={14} />
                                            </div>
                                        ) : (
                                            <div className="inline-flex justify-center items-center w-8 h-8 rounded-xl bg-white/5 text-secondary-700 border border-white/5">
                                                <X size={14} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        {coupon.isVerified ? (
                                            <div className="inline-flex justify-center items-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                                <CheckCircle size={14} />
                                            </div>
                                        ) : (
                                            <div className="inline-flex justify-center items-center w-8 h-8 rounded-xl bg-white/5 text-secondary-700 border border-white/5">
                                                <X size={14} />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-7 text-center">
                                        {coupon.isActive ? (
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
                                                LIVE
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-red-600/10 text-red-400 border border-red-500/20">
                                                OFFLINE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-7 text-right">
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
                                    <td colSpan={9} className="px-8 py-32 text-center text-secondary-600 font-black uppercase tracking-widest bg-white/[0.01]">
                                        <Ticket className="mx-auto mb-6 opacity-10" size={48} />
                                        No Data Segments Found
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
                            href={`/admin/coupons?page=1&q=${q}`}
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
                                        href={`/admin/coupons?page=${p}&q=${q}`}
                                        className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xs transition-all border ${page === p ? 'bg-primary-600 text-white border-primary-500 shadow-xl shadow-primary-600/20' : 'bg-white/5 text-secondary-500 border-white/5 hover:bg-white/10 hover:text-white'}`}
                                    >
                                        {p}
                                    </Link>
                                );
                            })}
                        </div>

                        <Link
                            href={`/admin/coupons?page=${Math.min(totalPages, page + 1)}&q=${q}`}
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
