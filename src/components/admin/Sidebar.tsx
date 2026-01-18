
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
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Sub Categories', href: '/admin/sub-categories', icon: Layers },
    { name: 'Stores', href: '/admin/stores', icon: Store },
    // { name: 'Pages', href: '/admin/pages', icon: FileText },
    { name: 'Users', href: '/admin/users', icon: Users },
    // { name: 'Subscribers', href: '/admin/subscribers', icon: Bell },
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
                className="md:hidden fixed top-4 left-4 z-50 bg-secondary-900 text-white p-2 rounded-md shadow-lg"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed top-0 left-0 bottom-0 z-40 w-64 bg-secondary-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-full flex flex-col",
                isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-secondary-800 flex items-center gap-2 mt-12 md:mt-0">
                    <h1 className="text-xl font-bold tracking-wider italic flex items-center gap-2">
                        <span className="bg-primary-600 px-2 py-1 rounded text-sm not-italic">CP</span>
                        DASHBOARD<sup className="text-xs not-italic">®</sup>
                    </h1>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-6 py-3.5 transition-colors border-l-4",
                                    isActive
                                        ? "bg-secondary-800 text-white border-primary-500"
                                        : "text-secondary-400 hover:bg-secondary-800 hover:text-white border-transparent hover:border-primary-500"
                                )}
                            >
                                <Icon size={18} />
                                <span className={cn("font-medium text-sm", isActive ? "text-white" : "font-light")}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-secondary-800">
                    <form action={logout}>
                        <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 w-full transition-colors text-sm font-medium">
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
