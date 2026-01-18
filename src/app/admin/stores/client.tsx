
'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

export function StoresClientConfig() {
    return (
        <Link
            href="/admin/stores/create"
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group"
        >
            <Plus size={18} />
            Add Store
        </Link>
    );
}
