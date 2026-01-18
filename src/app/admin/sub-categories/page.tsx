
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getSubCategories() {
    await connectToDatabase();
    // Fetch categories that have a parentCategory (i.e. subcategories)
    const subCategories = await Category.find({ parentCategory: { $ne: null } })
        .populate('parentCategory', 'name')
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(subCategories));
}

export default async function SubCategoriesPage() {
    const subCategories = await getSubCategories();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Sub Categories</h1>
                    <p className="text-slate-500">Manage your website sub-categories</p>
                </div>
                <Link
                    href="/admin/categories/create?type=sub"
                    className="flex items-center justify-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                >
                    <Plus size={20} />
                    Add New
                </Link>
            </div>

            {/* Search & Filter - Placeholder Logic */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search sub categories..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-slate-600">Name</th>
                                <th className="p-4 font-semibold text-slate-600">Parent Category</th>
                                <th className="p-4 font-semibold text-slate-600">Slug</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        <Layers className="mx-auto mb-2 opacity-50" size={48} />
                                        No sub categories found.
                                    </td>
                                </tr>
                            ) : (
                                subCategories.map((cat: any) => (
                                    <tr key={cat._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                {cat.imageUrl ? <img src={cat.imageUrl} className="w-full h-full object-cover rounded" /> : <Layers size={14} />}
                                            </div>
                                            {cat.name}
                                        </td>
                                        <td className="p-4 text-slate-600">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                                {cat.parentCategory?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm font-mono">{cat.slug}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {cat.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/categories/${cat._id}/edit`} className="p-2 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </Link>
                                                <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
