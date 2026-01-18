
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
        <div className="flex h-screen bg-secondary-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
