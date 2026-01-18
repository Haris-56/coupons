
import Link from 'next/link';
import { User } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { MobileMenu } from './MobileMenu';
import SearchForm from '@/components/SearchForm';

export async function Header() {
    const session = await verifySession();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-header">
            <div className="container-width h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center group transition-transform hover:scale-105 active:scale-95">
                    <img src="/discountcouponn.png" alt="DiscountCouponn" className="h-10 md:h-12 w-auto" />
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:block flex-1 max-w-xl">
                    <SearchForm compact />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    <div className="hidden lg:flex items-center gap-1 mr-4">
                        <Link href="/" className="px-5 py-2 text-slate-500 hover:text-accent-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all rounded-full hover:bg-slate-50">
                            Home
                        </Link>
                        <Link href="/categories" className="px-5 py-2 text-slate-500 hover:text-accent-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all rounded-full hover:bg-slate-50">
                            Categories
                        </Link>
                        <Link href="/stores" className="px-5 py-2 text-slate-500 hover:text-accent-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-all rounded-full hover:bg-slate-50">
                            Stores
                        </Link>
                    </div>

                    {session.isAuth ? (
                        <Link href="/admin" className="hidden sm:flex items-center gap-3 bg-white border border-slate-200 hover:border-accent-300 px-5 py-2 rounded-full transition-all group shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg group-hover:bg-accent-600 transition-colors">
                                <User size={14} />
                            </div>
                            <span className="hidden lg:block text-[10px] font-black text-slate-700 uppercase tracking-widest">Dashboard</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-4">
                            <Link href="/login" className="text-slate-500 hover:text-accent-600 font-bold text-[10px] uppercase tracking-widest px-4 transition-all">
                                Log in
                            </Link>
                            <Link href="/signup" className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                                Join Now
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
