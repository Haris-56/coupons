
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
        <div className="min-h-screen py-24 pb-32">
            <div className="container-width">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-8 lg:sticky lg:top-32 h-fit">
                        {/* Summary Card */}
                        <div className="glass-card p-6 rounded-3xl mb-4 border-primary-500/10 bg-primary-500/5">
                            <p className="text-secondary-400 font-bold uppercase tracking-widest text-[10px] mb-1">Search Results</p>
                            <h2 className="text-2xl font-black text-white">{total} <span className="text-primary-500">Deals</span> Found</h2>
                        </div>

                        {/* Categories Filter */}
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Tag size={14} className="text-primary-500" />
                                Categories
                            </h3>
                            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                <Link
                                    href="/search"
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${!params.category ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-secondary-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span>All Categories</span>
                                </Link>
                                {categories.map((cat: any) => (
                                    <Link
                                        href={buildUrl({ category: cat.slug, page: '1' })}
                                        key={cat._id}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${params.category === cat.slug ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-secondary-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <span className="truncate pr-2">{cat.name}</span>
                                        <span className={cn(
                                            "text-[10px] tabular-nums px-2 py-0.5 rounded-full font-black",
                                            params.category === cat.slug ? "bg-white/20 text-white" : "bg-white/5 text-secondary-500"
                                        )}>
                                            {cat.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stores Filter */}
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Store size={14} className="text-primary-500" />
                                Top Stores
                            </h3>
                            <div className="space-y-1">
                                <Link
                                    href={buildUrl({ store: '', page: '1' })}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${!params.store ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-secondary-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span>All Active Brands</span>
                                </Link>
                                {stores.map((store: any) => (
                                    <Link
                                        href={buildUrl({ store: store.slug, page: '1' })}
                                        key={store._id}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${params.store === store.slug ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-secondary-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <span className="truncate pr-2">{store.name}</span>
                                        <span className={cn(
                                            "text-[10px] tabular-nums px-2 py-0.5 rounded-full font-black",
                                            params.store === store.slug ? "bg-white/20 text-white" : "bg-white/5 text-secondary-500"
                                        )}>
                                            {store.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Type Search */}
                        <div className="glass-card p-8 rounded-3xl">
                            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                                <Filter size={14} className="text-primary-500" />
                                Deal Types
                            </h3>
                            <div className="grid grid-cols-1 gap-1">
                                {[
                                    { label: 'All Offers', value: '' },
                                    { label: 'Exclusive', value: 'exclusive' },
                                    { label: 'Verified', value: 'verified' },
                                    { label: 'Featured', value: 'featured' }
                                ].map((type) => (
                                    <Link
                                        href={buildUrl({ type: type.value, page: '1' })}
                                        key={type.value}
                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${params.type === type.value || (!params.type && type.value === '') ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-secondary-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {type.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 w-full min-w-0">
                        <header className="mb-10 px-2 space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                {params.q ? (
                                    <>SEARCH: <span className="text-primary-500 italic">"{params.q}"</span></>
                                ) : params.category ? (
                                    <>{categories.find((c: any) => c.slug === params.category)?.name.toUpperCase()} <span className="text-primary-500 font-black">DEALS</span></>
                                ) : params.store ? (
                                    <>{stores.find((s: any) => s.slug === params.store)?.name.toUpperCase()} <span className="text-primary-500 font-black">CODES</span></>
                                ) : (
                                    <>ALL <span className="text-primary-500 font-black">DEALS</span></>
                                )}
                            </h1>
                            <p className="text-secondary-500 font-bold uppercase tracking-[0.2em] text-xs">Total of {total} verified offers currently active</p>
                        </header>

                        <div className="space-y-6">
                            {coupons.map((coupon: any) => (
                                <div key={coupon._id} className="animate-in fade-in duration-700">
                                    <CouponCard coupon={coupon} layout="horizontal" />
                                </div>
                            ))}

                            {coupons.length === 0 && (
                                <div className="glass-card p-20 rounded-[3rem] text-center space-y-8">
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                        <Search className="text-secondary-700" size={40} />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">No Deals Found</h2>
                                        <p className="text-secondary-500 max-w-sm mx-auto font-medium">We couldn't find any matches for your current filters. Try broadening your search or browsing by category.</p>
                                    </div>
                                    <Link href="/" className="inline-flex bg-primary-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-primary-500 transition-all shadow-2xl shadow-primary-600/20 active:scale-95">
                                        Back to Homepage
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-20 gap-3">
                                {page > 1 && (
                                    <Link
                                        href={buildUrl({ page: (page - 1).toString() })}
                                        className="w-12 h-12 rounded-xl glass text-secondary-400 flex items-center justify-center hover:text-white hover:bg-primary-600/20 border border-white/5 transition-all"
                                    >
                                        &larr;
                                    </Link>
                                )}

                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                                        if (p === 2 || p === totalPages - 1) return <span key={p} className="flex items-center px-1 text-secondary-600 font-bold">...</span>;
                                        return null;
                                    }
                                    return (
                                        <Link
                                            key={p}
                                            href={buildUrl({ page: p.toString() })}
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all border ${page === p ? 'bg-primary-600 text-white border-primary-500 shadow-xl shadow-primary-600/20' : 'glass text-secondary-400 border-white/5 hover:text-white hover:bg-white/10'}`}
                                        >
                                            {p}
                                        </Link>
                                    );
                                })}

                                {page < totalPages && (
                                    <Link
                                        href={buildUrl({ page: (page + 1).toString() })}
                                        className="w-12 h-12 rounded-xl glass text-secondary-400 flex items-center justify-center hover:text-white hover:bg-primary-600/20 border border-white/5 transition-all"
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
