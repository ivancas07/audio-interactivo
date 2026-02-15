"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className={cn(
                    "w-10 h-10 border-2 border-current flex items-center justify-center pointer-events-none opacity-50",
                    className
                )}
            >
                <span className="sr-only">Toggle theme</span>
            </button>
        );
    }

    return (
        <button
            className={cn(
                "w-10 h-10 border-2 border-current flex items-center justify-center hover:bg-foreground hover:text-background transition-colors",
                className
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="sr-only">Toggle theme</span>
        </button>
    );
}
