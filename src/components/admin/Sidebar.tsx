
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
    Layers,
    Menu,
    X,
    Shield
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
    { name: 'Email Templates', href: '/admin/email-templates', icon: Ticket },
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
                className="md:hidden fixed top-6 right-6 z-[60] bg-slate-900 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 transition-all duration-500 ease-in-out md:translate-x-0 md:static md:h-full flex flex-col shadow-xl shadow-slate-900/5",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Branding */}
                <div className="p-8 mb-4 border-b border-slate-50">
                    <Link href="/admin" className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/20 group-hover:scale-110 transition-transform">
                            <Shield className="text-white" size={20} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            ADMIN<span className="text-accent-500 italic">HUB</span>
                        </h1>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar py-6">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-xl transition-all group relative overflow-hidden",
                                    isActive
                                        ? "bg-slate-900 text-white shadow-lg"
                                        : "text-slate-500 hover:text-accent-600 hover:bg-slate-50"
                                )}
                            >
                                <Icon size={18} className={cn("transition-all", isActive ? "text-accent-400" : "text-slate-300 group-hover:text-accent-500")} />
                                <span className={cn("font-black text-[10px] tracking-widest uppercase", isActive ? "text-white" : "")}>{item.name}</span>
                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent-500 shadow-[0_0_8px_rgba(128,68,239,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-6 mt-auto border-t border-slate-50">
                    <form action={logout}>
                        <button className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 group">
                            <LogOut size={16} />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </div >

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 z-[45] md:hidden backdrop-blur-sm transition-all"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
