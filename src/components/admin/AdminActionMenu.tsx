
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
                // We'll rely on revalidatePath for the UI update
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
                className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
                aria-label="Actions"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white border border-secondary-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                    <Link
                        href={editUrl}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors w-full text-left"
                    >
                        <Edit size={14} />
                        Edit
                    </Link>
                    <button
                        onClick={() => {
                            setShowDeleteConfirm(true);
                            setIsOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertCircle size={24} />
                            <h3 className="text-lg font-bold">Confirm Delete</h3>
                        </div>
                        <p className="text-secondary-600 mb-6">
                            Are you sure you want to delete this {itemName}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2 border border-secondary-200 rounded-lg text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
