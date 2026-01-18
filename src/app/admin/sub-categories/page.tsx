
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import Link from 'next/link';
import { Plus, Search, Layers, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteCategory } from '@/actions/category';

export const dynamic = 'force-dynamic';

async function getSubCategories() {
    await connectToDatabase();
    const subCategories = await Category.find({ parentCategory: { $ne: null } })
        .populate('parentCategory', 'name')
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(subCategories));
}

export default async function SubCategoriesPage() {
    const subCategories = await getSubCategories();

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Sub Categories
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>

                <Link href="/admin/categories/create?type=sub" className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group">
                    <Plus size={18} /> Add Sub Category
                </Link>
            </header>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                {/* Toolbar */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/30">
                    <div className="relative flex-1 w-full max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent-500 transition-colors pointer-events-none" size={18} />
                        <input
                            type="text"
                            placeholder="Find sub categories..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 shadow-sm transition-all"
                        />
                    </div>
                    <div className="text-slate-500 text-xs font-medium ml-auto">
                        <span className="bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-700">{subCategories.length}</span> Total Records
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">S.No</th>
                                <th className="px-6 py-4 w-20 text-center">Logo</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Parent Category</th>
                                <th className="px-6 py-4 text-center">Slug</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-32 text-center text-slate-400 font-medium italic">
                                        <Layers className="mx-auto mb-4 opacity-20" size={48} />
                                        No sub-categories found in registry
                                    </td>
                                </tr>
                            ) : (
                                subCategories.map((cat: any, index: number) => (
                                    <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-xs text-slate-400 text-center tabular-nums">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-1.5 shadow-sm mx-auto">
                                                {cat.imageUrl ? (
                                                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <Layers size={14} className="text-slate-200" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-700 group-hover:text-accent-600 transition-colors text-sm">
                                                {cat.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-accent-50 text-accent-700 rounded-full px-3 py-1 text-[10px] font-bold">
                                                {cat.parentCategory?.name || 'ROOT'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <code className="bg-slate-50 px-2 py-1 rounded text-[11px] text-slate-500 font-medium">/{cat.slug}</code>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {cat.isActive ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                                                        Disabled
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <AdminActionMenu
                                                editUrl={`/admin/categories/${cat._id}/edit`}
                                                onDelete={async () => {
                                                    'use server';
                                                    return await deleteCategory(cat._id);
                                                }}
                                                itemName="sub-category"
                                            />
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
