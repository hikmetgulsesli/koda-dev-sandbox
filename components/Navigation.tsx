"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/terminal", label: "Terminal" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--bg-panel)] border-b border-[var(--border-subtle)]">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-xl font-bold neon-text-cyan"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            3D Game App
          </Link>
          
          <div className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all ${
                    isActive
                      ? "text-[var(--neon-lime)] border-b-2 border-[var(--neon-lime)] pb-1"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
