'use client';

import Image from 'next/image';
import { Song } from '@/lib/types/music';
import { formatDuration } from '@/lib/music-store';

interface SongItemProps {
  song: Song;
  isPlaying?: boolean;
  onClick?: () => void;
}

export function SongItem({ song, isPlaying = false, onClick }: SongItemProps) {
  return (
    <div
      data-testid="song-item"
      data-song-id={song.id}
      onClick={onClick}
      className={`
        flex items-center gap-4 p-3 rounded-lg cursor-pointer
        transition-all duration-200
        hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]
        ${isPlaying 
          ? 'border-2 border-[var(--neon-cyan)] shadow-[0_0_20px_rgba(6,182,212,0.5)] bg-[var(--neon-cyan)]/10' 
          : 'border border-transparent hover:border-[var(--neon-cyan)]/30 bg-[#0a0a0a]/50'
        }
      `}
    >
      {/* Cover Image */}
      <div 
        className="w-12 h-12 rounded-md flex-shrink-0 overflow-hidden"
        data-testid="song-cover"
      >
        {song.coverUrl ? (
          <Image
            src={song.coverUrl}
            alt={`${song.title} cover`}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--neon-cyan)]/30 to-[var(--neon-magenta)]/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[var(--text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 
            className={`font-medium truncate ${isPlaying ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-primary)]'}`}
            data-testid="song-title"
          >
            {song.title}
          </h3>
          {isPlaying && (
            <span 
              data-testid="playing-indicator"
              className="flex items-center gap-1 text-xs text-[var(--neon-cyan)]"
            >
              <span className="w-1 h-3 bg-[var(--neon-cyan)] animate-pulse" />
              <span className="w-1 h-4 bg-[var(--neon-cyan)] animate-pulse delay-75" />
              <span className="w-1 h-2 bg-[var(--neon-cyan)] animate-pulse delay-150" />
            </span>
          )}
        </div>
        <p 
          className="text-sm text-[var(--text-secondary)] truncate"
          data-testid="song-artist"
        >
          {song.artist}
        </p>
      </div>

      {/* Duration */}
      <span 
        className="text-sm text-[var(--text-muted)] font-mono flex-shrink-0"
        data-testid="song-duration"
      >
        {formatDuration(song.duration)}
      </span>
    </div>
  );
}
