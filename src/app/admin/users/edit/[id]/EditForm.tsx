
'use client';

import { useState, useActionState } from 'react';
import { ArrowLeft, Key, Eye, EyeOff, Loader2, Save, User as UserIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { updateUser } from '@/actions/user';

export function EditUserForm({ user }: { user: any }) {
    const [showPassword, setShowPassword] = useState(false);
    const [state, formAction, isPending] = useActionState(updateUser, null);

    return (
        <div className="pb-20 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/users" className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 text-slate-500 transition-all shadow-sm">
                    <ArrowLeft size={18} />
                </Link>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                        Edit User
                    </h1>
                    <div className="h-1 w-12 bg-accent-500 rounded-full"></div>
                </div>
            </div>

            {state?.message && (
                <div className="bg-rose-50 text-rose-600 p-4 rounded-xl flex items-center gap-3 border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={18} />
                    <span className="text-sm font-medium">{state.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <form action={formAction} className="space-y-6">
                            <input type="hidden" name="id" value={user._id} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                                    <input
                                        name="name"
                                        defaultValue={user.name}
                                        required
                                        type="text"
                                        placeholder="Full name"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                                    <input
                                        name="email"
                                        defaultValue={user.email}
                                        required
                                        type="email"
                                        placeholder="email@example.com"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Password Override */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reset Password</label>
                                <p className="text-[10px] text-slate-400 font-medium italic mb-2 ml-1">(Leave blank to keep current password)</p>
                                <div className="relative">
                                    <input
                                        name="password"
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

                            {/* Access Level */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Access Level (Role)</label>
                                <select name="role" defaultValue={user.role} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-accent-500 transition-all cursor-pointer">
                                    <option value="USER">Standard User</option>
                                    <option value="EDITOR">Content Editor</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                            </div>

                            <button
                                disabled={isPending}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Save size={18} />
                                )}
                                {isPending ? 'Updating...' : 'Update User'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-300">
                                <UserIcon size={32} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-800">{user.name}</h3>
                                <p className="text-[10px] text-accent-500 font-bold uppercase tracking-widest">{user.role}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">User ID</span>
                                <span className="text-[10px] font-mono text-slate-600">#{user._id.slice(-6)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-bold uppercase tracking-wider">Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 space-y-4">
                        <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider">Security Notice</h3>
                        <p className="text-[11px] text-rose-500 leading-relaxed font-medium">
                            Changing user roles or resets passwords should be done with caution after verifying the user's identity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
