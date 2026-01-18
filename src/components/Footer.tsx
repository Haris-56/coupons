
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { getSettings } from '@/lib/settings';

export async function Footer() {
    const settings = await getSettings();

    return (
        <footer className="footer-dark relative mt-32 overflow-hidden">
            <div className="container-width py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link href="/" className="inline-block transition-transform hover:scale-105">
                            <img src="/discountcouponn.png" alt="DiscountCouponn" className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium italic">
                            {settings.siteDescription}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Quick Links</h4>
                        <ul className="space-y-5">
                            <li><Link href="/stores" className="text-slate-400 hover:text-accent-400 text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-3 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-accent-500 transition-all" /> Browse Stores</Link></li>
                            <li><Link href="/categories" className="text-slate-400 hover:text-accent-400 text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-3 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-accent-500 transition-all" /> Categories</Link></li>
                            <li><Link href="/search" className="text-slate-400 hover:text-accent-400 text-xs font-bold transition-all uppercase tracking-widest flex items-center gap-3 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-accent-500 transition-all" /> New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Legal</h4>
                        <ul className="space-y-5">
                            <li><Link href="/privacy" className="text-slate-400 hover:text-accent-400 text-xs font-bold transition-all uppercase tracking-widest">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-slate-400 hover:text-accent-400 text-xs font-bold transition-all uppercase tracking-widest">Terms of Service</Link></li>
                            <li><Link href="/contact" className="text-slate-400 hover:text-accent-400 text-xs font-bold transition-all uppercase tracking-widest">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-8">
                        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em]">Follow Us</h4>
                        <div className="flex gap-4">
                            {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-accent-600 transition-all border border-slate-800 shadow-2xl"><Facebook size={20} /></a>}
                            {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-accent-600 transition-all border border-slate-800 shadow-2xl"><Twitter size={20} /></a>}
                            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-accent-600 transition-all border border-slate-800 shadow-2xl"><Instagram size={20} /></a>}
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed">
                            &copy; {new Date().getFullYear()} DiscountCouponn.<br /> All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
