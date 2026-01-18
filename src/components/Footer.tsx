
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { getSettings } from '@/lib/settings';

export async function Footer() {
    const settings = await getSettings();

    return (
        <footer className="relative mt-20 border-t border-white/5 bg-secondary-950/50 backdrop-blur-xl overflow-hidden">
            {/* Subtle glow effect in footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

            <div className="container-width py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block transition-transform hover:scale-105">
                            <img src="/discountcouponn.png" alt="DiscountCouponn" className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-secondary-400 text-sm leading-relaxed max-w-xs">
                            {settings.siteDescription}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/stores" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-500 transition-colors" /> Browse Stores</Link></li>
                            <li><Link href="/categories" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-500 transition-colors" /> Categories</Link></li>
                            <li><Link href="/search" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"><span className="w-1 h-1 rounded-full bg-primary-500/50 group-hover:bg-primary-500 transition-colors" /> New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="/privacy" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link href="/contact" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Follow Us</h4>
                        <div className="flex gap-4">
                            {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all"><Facebook size={18} /></a>}
                            {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all"><Twitter size={18} /></a>}
                            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all"><Instagram size={18} /></a>}
                            {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all"><Youtube size={18} /></a>}
                            {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-primary-600 transition-all"><Linkedin size={18} /></a>}
                        </div>
                        <p className="text-xs text-secondary-600 font-medium">
                            &copy; {new Date().getFullYear()} DiscountCouponn.<br /> All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
