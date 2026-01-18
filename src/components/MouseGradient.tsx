
'use client';

import { useEffect, useState } from 'react';

export default function MouseGradient() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-[9999] opacity-40 transition-opacity duration-300"
            style={{
                background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15) 0%, rgba(244, 63, 94, 0.05) 40%, transparent 80%)`,
            }}
        />
    );
}
