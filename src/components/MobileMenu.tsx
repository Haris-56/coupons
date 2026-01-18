
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Search, ChevronRight, User, Facebook, Twitter, Youtube, Linkedin, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

interface MobileMenuProps {
    isAuth: boolean;
    role?: string | null;
}

export function MobileMenu({ isAuth, role }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.width = 'auto';
        };
    }, [isOpen]);

    const sidebarContent = (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-[9998] transition-opacity backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel - Portal ensures this is top-level */}
            <div
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-[280px] bg-secondary-950 border-r border-secondary-900 z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                {/* Header / Logo Section */}
                <div className="p-6 flex flex-col items-center border-b border-secondary-900 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-1 text-secondary-500 hover:text-secondary-300 rounded-full hover:bg-secondary-900"
                    >
                        <X size={20} />
                    </button>

                    {/* Logo */}
                    <Link href="/" onClick={() => setIsOpen(false)} className="mb-6 mt-4">
                        <img src="/discountcouponn.png" alt="DiscountCouponn" className="h-10 w-auto brightness-0 invert" />
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="p-6 border-b border-secondary-900">
                    {isAuth ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-secondary-900 flex items-center justify-center text-secondary-400 border border-secondary-800">
                                <User size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-secondary-200 truncate">Admin</p>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs text-secondary-500 hover:text-primary-400 transition-colors flex items-center gap-1"
                                >
                                    View Profile <ChevronRight size={10} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-2.5 px-4 bg-secondary-900 text-secondary-300 font-bold rounded-lg text-center hover:bg-secondary-800 transition-colors border border-secondary-800">
                                Log In
                            </Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full py-2.5 px-4 bg-primary-600 text-white font-bold rounded-lg text-center hover:bg-primary-500 transition-colors shadow-md shadow-primary-900/20">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
                    {[
                        { label: 'Search', href: '/search', icon: Search },
                        { label: 'Categories', href: '/categories', icon: null },
                        { label: 'Stores', href: '/stores', icon: null },
                        { label: 'Home', href: '/', icon: null },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-secondary-400 hover:bg-secondary-900 transition-all group",
                                pathname === item.href && "bg-primary-900/20 text-primary-400 border border-primary-900/50"
                            )}
                        >
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full bg-secondary-700 group-hover:bg-primary-500 transition-colors",
                                pathname === item.href && "bg-primary-500"
                            )}></span>

                            <span className="text-lg">{item.label}</span>
                        </Link>
                    ))}

                    {isAuth && (
                        <button
                            onClick={async () => {
                                await logout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-red-500 hover:bg-red-900/10 transition-all group mt-4"
                        >
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    )}
                </nav>

                {/* Footer / Socials */}
                <div className="p-6 border-t border-secondary-900 mt-auto">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { Icon: Facebook, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Youtube, href: '#' },
                            { Icon: Linkedin, href: '#' },
                        ].map(({ Icon, href }, idx) => (
                            <Link
                                key={idx}
                                href={href}
                                className="w-10 h-10 border border-secondary-800 bg-secondary-900 rounded-lg flex items-center justify-center text-secondary-500 hover:text-primary-400 hover:border-primary-500/50 hover:bg-secondary-800 transition-all"
                            >
                                <Icon size={18} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    if (!mounted) {
        return (
            <button
                className="md:hidden p-2 text-secondary-300 hover:bg-secondary-800 rounded-full transition-colors"
                aria-label="Open Menu Placeholder"
            >
                <Menu size={24} />
            </button>
        );
    }

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-secondary-300 hover:bg-secondary-800 rounded-full transition-colors"
                aria-label="Open Menu"
            >
                <Menu size={24} />
            </button>
            {createPortal(sidebarContent, document.body)}
        </div>
    );
}
