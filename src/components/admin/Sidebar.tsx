
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Store,
    Tag,
    Settings,
    Users,
    LogOut,
    Ticket,
    FileText,
    Mail,
    Bell,
    Layers,
    Menu,
    X,
    Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Sub Categories', href: '/admin/sub-categories', icon: Layers },
    { name: 'Stores', href: '/admin/stores', icon: Store },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Email Templates', href: '/admin/email-templates', icon: Mail },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-6 right-6 z-50 bg-primary-600 text-white p-3 rounded-2xl shadow-2xl shadow-primary-600/20"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed top-0 left-0 bottom-0 z-40 w-72 glass border-r border-white/5 transition-all duration-500 ease-in-out md:translate-x-0 md:static md:h-full flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 mb-4">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform">
                            <Layout className="text-white" size={20} />
                        </div>
                        <h1 className="text-xl font-black text-white tracking-tighter">
                            ADMIN<span className="text-primary-500">PRO</span>
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative overflow-hidden group",
                                    isActive
                                        ? "bg-primary-600/10 text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-600/5"
                                        : "text-secondary-400 hover:text-white hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <Icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-primary-400" : "text-secondary-500 group-hover:text-primary-400")} />
                                <span className={cn("font-bold text-sm tracking-wide", isActive ? "text-white" : "group-hover:text-white")}>{item.name.toUpperCase()}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-500 rounded-r-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <form action={logout}>
                        <button className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-red-500/5 hover:shadow-red-500/20">
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
