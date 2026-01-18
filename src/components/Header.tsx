
import Link from 'next/link';
import { User } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { MobileMenu } from './MobileMenu';
import SearchForm from '@/components/SearchForm';

export async function Header() {
    const session = await verifySession();

    return (
        <header className="sticky top-0 z-50 w-full glass-header">
            <div className="container-width h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95">
                    <img src="/discountcouponn.png" alt="DiscountCouponn" className="h-10 md:h-12 w-auto brightness-0 invert" />
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:block flex-1 max-w-xl">
                    <SearchForm compact />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-1 mr-4">
                        <Link href="/" className="px-4 py-2 text-secondary-300 hover:text-white font-medium text-sm transition-all rounded-full hover:bg-white/5">
                            Home
                        </Link>
                        <Link href="/categories" className="px-4 py-2 text-secondary-300 hover:text-white font-medium text-sm transition-all rounded-full hover:bg-white/5">
                            Categories
                        </Link>
                        <Link href="/stores" className="px-4 py-2 text-secondary-300 hover:text-white font-medium text-sm transition-all rounded-full hover:bg-white/5">
                            Stores
                        </Link>
                    </div>

                    {session.isAuth ? (
                        <Link href="/admin" className="hidden sm:flex items-center gap-3 bg-secondary-900/50 hover:bg-secondary-800 border border-white/5 hover:border-white/10 px-4 py-2 rounded-full transition-all group">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 group-hover:bg-primary-600/30">
                                <User size={16} />
                            </div>
                            <span className="hidden lg:block text-sm font-semibold text-secondary-200">Dashboard</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-4">
                            <Link href="/login" className="text-secondary-300 hover:text-white font-medium text-sm px-4 py-2 rounded-full hover:bg-white/5 transition-all">
                                Log in
                            </Link>
                            <Link href="/signup" className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 active:scale-95">
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <div className="ml-2">
                        <MobileMenu isAuth={session.isAuth} role={session.role} />
                    </div>
                </nav>
            </div>
        </header>
    );
}
