import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { Search, Edit, Trash2, CheckCircle, XCircle, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { deleteUser } from '@/actions/user';
import { UserToolbar } from './UserToolbar';

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                    <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
                </div>

                <Link href="/admin/users/create" className="bg-[#2c3e50] hover:bg-[#34495e] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/10">
                    + ADD NEW
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <UserToolbar initialLimit={limit} initialQuery={q} />

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-[#fafbfc] border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Id</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-center">Verified</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user: any, index: number) => (
                                <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">#{(page - 1) * limit + index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'ADMIN'
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                            : user.role === 'EDITOR' ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <CheckCircle className="text-emerald-500 w-5 h-5 fill-emerald-50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <CheckCircle className="text-emerald-500 w-5 h-5 fill-emerald-50" />
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
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-secondary-400">
                                        <UserIcon className="mx-auto mb-2 opacity-50" />
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
                    <span>Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries</span>
                    <div className="flex gap-1">
                        <Link
                            href={`/admin/users?page=1&q=${q}`}
                            className={`px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            First
                        </Link>
                        <Link
                            href={`/admin/users?page=${Math.max(1, page - 1)}&q=${q}`}
                            className={`px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Previous
                        </Link>

                        {[...Array(totalPages)].map((_, i) => {
                            const p = i + 1;
                            // Only show current, first, last, and relative pages if many
                            if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                                if (p === 2 || p === totalPages - 1) return <span key={p} className="px-2">...</span>;
                                return null;
                            }

                            return (
                                <Link
                                    key={p}
                                    href={`/admin/users?page=${p}&q=${q}`}
                                    className={`px-3 py-1 border border-slate-200 rounded ${page === p ? 'bg-[#2c3e50] text-white' : 'bg-white hover:bg-slate-50'}`}
                                >
                                    {p}
                                </Link>
                            );
                        })}

                        <Link
                            href={`/admin/users?page=${Math.min(totalPages, page + 1)}&q=${q}`}
                            className={`px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Next
                        </Link>
                        <Link
                            href={`/admin/users?page=${totalPages}&q=${q}`}
                            className={`px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 ${page === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            Last
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
