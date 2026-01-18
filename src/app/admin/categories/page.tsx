
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import { Search, Plus, Tag } from 'lucide-react';
import Link from 'next/link';
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-secondary-900">Categories</h1>
                <Link
                    href="/admin/categories/create"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Category
                </Link>
            </div>

            <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-secondary-100 flex items-center gap-4 bg-secondary-50/50">
                    <form className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </form>
                    <div className="text-sm text-secondary-500 ml-auto">
                        Total: <span className="font-bold text-secondary-900">{total}</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-secondary-600">
                        <thead className="bg-secondary-50 text-secondary-700 font-semibold uppercase text-xs border-b border-secondary-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {categories.map((cat: any) => (
                                <tr key={cat._id} className="hover:bg-secondary-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-secondary-900">{cat.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-secondary-500">{cat.slug}</td>
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
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-secondary-400">
                                        <Tag className="mx-auto mb-2 opacity-50" />
                                        No categories found.
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
                            href={`/admin/categories?page=1&q=${q}`}
                            className={`px-3 py-1 border border-secondary-200 rounded bg-white hover:bg-secondary-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            First
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
                                    href={`/admin/categories?page=${p}&q=${q}`}
                                    className={`px-3 py-1 border border-secondary-200 rounded ${page === p ? 'bg-primary-600 text-white border-primary-600' : 'bg-white hover:bg-secondary-50'}`}
                                >
                                    {p}
                                </Link>
                            );
                        })}
                        <Link
                            href={`/admin/categories?page=${Math.min(totalPages, page + 1)}&q=${q}`}
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
