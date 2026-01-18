
'use client';

import { useEffect, useState } from 'react';

export default function AnimatedStars() {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3000 + 2000,
        }));
        setStars(generatedStars);
    }, []);

    return (
        <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute bg-primary-400/20 rounded-full animate-pulse"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDuration: `${star.duration}ms`,
                    }}
                />
            ))}
            {/* Larger Animated Circles */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/5 rounded-full blur-[100px] animate-blob" />
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </div>
    );
}
