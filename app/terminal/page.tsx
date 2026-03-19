import { TerminalWidget } from "@/components/terminal/TerminalWidget";

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-black p-4 md:p-10 flex items-center justify-center">
      <TerminalWidget />
    </div>
  );
}
