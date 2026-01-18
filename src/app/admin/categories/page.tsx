
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import { Search, Plus, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteCategory } from '@/actions/category';

export const dynamic = 'force-dynamic';

async function getCategories(searchQuery?: string, page: number = 1, limit: number = 10) {
    await connectToDatabase();
    let query = {};
    if (searchQuery) {
        query = {
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { slug: { $regex: searchQuery, $options: 'i' } }
            ]
        };
    }
    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
        Category.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Category.countDocuments(query)
    ]);

    return {
        categories: JSON.parse(JSON.stringify(categories)),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

export default async function CategoriesPage(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;
    const q = searchParams?.q || '';
    const page = parseInt(searchParams?.page || '1');
    const limit = 10;

    const { categories, total, totalPages } = await getCategories(q, page, limit);

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Categories
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>

                <Link href="/admin/categories/create" className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group">
                    <Plus size={18} /> Add Category
                </Link>
            </header>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* Search & Stats */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/30">
                    <form className="relative flex-1 w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-500 transition-colors pointer-events-none" size={18} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Find categories..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 shadow-sm transition-all"
                        />
                    </form>
                    <div className="text-slate-500 text-xs font-medium ml-auto">
                        <span className="bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-700">{total}</span> Total Records
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">S.No</th>
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4 text-center">Slug</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-32 text-center text-slate-400 font-medium italic">
                                        No categories found in registry
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat: any, index: number) => (
                                    <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-xs text-slate-400 text-center tabular-nums">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-700 group-hover:text-accent-600 transition-colors text-sm">
                                                {cat.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <code className="bg-slate-50 px-2 py-1 rounded text-[11px] text-slate-500 font-medium">/{cat.slug}</code>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <AdminActionMenu
                                                editUrl={`/admin/categories/${cat._id}/edit`}
                                                onDelete={async () => {
                                                    'use server';
                                                    return await deleteCategory(cat._id);
                                                }}
                                                itemName="category"
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
                            href={`/admin/categories?page=${Math.max(1, page - 1)}&q=${q}`}
                            className={`w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-accent-500 hover:border-accent-200 transition-all shadow-sm ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <Link
                            href={`/admin/categories?page=${Math.min(totalPages, page + 1)}&q=${q}`}
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
