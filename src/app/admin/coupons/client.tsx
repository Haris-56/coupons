
'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

export function CouponsClientConfig() {
    return (
        <Link
            href="/admin/coupons/create"
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group"
        >
            <Plus size={18} />
            Add Coupon
        </Link>
    );
}
