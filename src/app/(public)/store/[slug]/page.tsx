
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import { CouponCard } from '@/components/CouponCard';
import { notFound } from 'next/navigation';
import { ExternalLink, Share2, Star, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getStoreData(slug: string) {
    await connectToDatabase();
    const store = await StoreModel.findOne({ slug, isActive: true });

    if (!store) return null;

    const coupons = await Coupon.find({ store: store._id, isActive: true })
        .populate('store')
        .sort({ isFeatured: -1, createdAt: -1 });

    return {
        store: JSON.parse(JSON.stringify(store)),
        allCoupons: JSON.parse(JSON.stringify(coupons)),
    };
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await getStoreData(params.slug);
    if (!data) return { title: 'Store Not Found' };

    return {
        title: data.store.seoTitle || `${data.store.name} Coupons & Promo Codes`,
        description: data.store.seoDescription || data.store.description || `Get the latest ${data.store.name} coupons and deals.`,
    };
}

export default async function StorePage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ q?: string }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const q = searchParams.q || '';

    const data = await getStoreData(params.slug);

    if (!data) {
        notFound();
    }

    const { store, allCoupons } = data;

    // Filter coupons locally for search if q exists
    const coupons = q
        ? allCoupons.filter((c: any) => c.title.toLowerCase().includes(q.toLowerCase()))
        : allCoupons;

    return (
        <div className="min-h-screen pb-32 pt-24">
            {/* Optimization Hints for Tracking Redirects */}
            {store.affiliateLink && (
                <>
                    <link rel="preconnect" href={new URL(store.affiliateLink).origin} />
                    <link rel="dns-prefetch" href={new URL(store.affiliateLink).origin} />
                </>
            )}
            <div className="container-width">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left Sidebar */}
                    <div className="lg:w-80 w-full flex-shrink-0 lg:sticky lg:top-32">
                        <div className="glass-card rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <SearchIcon className="w-24 h-24 text-white" />
                            </div>

                            <div className="w-48 h-48 rounded-[2rem] bg-white shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden mb-2 p-6 group-hover:scale-105 transition-transform duration-500">
                                {store.logoUrl ? (
                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-6xl font-black text-secondary-900 uppercase">{store.name.substring(0, 1)}</span>
                                )}
                            </div>

                            <div className="w-full space-y-3">
                                <h1 className="text-3xl font-black text-white tracking-tighter leading-tight">{store.name}</h1>

                                <div className="flex flex-col items-center gap-2">
                                    <div className="flex items-center justify-center gap-1 text-primary-500">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-secondary-500 uppercase tracking-widest">Premium Partner Brand</p>
                                </div>
                            </div>

                            <div className="w-full pt-6 border-t border-white/5">
                                <p className="text-secondary-400 text-sm font-medium leading-relaxed italic">"{store.description}"</p>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 pt-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-primary-500 font-black text-lg">{allCoupons.length}</p>
                                    <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-widest">Offers</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-primary-500 font-black text-lg">99%</p>
                                    <p className="text-secondary-500 text-[10px] font-bold uppercase tracking-widest">Success</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 w-full min-w-0">
                        {/* Store Header with Search */}
                        <div className="glass-card rounded-[2.5rem] p-10 mb-10 space-y-8 border-primary-500/10 bg-primary-500/5">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <h2 className="text-4xl font-black text-white tracking-tight uppercase">{store.name} <span className="text-primary-500 italic">OFFERS</span></h2>
                                    <div className="h-1 w-20 bg-primary-600 rounded-full"></div>
                                </div>
                                <div className="flex gap-4 shrink-0">
                                    {store.affiliateLink && (
                                        <a
                                            href={store.affiliateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-primary-600/20 active:scale-95 group"
                                        >
                                            Visit Global Store <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Local Search Input */}
                            <div className="relative max-w-xl group">
                                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary-500 group-focus-within:text-primary-400 transition-colors" size={20} />
                                <form className="w-full">
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={q}
                                        placeholder={`Search among ${coupons.length} ${store.name} coupons...`}
                                        className="w-full pl-16 pr-6 py-5 bg-secondary-900/50 border border-white/5 rounded-2xl font-bold text-white focus:outline-none focus:border-primary-500/50 focus:bg-secondary-900 transition-all placeholder:text-secondary-600"
                                    />
                                </form>
                            </div>
                        </div>

                        {coupons.length > 0 ? (
                            <div className="space-y-6">
                                {coupons.map((coupon: any) => (
                                    <div key={coupon._id} className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                                        <CouponCard coupon={coupon} layout="horizontal" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 glass-card rounded-[3rem] space-y-6">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                                    <SearchIcon className="text-secondary-700" size={32} />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white text-2xl font-black uppercase tracking-tight">No Active Matches</p>
                                    <p className="text-secondary-500 font-medium">We couldn't find any offers matching your search.</p>
                                </div>
                                <Link href={`/store/${store.slug}`} className="inline-block text-primary-500 font-black uppercase tracking-widest text-[10px] hover:text-primary-400 transition-colors bg-white/5 px-6 py-2 rounded-full border border-white/5">
                                    View All {store.name} Deals
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
