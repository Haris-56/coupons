
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div id="public-layout-root" className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
