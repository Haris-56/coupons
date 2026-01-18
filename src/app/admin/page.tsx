
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
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'ACTIVE STORES',
            value: stats.storeCount,
            icon: Store,
            color: 'text-primary-500',
            bg: 'bg-primary-500/10'
        },
        {
            title: 'ALL COUPONS',
            value: stats.couponCount,
            icon: Ticket,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            title: 'LIVE DEALS',
            value: stats.activeCoupons,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
    ];

    return (
        <div className="space-y-12 pb-20">
            <header className="space-y-2">
                <h2 className="text-secondary-500 font-black text-xs uppercase tracking-[0.3em]">System Intelligence</h2>
                <h1 className="text-4xl font-black text-white tracking-tighter">DASHBOARD <span className="text-primary-500 italic">OVERVIEW</span></h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="glass-card p-8 rounded-3xl group relative overflow-hidden transition-all duration-500 hover:border-primary-500/30"
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                                <Icon size={64} />
                            </div>
                            <div className="space-y-6 relative z-10">
                                <div className={card.bg + " w-12 h-12 rounded-2xl flex items-center justify-center " + card.color + " border border-white/5 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <p className="text-secondary-500 text-[10px] font-black tracking-[0.2em] uppercase mb-1">{card.title}</p>
                                    <h3 className="text-3xl font-black text-white tabular-nums">{card.value}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center text-primary-500 border border-primary-500/20">
                            <Ticket size={20} />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase">Recent <span className="text-primary-500">Activity</span></h2>
                    </div>
                    <Link href="/admin/coupons" className="text-xs font-black text-secondary-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group">
                        View Database <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/20 text-secondary-500 text-[10px] uppercase font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Product/Offer</th>
                                <th className="px-8 py-5">Retailer</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Timestamp</th>
                                <th className="px-8 py-5 text-right flex justify-end items-center gap-2"><Settings className="text-secondary-600" size={14} /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.recentCoupons.map((coupon: any) => (
                                <tr key={coupon._id} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-1 max-w-sm">{coupon.title}</div>
                                        <div className="text-[10px] text-secondary-600 font-black mt-1.5 uppercase hover:text-secondary-400 transition-colors cursor-pointer flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full border border-secondary-800" />
                                            {coupon.code || 'Auto-Applied'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white p-1 border border-white/10 group-hover:scale-110 transition-transform">
                                                {coupon.store?.logoUrl ? (
                                                    <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <div className="w-full h-full bg-secondary-900 flex items-center justify-center text-[10px] font-black text-white uppercase">{coupon.store?.name?.charAt(0)}</div>
                                                )}
                                            </div>
                                            <span className="text-sm text-secondary-400 font-bold group-hover:text-white transition-colors uppercase tracking-tight">{coupon.store?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${coupon.couponType === 'Code'
                                            ? 'bg-primary-600/10 text-primary-400 border-primary-500/20'
                                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}>
                                            {coupon.couponType}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-secondary-500 text-xs font-bold tabular-nums">
                                            <Calendar size={14} className="text-secondary-700" />
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
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-secondary-500 hover:text-white hover:bg-primary-600 transition-all shadow-xl"
                                        >
                                            <ExternalLink size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentCoupons.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-secondary-600 font-bold italic">
                                        System database is currently empty.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
