import ThreeCanvas from "@/components/three/ThreeCanvas";

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
          <div className="flex items-center justify-between">
            <h2 
              className="text-2xl font-semibold text-[var(--neon-lime)]"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Three.js Canvas
            </h2>
            <a 
              href="/terminal"
              className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#0df20d]/30 rounded-lg text-[#0df20d] hover:border-[#0df20d] hover:shadow-[0_0_10px_rgba(13,242,13,0.3)] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Terminal
            </a>
          </div>
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
