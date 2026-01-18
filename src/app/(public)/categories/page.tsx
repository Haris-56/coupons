
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
        <div className="min-h-screen pb-32">
            {/* Header */}
            <section className="pt-24 pb-12">
                <div className="container-width">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-[2px] w-8 bg-accent-500" />
                            <h2 className="text-accent-500 font-black uppercase tracking-[0.4em] text-[10px]">Explore by Interests</h2>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase p-2 pr-16 bg-transparent">
                            Categories
                        </h1>
                        <p className="text-slate-500 max-w-2xl font-medium italic text-lg leading-relaxed border-l-4 border-accent-500/20 pl-6">Find the best deals across hundreds of categories curated for your lifestyle.</p>
                    </div>
                </div>
            </section>

            <div className="container-width">
                <div className="bg-white border border-slate-200 shadow-2xl shadow-slate-900/5 rounded-[2.5rem] p-10 md:p-16 mb-20 overflow-hidden relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 relative z-10">
                        {categories.map((category: any) => (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-accent-300 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 group-hover:rotate-6 transition-all shadow-sm">
                                    {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                        <i className={`text-2xl text-slate-400 group-hover:text-accent-600 ${category.imageUrl}`}></i>
                                    ) : category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain" />
                                    ) : (
                                        <span className="text-2xl">🏷️</span>
                                    )}
                                </div>
                                <span className="font-black text-slate-400 group-hover:text-accent-600 text-center tracking-[0.2em] text-[9px] uppercase w-full truncate">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic pr-8">DEAL DIRECTORY</h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-6 px-4">
                        {categories.map((category: any) => (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="text-slate-400 hover:text-accent-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-4 group"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-accent-500 transition-all" />
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
