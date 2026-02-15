"use client";

import * as React from "react";
import { type Week } from "@/lib/notion";
import { WeekCard } from "@/components/WeekCard";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
    weeks: Week[];
}

export function Search({ weeks: initialWeeks }: SearchProps) {
    const [query, setQuery] = React.useState("");
    const [filteredWeeks, setFilteredWeeks] = React.useState(initialWeeks);

    React.useEffect(() => {
        const lowerQuery = query.toLowerCase();
        const filtered = initialWeeks.filter(
            (week) =>
                week.title.toLowerCase().includes(lowerQuery) ||
                week.summary.toLowerCase().includes(lowerQuery)
        );
        setFilteredWeeks(filtered);
    }, [query, initialWeeks]);

    return (
        <div>
            <div className="mb-12 relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 opacity-50" />
                </div>
                <input
                    type="text"
                    placeholder="BUSCAR SEMANA..."
                    className="block w-full pl-10 pr-3 py-4 bg-transparent border-b-2 border-current text-lg font-mono focus:outline-none focus:border-foreground placeholder:opacity-50 transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWeeks.map((week) => (
                    <WeekCard key={week.id} week={week} />
                ))}
                {filteredWeeks.length === 0 && (
                    <div className="col-span-full text-center py-20 opacity-50 font-mono">
                        NO SE ENCONTRARON RESULTADOS
                    </div>
                )}
            </div>
        </div>
    );
}
