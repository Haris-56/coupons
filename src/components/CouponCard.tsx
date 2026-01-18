
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { voteCoupon } from '@/actions/coupon';
import Link from 'next/link';

interface CouponCardProps {
    coupon: any;
    layout?: 'vertical' | 'horizontal';
}

export function CouponCard({ coupon, layout = 'vertical' }: CouponCardProps) {
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const handleCopy = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();
        const link = coupon.trackingLink || coupon.store?.affiliateLink || '#';
        if (link !== '#') {
            window.open(link, '_blank');
        }
        setShowModal(true);
    };

    const handleVote = async (isUp: boolean) => {
        if (hasVoted) return;
        setHasVoted(true);
        await voteCoupon(coupon._id, isUp);
    };

    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowModal(false);
    };

    const Modal = () => {
        if (!showModal) return null;

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={closeModal}>
                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative" onClick={e => e.stopPropagation()}>
                    <div className="bg-slate-50 p-8 flex flex-col items-center text-center border-b border-slate-100 relative">
                        <button onClick={closeModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-900 p-2 rounded-full hover:bg-white transition-all shadow-sm">
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center mb-6 p-4">
                            {coupon.store?.logoUrl ? <img src={coupon.store.logoUrl} alt={coupon.store?.name} className="w-full h-full object-contain" /> : <span className="font-black text-slate-200 text-2xl">{coupon.store?.name?.substring(0, 1)}</span>}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{coupon.title}</h3>
                        <p className="text-slate-500 text-[10px] font-black mt-2 uppercase tracking-widest">AT <span className="text-accent-500">{coupon.store?.name}</span></p>
                    </div>

                    <div className="p-8 flex flex-col items-center gap-6">
                        {coupon.couponType === 'Code' ? (
                            <div className="text-center space-y-4 w-full">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">COPY CODE AND REDEEM AT {coupon.store?.name}</p>
                                <div className="relative group cursor-pointer" onClick={handleCopy}>
                                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl px-8 py-5 flex items-center gap-4 justify-center hover:bg-white transition-all shadow-inner">
                                        <span className="text-3xl font-mono font-black text-accent-600 tracking-wider text-center">{coupon.code}</span>
                                        <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-colors">COPY</button>
                                    </div>
                                    {copied && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-accent-600 font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">COPIED!</span>}
                                </div>
                                <div className="pt-6">
                                    <a href={coupon.trackingLink || coupon.store?.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-[0.3em] shadow-xl shadow-slate-900/10">GO TO {coupon.store?.name}</a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-6 w-full">
                                <p className="text-slate-400 font-medium italic text-sm">No code required! The discount will be applied automatically.</p>
                                <a href={coupon.trackingLink || coupon.store?.affiliateLink || '#'} target="_blank" rel="noopener noreferrer" className="inline-block w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl transition-all uppercase text-xs tracking-[0.3em] shadow-xl shadow-slate-900/10 active:scale-95">ACTIVATE DEAL</a>
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-4 pt-6 border-t border-slate-100 w-full">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hasVoted ? 'THANK YOU!' : 'DID IT WORK?'}</p>
                            <div className="flex gap-4">
                                <button disabled={hasVoted} onClick={() => handleVote(false)} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-100 bg-white hover:bg-slate-50 transition-all font-black text-slate-500 text-[11px] shadow-sm">🙁 {coupon.votesDown || 0}</button>
                                <button disabled={hasVoted} onClick={() => handleVote(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-100 bg-white hover:bg-slate-50 transition-all font-black text-slate-500 text-[11px] shadow-sm">😊 {coupon.votesUp || 0}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (layout === 'horizontal') {
        return (
            <>
                <Modal />
                <div className="group relative bg-white border border-slate-200 rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/5 overflow-hidden w-full">
                    <div className="flex flex-col md:flex-row items-stretch">
                        <div className="md:w-32 bg-slate-50 flex flex-col items-center justify-center p-4 gap-2 border-b md:border-b-0 md:border-r border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-white rounded-xl p-2.5 flex items-center justify-center shadow-sm border border-slate-100 transform group-hover:scale-105 transition-transform">
                                {coupon.store?.logoUrl ? <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" /> : <span className="text-xl font-black text-slate-200">{coupon.store?.name?.charAt(0)}</span>}
                            </div>
                            <div className="text-center">
                                <span className="text-[7px] font-black text-accent-500 uppercase tracking-[0.2em]">{coupon.couponType}</span>
                                <div className="text-[14px] font-black text-slate-900 uppercase leading-none mt-0.5 whitespace-nowrap">{coupon.discountValue || 'DEAL'}</div>
                            </div>
                        </div>

                        <div className="flex-1 p-5 md:px-8 md:py-6 space-y-2 min-w-0 flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-2">
                                {coupon.isVerified && <span className="text-[6px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">VERIFIED</span>}
                                {coupon.isExclusive && <span className="text-[6px] font-black bg-accent-50 text-accent-600 px-2 py-0.5 rounded border border-accent-100 uppercase tracking-widest">EXCLUSIVE</span>}
                            </div>
                            {/* Title is strictly 1-line as requested */}
                            <h3 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tighter truncate w-full">{coupon.title}</h3>
                            <p className="text-slate-500 text-[11px] italic line-clamp-1 max-w-full">{coupon.description}</p>
                            <div className="flex items-center gap-3 pt-0.5">
                                <div className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">😊 {coupon.votesUp || 0}</div>
                                <div className="text-[9px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">🙁 {coupon.votesDown || 0}</div>
                            </div>
                        </div>

                        <div className="p-5 md:p-6 flex items-center justify-center">
                            <button onClick={handleAction} className="h-10 px-8 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-[9px] uppercase tracking-[0.3em] transition-all shadow-lg active:scale-95 whitespace-nowrap">
                                {coupon.couponType === 'Code' ? 'VIEW CODE' : 'GET OFFER'}
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Modal />
            <div className="flex flex-col bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-900/5 h-full text-center items-center">
                <div className="p-8 pb-5 flex-1 flex flex-col items-center w-full">
                    <div className="w-full flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                {coupon.store?.logoUrl ? <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" /> : <span className="text-2xl font-black text-slate-200">{coupon.store?.name?.charAt(0)}</span>}
                            </div>
                            {coupon.discountValue && (
                                <div className="absolute -top-3 -right-3 bg-accent-500 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-accent-500/20">
                                    {coupon.discountValue}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        <Link href={`/store/${coupon.store?.slug}`} className="text-[10px] font-black text-accent-500 uppercase tracking-[0.2em] block hover:underline">{coupon.store?.name}</Link>
                        {/* Vertical layout remains flexible but limited to preserve space */}
                        <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tighter line-clamp-2 h-[3.5rem] px-2">{coupon.title}</h3>
                        <p className="text-slate-500 text-xs italic line-clamp-2 max-w-[200px] mx-auto opacity-70">{coupon.description}</p>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-6 mt-auto border-t border-slate-50 w-full">
                        <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">😊 {coupon.votesUp || 0}</span>
                        <div className="w-px h-3 bg-slate-100" />
                        <span className="text-[10px] font-black text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">🙁 {coupon.votesDown || 0}</span>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-0 w-full">
                    <button onClick={handleAction} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                        {coupon.couponType === 'Code' ? 'REVEAL CODE' : 'GET OFFER'}
                    </button>
                </div>
            </div>
        </>
    );
}
