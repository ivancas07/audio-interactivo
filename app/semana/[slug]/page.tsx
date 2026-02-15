import { getPageContent, getPublishedWeeks } from "@/lib/notion";
import { NotionPage } from "@/components/NotionPage";
import { ClaimPoints } from "@/components/ClaimPoints";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const weeks = await getPublishedWeeks().catch((e) => {
        console.warn("generateStaticParams: Failed to fetch weeks", e);
        return [];
    });
    return weeks.map((week) => ({
        slug: week.slug,
    }));
}

export default async function WeekPage(props: PageProps) {
    const params = await props.params; // Next.js 15+ req, keeping for future proofing or strictly typing as Promise
    const recordMap = await getPageContent(params.slug);

    if (!recordMap) {
        notFound();
    }

    // Find the week metadata to display key info if needed, or we can just rely on the content.
    // Ideally, we'd fetch the week metadata again to pass to ClaimPoints.
    // For optimization, we could return metadata from getPageContent too, but let's just fetch all weeks and find it.
    // It's static generation so it's fine.
    const weeks = await getPublishedWeeks().catch(() => []);
    const currentWeek = weeks.find((w) => w.slug === params.slug);

    return (
        <div className="min-h-screen pb-20">
            <header className="flex justify-between items-center mb-8 border-b-2 border-current pb-4">
                <Link href="/" className="font-mono hover:bg-foreground hover:text-background px-2 transition-colors">
                    ← VOLVER
                </Link>
                <ThemeToggle />
            </header>

            <main>
                {currentWeek && (
                    <div className="mb-8">
                        <span className="font-mono text-sm border border-current px-2 py-1 inline-block mb-2">
                            SEMANA {String(currentWeek.weekNumber).padStart(2, "0")}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
                            {currentWeek.title}
                        </h1>
                    </div>
                )}

                <NotionPage recordMap={recordMap} />

                {currentWeek && (
                    <ClaimPoints
                        weekNumber={currentWeek.weekNumber}
                        slug={currentWeek.slug}
                    />
                )}
            </main>
        </div>
    );
}
