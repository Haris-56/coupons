
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import Category from '@/models/Category';
import StoreModel from '@/models/Store';
import { CouponCard } from '@/components/CouponCard';
import { Search, Tag, Store, Filter } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getSearchData(searchParams: { category?: string; store?: string; q?: string; type?: string; page?: string }) {
    await connectToDatabase();

    const query: any = { isActive: true };
    const page = parseInt(searchParams.page || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filter by Category Slug
    if (searchParams.category) {
        const category = await Category.findOne({ slug: searchParams.category });
        if (category) {
            query.category = category._id;
        }
    }

    // Filter by Store Slug
    if (searchParams.store) {
        const store = await StoreModel.findOne({ slug: searchParams.store });
        if (store) {
            query.store = store._id;
        }
    }

    // Filter by Search Query
    if (searchParams.q) {
        query.$or = [
            { title: { $regex: searchParams.q, $options: 'i' } },
            { description: { $regex: searchParams.q, $options: 'i' } }
        ];
    }

    // Filter by Type
    if (searchParams.type === 'exclusive') query.isExclusive = true;
    if (searchParams.type === 'verified') query.isVerified = true;
    if (searchParams.type === 'featured') query.isFeatured = true;

    const [coupons, total, allCategories, allStores] = await Promise.all([
        Coupon.find(query).populate('store').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Coupon.countDocuments(query),
        Category.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'coupons',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'coupons'
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    count: { $size: { $filter: { input: '$coupons', as: 'c', cond: { $eq: ['$$c.isActive', true] } } } }
                }
            },
            { $sort: { name: 1 } }
        ]),
        StoreModel.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: 'coupons',
                    localField: '_id',
                    foreignField: 'store',
                    as: 'coupons'
                }
            },
            {
                $project: {
                    name: 1,
                    slug: 1,
                    count: { $size: { $filter: { input: '$coupons', as: 'c', cond: { $eq: ['$$c.isActive', true] } } } }
                }
            },
            { $sort: { count: -1, name: 1 } },
            { $limit: 15 }
        ])
    ]);

    return {
        coupons: JSON.parse(JSON.stringify(coupons)),
        categories: JSON.parse(JSON.stringify(allCategories)),
        stores: JSON.parse(JSON.stringify(allStores)),
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

export default async function SearchPage(props: { searchParams: Promise<any> }) {
    const params = await props.searchParams;
    const { coupons, categories, stores, total, page, totalPages } = await getSearchData(params);
    const q = params.q || '';

    const buildUrl = (updatedParams: any) => {
        const newParams = new URLSearchParams();
        Object.entries({ ...params, ...updatedParams }).forEach(([key, value]) => {
            if (value && value !== 'all') newParams.set(key, value as string);
            if (value === '') newParams.delete(key);
        });
        return `/search?${newParams.toString()}`;
    };

    return (
        <div className="min-h-screen py-12 pb-32">
            <div className="container-width">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-24 h-fit space-y-6">
                        {/* Status Monitor */}
                        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/5 relative overflow-hidden">
                            <div className="relative z-10 space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Results</p>
                                </div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{total} <span className="text-accent-500 uppercase italic">FOUND</span></h2>
                            </div>
                        </div>

                        {/* Filter Console */}
                        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-900/5">
                            {/* Categories */}
                            <div className="p-8 border-b border-slate-50 space-y-5">
                                <h3 className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                                    <Tag size={12} className="text-accent-500" />
                                    Categories
                                </h3>
                                <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                    <Link
                                        href="/search"
                                        className={cn(
                                            "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                            !params.category
                                                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                : "text-slate-500 border-transparent hover:bg-accent-50 hover:text-accent-600"
                                        )}
                                    >
                                        ALL CATEGORIES
                                    </Link>
                                    {categories.map((cat: any) => (
                                        <Link
                                            href={buildUrl({ category: cat.slug, page: '1' })}
                                            key={cat._id}
                                            className={cn(
                                                "flex items-center justify-between px-5 py-3 rounded-xl text-[10px] font-bold transition-all border tracking-wide",
                                                params.category === cat.slug
                                                    ? "bg-accent-50 text-accent-600 border-accent-100 italic"
                                                    : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <span className="truncate pr-2 uppercase">{cat.name}</span>
                                            <span className="text-[8px] font-black opacity-40">{cat.count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Stores */}
                            <div className="p-8 border-b border-slate-50 space-y-5">
                                <h3 className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                                    <Store size={12} className="text-accent-500" />
                                    POPULAR STORES
                                </h3>
                                <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                    <Link
                                        href={buildUrl({ store: '', page: '1' })}
                                        className={cn(
                                            "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                            !params.store
                                                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                : "text-slate-500 border-transparent hover:bg-accent-50 hover:text-accent-600"
                                        )}
                                    >
                                        ALL STORES
                                    </Link>
                                    {stores.map((store: any) => (
                                        <Link
                                            href={buildUrl({ store: store.slug, page: '1' })}
                                            key={store._id}
                                            className={cn(
                                                "flex items-center justify-between px-5 py-3 rounded-xl text-[10px] font-bold transition-all border tracking-wide",
                                                params.store === store.slug
                                                    ? "bg-accent-50 text-accent-600 border-accent-100 italic"
                                                    : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <span className="truncate pr-2 uppercase">{store.name}</span>
                                            <span className="text-[8px] font-black opacity-40">{store.count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Logic Filters */}
                            <div className="p-8 space-y-5 bg-slate-50/30">
                                <h3 className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                                    <Filter size={12} className="text-accent-500" />
                                    QUICK FILTERS
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { label: 'ALL OFFERS', value: '' },
                                        { label: 'EXCLUSIVE', value: 'exclusive' },
                                        { label: 'VERIFIED', value: 'verified' },
                                        { label: 'FEATURED', value: 'featured' }
                                    ].map((type) => (
                                        <Link
                                            href={buildUrl({ type: type.value, page: '1' })}
                                            key={type.value}
                                            className={cn(
                                                "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                params.type === type.value || (!params.type && type.value === '')
                                                    ? "bg-white text-accent-600 border-accent-100 shadow-sm italic"
                                                    : "text-slate-400 border-transparent hover:bg-white hover:text-slate-900"
                                            )}
                                        >
                                            {type.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 w-full min-w-0">
                        <header className="mb-10 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-[2px] w-8 bg-accent-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Current Selection</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tight uppercase leading-[1.1] p-2 pr-16 bg-transparent">
                                {params.q ? (
                                    <>“<span className="text-accent-500 italic pr-3">{params.q}</span>”</>
                                ) : params.category ? (
                                    <><span className="text-accent-500 italic uppercase">{categories.find((c: any) => c.slug === params.category)?.name}</span></>
                                ) : params.store ? (
                                    <><span className="text-accent-500 italic uppercase">{stores.find((s: any) => s.slug === params.store)?.name}</span></>
                                ) : (
                                    <>Search <span className="text-accent-500 italic">Results</span></>
                                )}
                            </h1>
                        </header>

                        <div className="space-y-6">
                            {coupons.map((coupon: any) => (
                                <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                            ))}

                            {coupons.length === 0 && (
                                <div className="bg-white p-20 rounded-[2.5rem] text-center space-y-8 border border-slate-200 shadow-xl shadow-slate-900/5">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto border border-slate-100">
                                        <Search className="text-slate-300" size={32} />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">NO DEALS FOUND</h2>
                                        <p className="text-slate-400 max-w-sm mx-auto font-medium text-sm italic">We couldn't find any offers matching your current selection.</p>
                                    </div>
                                    <Link href="/search" className="inline-flex bg-slate-900 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-lg active:scale-95">
                                        RESET ALL FILTERS
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center mt-16 gap-3">
                                {page > 1 && (
                                    <Link
                                        href={buildUrl({ page: (page - 1).toString() })}
                                        className="w-12 h-12 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:text-accent-600 hover:border-accent-200 border border-slate-200 transition-all shadow-sm"
                                    >
                                        &larr;
                                    </Link>
                                )}

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                                            if (p === 2 || p === totalPages - 1) return <span key={p} className="flex items-center px-1 text-slate-300 font-bold">...</span>;
                                            return null;
                                        }
                                        return (
                                            <Link
                                                key={p}
                                                href={buildUrl({ page: p.toString() })}
                                                className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border",
                                                    page === p
                                                        ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                                        : "bg-white text-slate-500 border-slate-200 hover:text-accent-600 hover:border-accent-200 shadow-sm"
                                                )}
                                            >
                                                {p.toString().padStart(2, '0')}
                                            </Link>
                                        );
                                    })}
                                </div>

                                {page < totalPages && (
                                    <Link
                                        href={buildUrl({ page: (page + 1).toString() })}
                                        className="w-12 h-12 rounded-xl bg-white text-slate-400 flex items-center justify-center hover:text-accent-600 hover:border-accent-200 border border-slate-200 transition-all shadow-sm"
                                    >
                                        &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
