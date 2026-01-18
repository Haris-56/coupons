
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import { CouponCard } from '@/components/CouponCard';
import { notFound } from 'next/navigation';
import { ExternalLink, Share2, Star, Search as SearchIcon, ShieldCheck } from 'lucide-react';
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

    const coupons = q
        ? allCoupons.filter((c: any) => c.title.toLowerCase().includes(q.toLowerCase()))
        : allCoupons;

    return (
        <div className="min-h-screen pb-32">
            {store.affiliateLink && (
                <>
                    <link rel="preconnect" href={new URL(store.affiliateLink).origin} />
                    <link rel="dns-prefetch" href={new URL(store.affiliateLink).origin} />
                </>
            )}

            {/* Store Hero Section */}
            <div className="bg-white border-b border-slate-200 py-16 mb-12">
                <div className="container-width">
                    <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start text-center lg:text-left">
                        {/* Store Logo */}
                        <div className="w-48 h-48 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-900/5 flex items-center justify-center p-6 flex-shrink-0">
                            {store.logoUrl ? (
                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-5xl font-black text-slate-200">{store.name.substring(0, 1)}</span>
                            )}
                        </div>

                        {/* Store Info */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">{store.name} Coupons</h1>
                                    <div className="flex items-center gap-1.5 text-rose-500">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} size={18} fill="currentColor" />
                                        ))}
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                                        <ShieldCheck size={14} /> Verified Partner
                                    </span>
                                </div>
                                <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto lg:mx-0">{store.description}</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                                {store.affiliateLink && (
                                    <a
                                        href={store.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 group"
                                    >
                                        Visit {store.name} <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                <div className="flex items-center gap-8">
                                    <div className="text-center lg:text-left">
                                        <p className="text-2xl font-black text-slate-900">{allCoupons.length}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Deals</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200" />
                                    <div className="text-center lg:text-left">
                                        <p className="text-2xl font-black text-emerald-600">99%</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-width">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Area */}
                    <div className="flex-1 space-y-8">
                        {/* Filter/Search Bar */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-sm">
                            <div className="relative flex-1 w-full group">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent-500 transition-colors" size={20} />
                                <form className="w-full">
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={q}
                                        placeholder={`Search ${store.name} codes...`}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-accent-300 focus:bg-white transition-all uppercase tracking-wide"
                                    />
                                </form>
                            </div>
                            <div className="flex items-center gap-2 px-4 whitespace-nowrap">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing</span>
                                <span className="text-xs font-black text-slate-900 uppercase">{coupons.length} Offers</span>
                            </div>
                        </div>

                        {/* Coupon List */}
                        {coupons.length > 0 ? (
                            <div className="space-y-6">
                                {coupons.map((coupon: any) => (
                                    <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100 italic font-black text-slate-200 text-3xl">
                                    ?
                                </div>
                                <div className="space-y-2">
                                    <p className="text-slate-900 text-2xl font-black uppercase tracking-tight">No Matches Found</p>
                                    <p className="text-slate-500 font-medium">Try broadening your search or browse all deals.</p>
                                </div>
                                <Link href={`/store/${store.slug}`} className="inline-flex items-center gap-2 text-accent-600 font-black uppercase tracking-widest text-[10px] hover:text-accent-700 transition-colors">
                                    View All {store.name} Coupons
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:w-80 space-y-8">
                        {/* About the Store */}
                        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-8 space-y-6">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">Social Presence</h3>
                            <div className="flex items-center justify-center gap-4">
                                {['facebook', 'twitter', 'instagram'].map((soc) => (
                                    <button key={soc} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                        <Share2 size={18} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Store Statistics */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl shadow-slate-900/10">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-white/10 pb-4">Store Insights</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Verification</span>
                                    <span className="text-[10px] font-black text-emerald-400 uppercase">100% Manual</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Saving</span>
                                    <span className="text-[10px] font-black text-accent-400 uppercase">$24.00</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Updated</span>
                                    <span className="text-[10px] font-black text-slate-200 uppercase">Today</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
