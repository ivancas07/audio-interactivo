import Link from "next/link";
import { type Week } from "@/lib/notion";
import { cn } from "@/lib/utils";

interface WeekCardProps {
    week: Week;
    className?: string;
}

function isCurrentWeek(weekDate: string): boolean {
    const today = new Date();
    const weekStart = new Date(weekDate);

    // Calculate the end of the week (6 days after start)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return today >= weekStart && today <= weekEnd;
}

export function WeekCard({ week, className }: WeekCardProps) {
    const isCurrent = isCurrentWeek(week.date);
    const isAsueto = week.type?.toLowerCase() === "asueto";
    const isTecnicrea = week.type?.toLowerCase() === "tecnicrea";

    // Asueto card: disabled look with centered text
    if (isAsueto) {
        return (
            <div
                className={cn(
                    "block p-6 border-2 border-current/30 opacity-40 h-full flex flex-col justify-center items-center cursor-default",
                    className
                )}
            >
                <span className="font-mono text-sm border border-current/50 px-2 py-1 mb-4">
                    SEMANA {String(week.weekNumber).padStart(2, "0")}
                </span>
                <span className="text-2xl font-black uppercase tracking-widest">
                    ASUETO
                </span>
            </div>
        );
    }

    // Tecnicrea card: cool gradient, disabled, centered
    if (isTecnicrea) {
        return (
            <div
                className={cn(
                    "block p-6 border-2 border-transparent h-full flex flex-col justify-center items-center cursor-default relative overflow-hidden rounded-sm",
                    className
                )}
                style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ec4899 35%, #3b82f6 70%, #06b6d4 100%)",
                }}
            >
                <span className="font-mono text-sm border border-white/40 text-white px-2 py-1 mb-4">
                    SEMANA {String(week.weekNumber).padStart(2, "0")}
                </span>
                <span className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-lg">
                    TECNICREA
                </span>
                <span className="font-mono text-xs text-white/60 mt-2">
                    {week.summary}
                </span>
            </div>
        );
    }

    return (
        <Link
            href={`/semana/${week.slug}`}
            className={cn(
                "group block p-6 border-2 transition-colors h-full flex flex-col justify-between",
                isCurrent
                    ? "border-foreground bg-foreground/10 ring-2 ring-foreground ring-offset-2 ring-offset-background hover:bg-foreground hover:text-background"
                    : "border-current hover:bg-foreground hover:text-background",
                className
            )}
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2 items-center">
                        <span className="font-mono text-sm border border-current px-2 py-1">
                            SEMANA {String(week.weekNumber).padStart(2, "0")}
                        </span>
                        {isCurrent && (
                            <span className="font-mono text-xs bg-foreground text-background px-2 py-1 font-bold">
                                ← ACTUAL
                            </span>
                        )}
                    </div>
                    <span className="font-mono text-sm opacity-60">
                        {week.date}
                    </span>
                </div>
                <h2 className="text-2xl font-bold mb-4 uppercase leading-tight group-hover:text-background">
                    {week.title}
                </h2>
                <p className="opacity-80 line-clamp-3 mb-6 font-mono text-sm">
                    {week.summary}
                </p>
            </div>
            <div className="flex justify-end">
                <span className="font-bold underline decoration-2 underline-offset-4 group-hover:decoration-background">
                    LEER MÁS →
                </span>
            </div>
        </Link>
    );
}
