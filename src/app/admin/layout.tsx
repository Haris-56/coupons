
import { Sidebar } from '@/components/admin/Sidebar';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await verifySession();

    // Double check in layout (Middleware handles redirection, but this provides type safety access)
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-secondary-950 overflow-hidden relative">
            {/* Grid Background specifically for admin too */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
