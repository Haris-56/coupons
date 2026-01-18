
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import Category from '@/models/Category';
import { CouponCard } from '@/components/CouponCard';
import { Search, ChevronRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';

export const dynamic = 'force-dynamic';

async function getHomeData() {
    await connectToDatabase();

    const [featuredCoupons, exclusiveCoupons, popularStores, categories] = await Promise.all([
        Coupon.find({ isFeatured: true, isActive: true }).populate('store').limit(6).sort({ updatedAt: -1 }),
        Coupon.find({ isExclusive: true, isActive: true }).populate('store').limit(8).sort({ updatedAt: -1 }),
        StoreModel.find({ isFeatured: true, isActive: true }).limit(20),
        Category.find({ isFeatured: true, isActive: true }).limit(6)
    ]);

    return {
        featuredCoupons: JSON.parse(JSON.stringify(featuredCoupons)),
        exclusiveCoupons: JSON.parse(JSON.stringify(exclusiveCoupons)),
        popularStores: JSON.parse(JSON.stringify(popularStores)),
        categories: JSON.parse(JSON.stringify(categories)),
    };
}

export default async function HomePage() {
    const { featuredCoupons, exclusiveCoupons, popularStores, categories } = await getHomeData();

    return (
        <div className="space-y-0 pb-16 bg-secondary-950 text-secondary-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[40vh] h-[40vh] bg-primary-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-900 border border-secondary-800 text-xs font-medium text-primary-400 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                        Updates Daily with New Deals
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700">
                        DIGITAL <span className="text-primary-500">SAVINGS</span><br />
                        THAT <span className="text-stroke-primary text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-400">DELIVER</span>
                    </h1>

                    <p className="text-lg md:text-xl text-secondary-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Crafting a better shopping experience with purpose and passion. Use our verified coupons to save instantly on your favorite brands.
                    </p>

                    <div className="max-w-2xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                        <SearchForm />
                    </div>

                    {/* Stats / trust indicators */}
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 border-t border-secondary-900 pt-12 animate-in fade-in duration-1000 delay-300">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">10k+</div>
                            <div className="text-secondary-500 text-sm uppercase tracking-wider">Active Coupons</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">2k+</div>
                            <div className="text-secondary-500 text-sm uppercase tracking-wider">Stores</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">100%</div>
                            <div className="text-secondary-500 text-sm uppercase tracking-wider">Verified</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Coupons (Replaces "Innovative Services") */}
            {exclusiveCoupons.length > 0 && (
                <section className="container mx-auto px-4 py-20">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <h4 className="text-primary-500 font-bold uppercase tracking-widest text-sm mb-2">Editor's Choice</h4>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Exclusive Offers</h2>
                        </div>
                        <Link href="/search?filter=exclusive" className="group flex items-center gap-2 text-secondary-300 hover:text-white transition-colors">
                            View All Exclusives <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {exclusiveCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Categories (Replaces "Successful Projects") */}
            {categories.length > 0 && (
                <section className="py-20 bg-secondary-900/30 border-y border-secondary-900">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-white">Browse Categories</h2>
                            <Link href="/categories" className="text-primary-500 hover:text-primary-400 font-bold text-sm">See All &gt;</Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {categories.map((category: any) => (
                                <Link
                                    href={`/search?category=${category.slug}`}
                                    key={category._id}
                                    className="group flex flex-col items-center justify-center p-8 bg-secondary-900 border border-secondary-800 rounded-2xl hover:bg-secondary-800 transition-all hover:border-primary-500/30 relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform relative z-10">
                                        {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                            <i className={`text-secondary-400 group-hover:text-primary-400 ${category.imageUrl}`}></i>
                                        ) : category.imageUrl ? (
                                            <img src={category.imageUrl} alt={category.name} className="w-12 h-12 object-contain invert brightness-0 group-hover:invert-0 group-hover:brightness-100 transition-all" />
                                        ) : (
                                            <span className="text-3xl">🛍️</span>
                                        )}
                                    </div>
                                    <span className="font-bold text-secondary-400 group-hover:text-white text-center text-sm relative z-10">{category.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Coupons */}
            {featuredCoupons.length > 0 && (
                <section className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-bold text-white">Trending Deals</h2>
                        <Link href="/search?filter=featured" className="text-secondary-400 hover:text-white transition-colors text-sm">View All &gt;</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Stores */}
            {popularStores.length > 0 && (
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-secondary-900/20 -skew-y-3 transform origin-top-left scale-110 -z-10"></div>
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">OUR PARTNER BRANDS</h2>
                            <p className="text-secondary-400">We collaborate with the world's leading brands to bring you the best savings.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {popularStores.map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="group bg-secondary-900 border border-secondary-800 p-6 rounded-xl flex flex-col items-center justify-center transition-all hover:-translate-y-1 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-900/10"
                                >
                                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden mb-4 p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-xl font-bold text-secondary-900">{store.name.substring(0, 1)}</span>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-secondary-400 group-hover:text-primary-400 transition-colors text-center truncate w-full uppercase tracking-wider">
                                        {store.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <Link href="/stores" className="inline-flex items-center gap-2 bg-secondary-800 hover:bg-secondary-700 text-white border border-secondary-700 px-8 py-3 rounded-full font-bold text-sm transition-all hover:shadow-lg hover:border-primary-500/50">
                                Explore All 2,000+ Stores <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
