
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import Category from '@/models/Category';
import { CouponCard } from '@/components/CouponCard';
import { Search, ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
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
        <div className="space-y-0 pb-16 min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40">
                <div className="container-width relative z-10">
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border border-white/10 text-xs font-bold text-primary-400 uppercase tracking-widest shadow-xl">
                            <Sparkles size={14} className="animate-pulse" />
                            Verified & Active Daily
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-tight tracking-tighter">
                            <span className="block">DIGITAL</span>
                            <span className="text-gradient-primary">SAVINGS</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-secondary-400 max-w-3xl mx-auto font-medium leading-relaxed">
                            Premium marketplace for verified coupon codes and exclusive deals from your favorite global brands.
                        </p>

                        <div className="pt-8 max-w-2xl mx-auto">
                            <SearchForm />
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 pt-16">
                            <div className="space-y-1">
                                <div className="text-4xl font-black text-white">10,000+</div>
                                <div className="text-secondary-500 text-xs font-bold uppercase tracking-widest">Active Codes</div>
                            </div>
                            <div className="w-px h-12 bg-white/5 hidden md:block" />
                            <div className="space-y-1">
                                <div className="text-4xl font-black text-white">2,500+</div>
                                <div className="text-secondary-500 text-xs font-bold uppercase tracking-widest">Partner Stores</div>
                            </div>
                            <div className="w-px h-12 bg-white/5 hidden md:block" />
                            <div className="space-y-1">
                                <div className="text-4xl font-black text-white">100%</div>
                                <div className="text-secondary-500 text-xs font-bold uppercase tracking-widest">Verified Daily</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Coupons Section */}
            {exclusiveCoupons.length > 0 && (
                <section className="container-width py-24 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-accent underline decoration-primary-500/30 underline-offset-8 text-secondary-500 font-bold uppercase tracking-[0.2em] text-sm">Editor's Selection</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">EXCLUSIVE OFFERS</h3>
                        </div>
                        <Link href="/search?filter=exclusive" className="group flex items-center gap-3 text-secondary-400 hover:text-primary-400 font-bold text-sm transition-all bg-white/5 px-6 py-3 rounded-full border border-white/5">
                            VIEW ALL <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                        {exclusiveCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                        ))}
                    </div>
                </section>
            )}

            {/* Premium Categories Grid */}
            {categories.length > 0 && (
                <section className="py-32 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary-600/5 -skew-y-3 transform scale-125 border-y border-white/5" />
                    <div className="container-width relative z-10">
                        <div className="flex items-center justify-between mb-16">
                            <h2 className="text-4xl font-black text-white tracking-tight">CATEGORIES</h2>
                            <Link href="/categories" className="text-primary-400 hover:text-primary-300 font-bold text-sm flex items-center gap-2">
                                BROWSE ALL <ChevronRight size={18} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {categories.map((category: any) => (
                                <Link
                                    href={`/search?category=${category.slug}`}
                                    key={category._id}
                                    className="group relative h-48 rounded-2xl glass-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-primary-500/30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary-500/10 group-hover:border-primary-500/20">
                                            {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                                <i className={`text-2xl text-secondary-400 group-hover:text-primary-400 ${category.imageUrl}`}></i>
                                            ) : category.imageUrl ? (
                                                <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain brightness-0 invert opacity-50 group-hover:opacity-100 transition-all" />
                                            ) : (
                                                <span className="text-2xl">🛍️</span>
                                            )}
                                        </div>
                                        <span className="font-bold text-white text-sm tracking-widest text-center truncate w-full px-2">{category.name.toUpperCase()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Trending Deals Grid */}
            {featuredCoupons.length > 0 && (
                <section className="container-width py-32">
                    <div className="flex items-center justify-between mb-16">
                        <div className="space-y-4">
                            <h2 className="text-secondary-500 font-bold uppercase tracking-[0.2em] text-sm">Most Popular</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">TRENDING DEALS</h3>
                        </div>
                        <Link href="/search?filter=featured" className="text-secondary-400 hover:text-white font-bold text-sm hidden sm:block px-6 py-3 rounded-full border border-white/5 hover:bg-white/5 transition-all">VIEW ALL TRENDING</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} />
                        ))}
                    </div>
                </section>
            )}

            {/* Store Showcase */}
            {popularStores.length > 0 && (
                <section className="py-32 bg-white/[0.02] border-y border-white/5">
                    <div className="container-width">
                        <div className="text-center space-y-4 mb-20 animate-in fade-in duration-1000">
                            <h2 className="text-secondary-500 font-bold uppercase tracking-[0.3em] text-sm">Our Network</h2>
                            <h3 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none uppercase">Trusted by Global Brands</h3>
                            <p className="text-secondary-400 max-w-2xl mx-auto font-medium">Verified savings from the world's most recognized retailers and boutiques.</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {popularStores.map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="group glass-card p-8 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-2 hover:border-primary-500/30 hover:shadow-primary-900/20"
                                >
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden mb-6 p-2 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 shadow-sm border border-secondary-800">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <span className="text-2xl font-black text-secondary-900 uppercase">{store.name.substring(0, 1)}</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-secondary-500 group-hover:text-primary-400 transition-colors text-center w-full uppercase tracking-[0.2em] truncate">
                                        {store.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-20 text-center">
                            <Link href="/stores" className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary-600/20 hover:shadow-primary-600/40 active:scale-95">
                                Explore 2,000+ Stores <ChevronRight size={20} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
