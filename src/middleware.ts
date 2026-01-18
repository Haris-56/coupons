
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/admin'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 5. Redirect to /admin if the user is authenticated and is an ADMIN accessing public auth routes
    if (
        isPublicRoute &&
        session?.userId &&
        session?.role === 'ADMIN' &&
        !req.nextUrl.pathname.startsWith('/admin')
    ) {
        // Optional: Auto redirect admin to dashboard. 
        // Commented out to allow admins to see the frontend.
        // return NextResponse.redirect(new URL('/admin', req.nextUrl));
    }

    // 6. RBAC: If attempting to access /admin, ensure role is ADMIN or EDITOR
    if (path.startsWith('/admin')) {
        if (session?.role !== 'ADMIN' && session?.role !== 'EDITOR') {
            // Return 403 or redirect to homepage
            return NextResponse.redirect(new URL('/', req.nextUrl));
        }
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
