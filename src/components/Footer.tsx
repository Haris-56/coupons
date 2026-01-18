
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { getSettings } from '@/lib/settings';

export async function Footer() {
    const settings = await getSettings();

    return (
        <footer className="bg-secondary-950 text-secondary-400 py-12 border-t border-secondary-900">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <Link href="/">
                        <img src="/discountcouponn.png" alt="DiscountCouponn" className="h-12 w-auto brightness-0 invert" />
                    </Link>
                    <p className="text-sm text-secondary-500">
                        {settings.siteDescription}
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-primary-400 font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/stores" className="hover:text-primary-300 transition-colors">Browse Stores</Link></li>
                        <li><Link href="/categories" className="hover:text-primary-300 transition-colors">Categories</Link></li>
                        <li><Link href="/search" className="hover:text-primary-300 transition-colors">New Arrivals</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-primary-400 font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/privacy" className="hover:text-primary-300 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-primary-300 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/contact" className="hover:text-primary-300 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="text-primary-400 font-bold mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                        {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors"><Facebook size={20} /></a>}
                        {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors"><Twitter size={20} /></a>}
                        {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors"><Instagram size={20} /></a>}
                        {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors"><Youtube size={20} /></a>}
                        {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-300 transition-colors"><Linkedin size={20} /></a>}
                    </div>
                    <p className="mt-6 text-xs text-secondary-600">
                        &copy; {new Date().getFullYear()} DiscountCouponn. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
