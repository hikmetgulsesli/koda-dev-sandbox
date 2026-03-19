"use client";

import React, { useState, useEffect, useRef } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  status: "OK" | "INFO" | "WARN" | "ERROR";
  message: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, timestamp: "14:32:01", status: "OK", message: "Connecting to API gateway..." },
  { id: 2, timestamp: "14:32:05", status: "INFO", message: "Syncing workflow database..." },
  { id: 3, timestamp: "14:32:10", status: "OK", message: "Establishing secure handshake..." },
  { id: 4, timestamp: "14:32:12", status: "INFO", message: "Loading developer profile assets..." },
  { id: 5, timestamp: "14:32:15", status: "OK", message: "System core initialized. Welcome, developer." },
];

const ADDITIONAL_LOGS: LogEntry[] = [
  { id: 6, timestamp: "14:32:18", status: "INFO", message: "Mounting React components..." },
  { id: 7, timestamp: "14:32:22", status: "OK", message: "Webpack bundles optimized." },
  { id: 8, timestamp: "14:32:25", status: "INFO", message: "TypeScript compiler ready." },
  { id: 9, timestamp: "14:32:28", status: "OK", message: "Linting passed with 0 errors." },
  { id: 10, timestamp: "14:32:31", status: "INFO", message: "Hot module replacement active." },
  { id: 11, timestamp: "14:32:35", status: "OK", message: "Server listening on port 3000..." },
  { id: 12, timestamp: "14:32:38", status: "INFO", message: "Environment variables loaded." },
  { id: 13, timestamp: "14:32:42", status: "OK", message: "Database connection pool established." },
  { id: 14, timestamp: "14:32:45", status: "INFO", message: "Caching layer initialized (Redis)." },
  { id: 15, timestamp: "14:32:48", status: "OK", message: "All systems operational. ✓" },
];

const ASCII_ART = `
███████╗███████╗████████╗██████╗  ██████╗ ██╗  ██╗
██╔════╝██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗╚██╗██╔╝
███████╗█████╗     ██║   ██████╔╝██║   ██║ ╚███╔╝ 
╚════██║██╔══╝     ██║   ██╔══██╗██║   ██║ ██╔██╗ 
███████║███████╗   ██║   ██║  ██║╚██████╔╝██╔╝ ██╗
╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝
`;

function getStatusColor(status: LogEntry["status"]): string {
  switch (status) {
    case "OK":
      return "text-[#0df20d]";
    case "INFO":
      return "text-[#00f2ff]";
    case "WARN":
      return "text-[#ffbd2e]";
    case "ERROR":
      return "text-[#ff5f56]";
    default:
      return "text-slate-300";
  }
}

export function TerminalWidget() {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [showHelp, setShowHelp] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logsEndRef.current && typeof logsEndRef.current.scrollIntoView === "function") {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Simulate incoming logs
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < ADDITIONAL_LOGS.length) {
        setLogs((prev) => [...prev, ADDITIONAL_LOGS[index]]);
        index++;
      } else {
        // Reset and start over for continuous animation
        index = 0;
        setTimeout(() => {
          setLogs(INITIAL_LOGS);
        }, 5000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate connection status flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected((prev) => {
        // Mostly stay connected, occasional flicker
        if (prev && Math.random() > 0.95) return false;
        return true;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-xl border border-[#0df20d]/20 shadow-[0_0_40px_rgba(13,242,13,0.1)] overflow-hidden flex flex-col h-[700px]">
      {/* Chrome-style Header */}
      <header className="flex items-center justify-between bg-[#111] px-4 py-3 border-b border-[#0df20d]/10 select-none">
        {/* Window Controls */}
        <div className="flex gap-2 w-1/4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        {/* Title */}
        <div className="text-xs md:text-sm text-slate-400 font-medium flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          bash — user@portfolio — 80x24
        </div>
        {/* Utility Icons */}
        <div className="flex gap-3 w-1/4 justify-end text-slate-400">
          <button className="hover:text-[#0df20d] transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <button className="hover:text-[#0df20d] transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Terminal Content Area */}
      <main className="flex-1 p-6 overflow-y-auto font-mono text-sm md:text-base selection:bg-[#0df20d]/30 selection:text-[#0df20d]">
        {/* ASCII Art Section */}
        <div className="text-[#00f2ff] mb-8 font-bold text-center sm:text-left overflow-x-hidden">
          <pre className="inline-block text-xs sm:text-sm md:text-base leading-none">
            {ASCII_ART}
          </pre>
        </div>

        {/* Log Output Section */}
        <div className="space-y-1.5 mb-8">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-wrap gap-2">
              <span className="text-slate-600">[{log.timestamp}]</span>
              <span className={`font-bold ${getStatusColor(log.status)}`}>
                [{log.status}]
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
          {showHelp && (
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-slate-400">
                Type &apos;help&apos; to see available commands.
              </span>
            </div>
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Interactive Prompt */}
        <div className="flex items-center gap-2 group">
          <span className="text-[#0df20d] font-bold">$</span>
          <span className="text-[#00f2ff] font-medium">portfolio</span>
          <span className="text-slate-100">init</span>
          <span
            className={`inline-block w-2 h-5 bg-[#0df20d] ml-1 ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </main>

      {/* Terminal Footer/Status Bar */}
      <footer className="bg-[#111] px-4 py-2 border-t border-[#0df20d]/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full shadow-[0_0_5px_#0df20d] ${
                isConnected ? "bg-[#0df20d]" : "bg-[#ff5f56]"
              }`}
            />
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </div>
          <div>UTF-8</div>
        </div>
        <div className="flex gap-4">
          <div>MAIN.PY</div>
          <div className="text-[#0df20d]">LN 42, COL 18</div>
        </div>
      </footer>
    </div>
  );
}
