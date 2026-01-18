
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

    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-[#f1f5f9] overflow-hidden relative">
            {/* Background pattern managed by globals.css since it's applied to body, 
                but we can reinforce it here for the admin panel's specific container if needed.
                Currently, it's safer to let globals.css handle the main pattern and 
                just ensure the background color is correct. */}

            <Sidebar />
            <main className="flex-1 overflow-y-auto pt-4 px-6 md:pt-6 md:px-10 relative z-10 custom-scrollbar">
                <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}
