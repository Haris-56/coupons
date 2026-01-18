
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import Category from '@/models/Category';
import { CouponCard } from '@/components/CouponCard';
import { ChevronRight, ArrowUpRight, Sparkles } from 'lucide-react';
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
            <section className="relative pt-10 pb-12 lg:pt-16 lg:pb-20 overflow-hidden text-left">
                <div className="container-width relative z-10">
                    <div className="max-w-4xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] shadow-sm">
                            <Sparkles size={12} className="text-accent-500" />
                            Verified & Active Daily
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-slate-950 leading-[0.9] tracking-tighter uppercase p-2 pr-16">
                            <span className="block">LATEST</span>
                            <span className="text-highlight italic">COUPONS</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-500 max-w-xl font-medium leading-relaxed italic border-l-4 border-accent-500 pl-5">
                            Premium marketplace for verified promo codes and exclusive deals from your favorite global brands.
                        </p>

                        <div className="pt-2 max-w-2xl">
                            <SearchForm />
                        </div>

                        {/* Reduced Stats Spacing */}
                        <div className="flex flex-wrap items-center gap-6 md:gap-12 pt-6">
                            <div className="group">
                                <div className="text-3xl font-black text-slate-900 leading-none">10K+</div>
                                <div className="text-slate-400 text-[8px] font-black uppercase tracking-[0.25em] mt-1.5">Live Codes</div>
                            </div>
                            <div className="w-[1px] h-8 bg-slate-200 hidden md:block" />
                            <div className="group">
                                <div className="text-3xl font-black text-slate-900 leading-none">2.5K+</div>
                                <div className="text-slate-400 text-[8px] font-black uppercase tracking-[0.25em] mt-1.5">Partners</div>
                            </div>
                            <div className="w-[1px] h-8 bg-slate-200 hidden md:block" />
                            <div className="group">
                                <div className="text-3xl font-black text-slate-900 leading-none">100%</div>
                                <div className="text-slate-400 text-[8px] font-black uppercase tracking-[0.25em] mt-1.5">Verified</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exclusive Coupons */}
            {exclusiveCoupons.length > 0 && (
                <section className="container-width py-12 relative border-t border-slate-100/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="h-[2px] w-5 bg-accent-500" />
                                <h2 className="text-accent-500 font-black uppercase tracking-[0.15em] text-[8px]">Editor's Selection</h2>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-tight p-2 pr-16 bg-transparent">
                                EXCLUSIVE <span className="text-highlight italic">OFFERS</span>
                            </h2>
                        </div>
                        <Link href="/search?type=exclusive" className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[9px] tracking-widest transition-all bg-white hover:bg-slate-50 px-6 py-3 rounded-lg border border-slate-200 uppercase shadow-sm">
                            VIEW ALL <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {exclusiveCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                        ))}
                    </div>
                </section>
            )}

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-16 relative bg-slate-50/30 border-y border-slate-100/50">
                    <div className="container-width">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter uppercase leading-tight p-2 pr-16">Categories</h2>
                                <div className="h-1 w-12 bg-accent-500 ml-2" />
                            </div>
                            <Link href="/categories" className="text-slate-500 hover:text-accent-600 font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5">
                                BROWSE ALL <ChevronRight size={14} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {categories.map((category: any) => (
                                <Link
                                    href={`/search?category=${category.slug}`}
                                    key={category._id}
                                    className="group relative bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:border-accent-200 hover:shadow-lg"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-3 transition-all group-hover:bg-accent-50">
                                        {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                            <i className={`text-lg text-slate-400 group-hover:text-accent-600 ${category.imageUrl}`}></i>
                                        ) : category.imageUrl ? (
                                            <img src={category.imageUrl} alt={category.name} className="w-8 h-8 object-contain" />
                                        ) : (
                                            <span className="text-lg">🏷️</span>
                                        )}
                                    </div>
                                    <span className="font-black text-slate-800 text-[9px] tracking-[0.05em] text-center w-full uppercase">{category.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Trending */}
            {featuredCoupons.length > 0 && (
                <section className="container-width py-16">
                    <div className="flex items-center justify-between mb-10 border-l-4 border-accent-500 pl-5">
                        <div className="space-y-1">
                            <h2 className="text-accent-500 font-black uppercase tracking-[0.15em] text-[8px]">User Favorites</h2>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter uppercase leading-tight p-2 pr-16">Trending <span className="text-highlight italic">Coupons</span></h2>
                        </div>
                        <Link href="/search" className="hidden sm:inline-flex bg-slate-900 text-white px-7 py-3 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">SHOW ALL</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} />
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Stores */}
            {popularStores.length > 0 && (
                <section className="py-16 bg-slate-50/30 border-t border-slate-100/50">
                    <div className="container-width">
                        <div className="text-left space-y-3 mb-12">
                            <div className="flex items-center gap-3">
                                <div className="h-[2px] w-6 bg-slate-200" />
                                <h2 className="text-slate-400 font-black uppercase tracking-[0.2em] text-[8px]">Our Partners</h2>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter leading-tight uppercase p-2 pr-16">Popular <span className="text-highlight italic">Stores</span></h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                            {popularStores.slice(0, 12).map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="group flex flex-col items-center justify-center space-y-3 bg-white border border-slate-200 p-6 rounded-2xl transition-all duration-300 hover:border-accent-200 hover:shadow-lg"
                                >
                                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
                                        {store.logoUrl ? (
                                            <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-opacity opacity-70 group-hover:opacity-100" />
                                        ) : (
                                            <span className="text-xl font-black text-slate-100 uppercase">{store.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 group-hover:text-accent-600 transition-colors uppercase tracking-[0.1em]">{store.name}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12">
                            <Link href="/stores" className="inline-flex items-center gap-3 bg-slate-900 border border-slate-900 text-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shadow-lg group">
                                EXPLORE ALL STORES <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
