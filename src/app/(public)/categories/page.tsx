
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

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <section className="pt-32 pb-16">
                <div className="container-width">
                    <div className="space-y-4">
                        <h2 className="text-secondary-500 font-bold uppercase tracking-[0.2em] text-sm">Explore by Interests</h2>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">CATEGORIES</h1>
                        <p className="text-secondary-400 max-w-2xl font-medium">Find the best deals across hundreds of categories curated for your lifestyle.</p>
                    </div>
                </div>
            </section>

            <div className="container-width">
                <div className="glass-card rounded-[2rem] p-8 md:p-12 mb-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
                        {categories.map((category: any) => (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/30 hover:bg-primary-500/5 hover:-translate-y-2 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 rounded-full bg-secondary-900 border border-secondary-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all duration-500 shadow-xl">
                                    {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                        <i className={`text-2xl text-secondary-400 group-hover:text-primary-400 ${category.imageUrl}`}></i>
                                    ) : category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain brightness-0 invert opacity-50 group-hover:opacity-100 transition-all" />
                                    ) : (
                                        <span className="text-2xl">🏷️</span>
                                    )}
                                </div>
                                <span className="font-extrabold text-white group-hover:text-primary-400 text-center tracking-wider text-xs uppercase">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    <h2 className="text-2xl font-black text-white tracking-widest uppercase">Direct Directory</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 px-4">
                        {categories.map((category: any) => (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="text-secondary-400 hover:text-primary-400 font-bold text-sm transition-all flex items-center gap-3 group"
                            >
                                <span className="w-1.5 h-px bg-secondary-800 group-hover:w-4 group-hover:bg-primary-500 transition-all" />
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
