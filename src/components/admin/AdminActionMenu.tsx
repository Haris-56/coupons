
'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminActionMenuProps {
    editUrl: string;
    onDelete: () => Promise<{ message: string }>;
    itemName?: string;
}

export function AdminActionMenu({ editUrl, onDelete, itemName = 'item' }: AdminActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            const result = await onDelete();
            if (result.message) {
                setIsOpen(false);
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete ' + itemName);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-accent-600 hover:border-accent-200 transition-all shadow-sm flex items-center justify-center group"
                aria-label="Actions"
            >
                <MoreHorizontal size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <Link
                        href={editUrl}
                        className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-accent-600 transition-all group/item"
                    >
                        <Edit size={14} className="text-slate-300 group-hover/item:text-accent-500 transition-colors" />
                        Edit Record
                    </Link>
                    <div className="h-px bg-slate-100 mx-3 my-1" />
                    <button
                        onClick={() => {
                            setShowDeleteConfirm(true);
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-all w-full text-left group/item"
                    >
                        <Trash2 size={14} className="text-rose-300 group-hover/item:text-rose-500 transition-colors" />
                        Delete Item
                    </button>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-slate-900/20 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 border border-slate-200 animate-in zoom-in-95 duration-200 text-center">
                        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6">
                            <AlertCircle size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-1">Confirm Deletion</h3>
                        <p className="text-slate-500 text-sm mb-8 px-4">
                            Are you sure you want to delete this {itemName}? This action cannot be undone.
                        </p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleDelete}
                                className="w-full py-3.5 bg-rose-600 text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/10 active:scale-95"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                Confirm Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-700 transition-all active:scale-95"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
