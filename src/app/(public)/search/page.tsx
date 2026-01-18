
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import Category from '@/models/Category';
import StoreModel from '@/models/Store';
import { CouponCard } from '@/components/CouponCard';
import { Search, Tag, Store } from 'lucide-react';
import Link from 'next/link';

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
        });
        return `/search?${newParams.toString()}`;
    };

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        {/* Categories Filter */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Tag size={18} className="text-primary-500" />
                                Categories
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                <Link
                                    href="/search"
                                    className={`block text-sm py-1.5 hover:text-primary-600 transition-colors ${!params.category ? 'text-primary-600 font-bold' : 'text-slate-600'}`}
                                >
                                    All Categories
                                </Link>
                                {categories.map((cat: any) => (
                                    <Link
                                        href={buildUrl({ category: cat.slug, page: '1' })}
                                        key={cat._id}
                                        className={`flex items-center justify-between text-sm py-1.5 hover:text-primary-600 transition-colors ${params.category === cat.slug ? 'text-primary-600 font-bold' : 'text-slate-600'}`}
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold group-hover:bg-primary-50">
                                            {cat.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stores Filter */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Store size={18} className="text-primary-500" />
                                Popular Stores
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    href={buildUrl({ store: '', page: '1' })}
                                    className="flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${!params.store ? 'bg-primary-600 border-primary-600' : 'border-slate-300 group-hover:border-primary-500'}`}>
                                            {!params.store && <span className="text-white text-[10px]">✓</span>}
                                        </div>
                                        <span className={`text-sm ${!params.store ? 'text-primary-600 font-medium' : 'text-slate-600 group-hover:text-primary-500'}`}>All Stores</span>
                                    </div>
                                </Link>
                                {stores.map((store: any) => (
                                    <Link
                                        href={buildUrl({ store: store.slug, page: '1' })}
                                        key={store._id}
                                        className="flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${params.store === store.slug ? 'bg-primary-600 border-primary-600' : 'border-slate-300 group-hover:border-primary-500'}`}>
                                                {params.store === store.slug && <span className="text-white text-[10px]">✓</span>}
                                            </div>
                                            <span className={`text-sm ${params.store === store.slug ? 'text-primary-600 font-medium' : 'text-slate-600 group-hover:text-primary-500'}`}>{store.name}</span>
                                        </div>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-bold group-hover:bg-primary-50">
                                            {store.count}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Filters</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'All Offers', value: '' },
                                    { label: 'Exclusive', value: 'exclusive' },
                                    { label: 'Verified', value: 'verified' },
                                    { label: 'Featured', value: 'featured' }
                                ].map((type) => (
                                    <Link
                                        href={buildUrl({ type: type.value, page: '1' })}
                                        key={type.value}
                                        className="flex items-center gap-2 group cursor-pointer"
                                    >
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${params.type === type.value || (!params.type && type.value === '') ? 'bg-primary-600 border-primary-600' : 'border-slate-300 group-hover:border-primary-500'}`}>
                                            {(params.type === type.value || (!params.type && type.value === '')) && <span className="text-white text-[10px]">✓</span>}
                                        </div>
                                        <span className={`text-sm ${params.type === type.value || (!params.type && type.value === '') ? 'text-primary-600 font-medium' : 'text-slate-600 group-hover:text-primary-500'}`}>{type.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-xl font-bold text-slate-800">
                                {params.q ? `Results for "${params.q}"` :
                                    params.category ? `${categories.find((c: any) => c.slug === params.category)?.name} Coupons` :
                                        params.store ? `${stores.find((s: any) => s.slug === params.store)?.name} Coupons` :
                                            'All Active Coupons'}
                            </h1>
                            <span className="text-sm text-slate-500">{total} Results Found</span>
                        </div>

                        <div className="space-y-6">
                            {coupons.map((coupon: any) => (
                                <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                            ))}
                            {coupons.length === 0 && (
                                <div className="bg-white p-12 rounded-xl text-center border border-slate-100 shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="text-slate-300" size={32} />
                                    </div>
                                    <p className="text-slate-500 text-lg font-medium">No coupons found matching your criteria.</p>
                                    <p className="text-slate-400 text-sm mt-1 mb-6">Try adjusting your filters or searching for something else.</p>
                                    <Link href="/" className="bg-primary-600 text-white px-6 py-2 rounded-full font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                                        Go back home
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                {page > 1 && (
                                    <Link
                                        href={buildUrl({ page: (page - 1).toString() })}
                                        className="w-10 h-10 rounded-full bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 border border-slate-200 transition-colors"
                                    >
                                        &larr;
                                    </Link>
                                )}

                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                                        if (p === 2 || p === totalPages - 1) return <span key={p} className="flex items-center px-1 text-slate-400">...</span>;
                                        return null;
                                    }
                                    return (
                                        <Link
                                            key={p}
                                            href={buildUrl({ page: p.toString() })}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${page === p ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                                        >
                                            {p}
                                        </Link>
                                    );
                                })}

                                {page < totalPages && (
                                    <Link
                                        href={buildUrl({ page: (page + 1).toString() })}
                                        className="w-10 h-10 rounded-full bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 border border-slate-200 transition-colors"
                                    >
                                        &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
