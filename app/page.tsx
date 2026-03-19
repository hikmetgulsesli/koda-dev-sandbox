import ThreeCanvas from "@/components/three/ThreeCanvas";
import { SearchBar } from "@/components/search";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] p-8">
      <main className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 
            className="text-5xl font-bold neon-text-cyan"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            3D Game App
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Next.js 14 + Three.js + Design Tokens
          </p>
        </header>

        <section className="panel p-6 space-y-4">
          <h2 
            className="text-2xl font-semibold text-[var(--neon-lime)]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Şehir Arama
          </h2>
          <p className="text-[var(--text-secondary)]">
            Debounce&apos;lu arama ile Türkiye şehirlerini arayın. Sonuçlar otomatik olarak
            filtrelenir ve seçtiğiniz şehir tarayıcıda kaydedilir.
          </p>
          <SearchBar placeholder="Şehir ara... (örn: İstanbul, Ankara)" />
        </section>

        <section className="panel p-6 space-y-4">
          <h2 
            className="text-2xl font-semibold text-[var(--neon-lime)]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Three.js Canvas
          </h2>
          <p className="text-[var(--text-secondary)]">
            Interactive rotating cube. Hover to change color, click to scale.
            Drag to rotate the view.
          </p>
          <ThreeCanvas />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="elevated p-4 text-center">
            <div className="text-3xl font-bold neon-text-cyan">14</div>
            <div className="text-[var(--text-secondary)] text-sm">Next.js Version</div>
          </div>
          <div className="elevated p-4 text-center">
            <div className="text-3xl font-bold neon-text-magenta">3D</div>
            <div className="text-[var(--text-secondary)] text-sm">Three.js Powered</div>
          </div>
          <div className="elevated p-4 text-center">
            <div className="text-3xl font-bold text-[var(--neon-lime)]">TS</div>
            <div className="text-[var(--text-secondary)] text-sm">TypeScript</div>
          </div>
        </section>

        <footer className="text-center text-[var(--text-muted)] text-sm pt-8">
          Built with Next.js 14, Three.js, and Tailwind CSS
        </footer>
      </main>
    </div>
  );
}
