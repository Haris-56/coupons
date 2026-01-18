
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { Search, Edit, Trash2, CheckCircle, XCircle, User as UserIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteUser } from '@/actions/user';
import { UserToolbar } from './UserToolbar';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getUsers(query?: string, page: number = 1, limit: number = 10) {
    await connectToDatabase();

    let filter = {};
    if (query) {
        filter = {
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        };
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter)
    ]);

    return {
        users: JSON.parse(JSON.stringify(users)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
}

export default async function UsersPage(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;
    const q = searchParams.q || '';
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '10');

    const { users, total, totalPages } = await getUsers(q, page, limit);

    return (
        <div className="space-y-8 pb-16">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Users
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>

                <Link href="/admin/users/create" className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 group">
                    <Plus size={18} /> Add User
                </Link>
            </header>

            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <UserToolbar initialLimit={limit} initialQuery={q} />

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 w-16 text-center">S.No</th>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4 text-center">Role</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-32 text-center text-slate-400 font-medium italic">
                                        No users found in directory
                                    </td>
                                </tr>
                            ) : (
                                users.map((user: any, index: number) => (
                                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-xs text-slate-400 text-center tabular-nums">
                                            {(page - 1) * limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-accent-500 group-hover:bg-accent-50 transition-all">
                                                    <UserIcon size={18} />
                                                </div>
                                                <span className="font-bold text-slate-700 group-hover:text-accent-600 transition-colors text-sm">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "inline-flex px-3 py-1 rounded-full text-[10px] font-bold border",
                                                user.role === 'ADMIN'
                                                    ? 'bg-slate-900 text-white border-slate-900'
                                                    : user.role === 'EDITOR'
                                                        ? 'bg-accent-50 text-accent-700 border-accent-100'
                                                        : 'bg-slate-50 text-slate-500 border-slate-200'
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 italic">
                                                    Active
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <AdminActionMenu
                                                editUrl={`/admin/users/edit/${user._id}`}
                                                onDelete={async () => {
                                                    'use server';
                                                    return await deleteUser(user._id);
                                                }}
                                                itemName="user"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
                    <span className="text-xs text-slate-500 font-medium">
                        Showing <span className="text-slate-900 font-bold">{(page - 1) * limit + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(page * limit, total)}</span> of <span className="text-slate-900 font-bold">{total}</span>
                    </span>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/users?page=${Math.max(1, page - 1)}&q=${q}`}
                            className={`w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-accent-500 hover:border-accent-200 transition-all shadow-sm ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronLeft size={18} />
                        </Link>
                        <Link
                            href={`/admin/users?page=${Math.min(totalPages, page + 1)}&q=${q}`}
                            className={`w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-accent-500 hover:border-accent-200 transition-all shadow-sm ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
