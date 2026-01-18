
import {
    Users,
    Store,
    Ticket,
    TrendingUp,
    Calendar,
    ExternalLink,
    ChevronRight,
    Search,
    Settings
} from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import Link from 'next/link';
import { cn } from '@/lib/utils';

async function getStats() {
    await connectToDatabase();
    const userCount = await User.countDocuments();
    const storeCount = await StoreModel.countDocuments();
    const couponCount = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });

    // Fetch Recent Coupons
    const recentCoupons = await Coupon.find()
        .populate('store', 'name logoUrl')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    return {
        userCount,
        storeCount,
        couponCount,
        activeCoupons,
        recentCoupons: JSON.parse(JSON.stringify(recentCoupons))
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        {
            title: 'TOTAL USERS',
            value: stats.userCount,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            title: 'ACTIVE STORES',
            value: stats.storeCount,
            icon: Store,
            color: 'text-accent-600',
            bg: 'bg-accent-50'
        },
        {
            title: 'ALL COUPONS',
            value: stats.couponCount,
            icon: Ticket,
            color: 'text-rose-600',
            bg: 'bg-rose-50'
        },
        {
            title: 'LIVE DEALS',
            value: stats.activeCoupons,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
    ];

    return (
        <div className="space-y-12 pb-16">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase p-2 pr-16 bg-transparent">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 font-medium italic text-sm border-l-4 border-accent-500/20 pl-4 uppercase tracking-widest">System Analytics</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-[2rem] group relative overflow-hidden transition-all border border-slate-200 shadow-lg shadow-slate-900/5 hover:-translate-y-1"
                        >
                            <div className="space-y-6 relative z-10">
                                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110", card.bg, card.color)}>
                                    <Icon size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase italic">{card.title}</p>
                                    <h3 className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter">{card.value}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5">
                <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                            <Ticket size={20} />
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Recent <span className="text-accent-600">Activity</span></h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Live Database Feed</p>
                        </div>
                    </div>
                    <Link href="/admin/coupons" className="text-[10px] font-black text-slate-500 hover:text-accent-600 uppercase tracking-widest transition-all flex items-center gap-2 group px-6 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        View Records <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-400 text-[9px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Product / Offer</th>
                                <th className="px-8 py-5">Merchant</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5">Timeline</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stats.recentCoupons.map((coupon: any) => (
                                <tr key={coupon._id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-black text-slate-900 group-hover:text-accent-600 transition-colors line-clamp-1 max-w-sm uppercase tracking-tight text-xs">
                                            {coupon.title}
                                        </div>
                                        <div className="text-[9px] text-slate-400 font-black mt-1 uppercase transition-colors flex items-center gap-2 tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-accent-400 transition-colors" />
                                            {coupon.code || 'AUTO-APPLIED'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white p-2 border border-slate-100 group-hover:scale-105 transition-transform shadow-sm">
                                                {coupon.store?.logoUrl ? (
                                                    <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">{coupon.store?.name?.charAt(0)}</div>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-black group-hover:text-slate-900 transition-colors uppercase tracking-widest">{coupon.store?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border shadow-sm ${coupon.isActive
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            : 'bg-rose-50 text-rose-500 border-rose-100'
                                            }`}>
                                            {coupon.isActive ? 'ACTIVE' : 'DORMANT'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold tabular-nums italic">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(coupon.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            href={`/admin/coupons/edit/${coupon._id}`}
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-accent-600 hover:border-accent-200 transition-all shadow-sm"
                                        >
                                            <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

