
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getCategories() {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Group by category for visual separation if needed, or just a clean grid
    // Screenshot shows a simple grid with icons

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-blue-600 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Categories</h1>
                    <div className="h-1 w-16 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {categories.map((category: any) => (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="flex flex-col items-center justify-center p-6 border border-slate-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all group"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    {/* If imageUrl/icon is a class name like 'fa fa-home', render it, otherwise render styled text/image */}
                                    {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                        <i className={`text-slate-700 group-hover:text-blue-600 ${category.imageUrl}`}></i>
                                    ) : category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-contain" />
                                    ) : (
                                        <span className="text-3xl">🏷️</span>
                                    )}
                                </div>
                                <span className="font-bold text-slate-700 group-hover:text-blue-600 text-center">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* All Categories Lists Sections (As seen in lower part of screenshot) */}
            <div className="container mx-auto px-4 mt-16">
                <h2 className="text-xl font-bold text-slate-800 mb-8">All Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
                    {categories.map((category: any) => (
                        <Link
                            href={`/search?category=${category.slug}`}
                            key={category._id}
                            className="text-slate-600 hover:text-blue-600 text-sm transition-colors py-1 block"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
