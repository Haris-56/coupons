
'use client';

import { useState, useActionState } from 'react';
import { ArrowLeft, Key, Eye, EyeOff, Loader2, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { createUser } from '@/actions/user';

export default function CreateUserPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(createUser, null);

    return (
        <div className="pb-20 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 text-slate-500 transition-all shadow-sm">
                    <ArrowLeft size={18} />
                </Link>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Add New User
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>
            </div>

            {state?.message && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center gap-3 border border-rose-100 animate-in fade-in slide-in-from-top-2 max-w-2xl">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{state.message}</span>
                </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 max-w-2xl">
                <form action={formAction} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <input
                            name="name"
                            required
                            type="text"
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <input
                            name="email"
                            required
                            type="email"
                            placeholder="email@example.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Security Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••"
                                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Access Level (Role)</label>
                        <select name="role" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all cursor-pointer">
                            <option value="USER">Standard User</option>
                            <option value="EDITOR">Content Editor</option>
                            <option value="ADMIN">Administrator</option>
                        </select>
                    </div>

                    <div className="pt-6">
                        <button
                            disabled={isPending}
                            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {isPending ? 'Saving...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
