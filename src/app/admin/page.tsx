
import {
    Users,
    Store,
    Ticket,
    TrendingUp,
    Calendar,
    ExternalLink
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
            title: 'Total Users',
            value: stats.userCount,
            icon: Users,
            color: 'bg-secondary-500',
        },
        {
            title: 'Active Stores',
            value: stats.storeCount,
            icon: Store,
            color: 'bg-primary-500',
        },
        {
            title: 'Total Coupons',
            value: stats.couponCount,
            icon: Ticket,
            color: 'bg-secondary-600',
        },
        {
            title: 'Active Coupons',
            value: stats.activeCoupons,
            icon: TrendingUp,
            color: 'bg-primary-600',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">Dashboard Overview</h1>
                <p className="text-secondary-500 mt-1">Welcome back, Admin</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200 flex items-center gap-4 hover:shadow-md transition-all hover:border-primary-200 group"
                        >
                            <div className={`${card.color} p-4 rounded-xl text-white shadow-lg shadow-secondary-100 group-hover:scale-110 transition-transform`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-secondary-500 text-sm font-medium">{card.title}</p>
                                <h3 className="text-2xl font-bold text-secondary-800">{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-secondary-800 flex items-center gap-2">
                        <Ticket className="text-primary-500" size={20} />
                        Recently Added Coupons
                    </h2>
                    <Link href="/admin/coupons" className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                        View All
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary-50 text-secondary-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Store</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {stats.recentCoupons.map((coupon: any) => (
                                <tr key={coupon._id} className="hover:bg-secondary-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-secondary-900 line-clamp-1 max-w-xs">{coupon.title}</div>
                                        <div className="text-xs text-secondary-400 font-mono mt-0.5">{coupon.code || 'No Code'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {coupon.store?.logoUrl && (
                                                <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-6 h-6 object-contain rounded-full border border-secondary-200" />
                                            )}
                                            <span className="text-sm text-secondary-700 font-medium">{coupon.store?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${coupon.couponType === 'Code'
                                                ? 'bg-secondary-100 text-secondary-700 border-secondary-200'
                                                : 'bg-green-50 text-green-700 border-green-100'
                                            }`}>
                                            {coupon.couponType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-secondary-400" />
                                            {new Date(coupon.createdAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/coupons/edit/${coupon._id}`}
                                            className="text-primary-600 hover:text-primary-700 font-medium text-sm hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {stats.recentCoupons.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-secondary-500">
                                        No coupons added yet.
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
