
'use client';

import { useState, useActionState } from 'react';
import { ArrowLeft, Key, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createUser } from '@/actions/user';

export default function CreateUserPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(createUser, null);

    return (
        <div className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/users" className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New User</h1>
                    <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 max-w-4xl">
                <form action={formAction} className="space-y-6">
                    {state?.message && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {state.message}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Name</label>
                        <input name="name" required type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <input name="email" required type="email" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                required
                                type={showPassword ? "text" : "password"}
                                className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                        <select name="role" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                            <option value="USER">User</option>
                            <option value="EDITOR">Editor</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    <div className="pt-6">
                        <button
                            disabled={isPending}
                            className="bg-[#2c3e50] hover:bg-[#34495e] text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors shadow-lg flex items-center gap-2"
                        >
                            {isPending && <Loader2 size={16} className="animate-spin" />}
                            {isPending ? 'Saving...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
