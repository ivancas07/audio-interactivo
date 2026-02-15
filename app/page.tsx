import { getPublishedWeeks } from "@/lib/notion";
import { Search } from "@/components/Search";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 300;

export default async function Home() {
  const weeks = await getPublishedWeeks();

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center mb-16 pt-8">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          AUDIO
          <br />
          INTERACTIVO
        </h1>
        <ThemeToggle />
      </header>

      <section className="mb-12">
        <p className="text-xl md:text-2xl font-mono max-w-2xl leading-relaxed">
          Curso de diseño y desarrollo de audio interactivo.
          <br />
          <span className="opacity-50">Explorando la intersección entre sonido, código y experiencia de usuario.</span>
        </p>
      </section>

      <Search weeks={weeks} />
    </div>
  );
}
