"use client";

import { cn } from "@/lib/utils";

interface ClaimPointsProps {
    weekNumber: number;
    slug: string;
    className?: string;
}

export function ClaimPoints({ weekNumber, slug, className }: ClaimPointsProps) {
    const baseUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL;

    if (!baseUrl) return null;

    // Construct URL with query parameters if needed
    // This assumes the Google Form uses specific entry IDs for pre-filling
    // For now, we will just append them as query params assuming the user replaces with correct IDs
    // e.g. ?entry.123456={weekNumber}&entry.234567={slug}
    const href = `${baseUrl}?entry.week=${weekNumber}&entry.slug=${slug}`;

    return (
        <div className={cn("mt-12 p-8 border-2 border-dashed border-current opacity-50 hover:opacity-100 transition-opacity text-center", className)}>
            <h3 className="font-mono text-lg font-bold mb-2">🎁 EASTER EGG DETECTED</h3>
            <p className="mb-4">Has encontrado el bloque de puntos extra.</p>
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-foreground text-background font-bold py-2 px-6 hover:scale-105 transition-transform"
            >
                RECLAMAR PUNTOS
            </a>
        </div>
    );
}
