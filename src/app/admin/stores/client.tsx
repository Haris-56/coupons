
'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

export function StoresClientConfig() {
    return (
        <Link
            href="/admin/stores/create"
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-primary-200"
        >
            <Plus size={18} />
            Add Store
        </Link>
    );
}
