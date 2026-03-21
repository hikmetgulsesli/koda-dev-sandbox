'use client';

import { useState, useEffect, useCallback } from 'react';
import { Song } from '@/lib/types/music';
import { SongItem } from './SongItem';
import { playSong, getPlayerState, subscribe } from '@/lib/music-store';

interface SongListProps {
  songs: Song[];
  playlistId?: string;
}

export function SongList({ songs }: SongListProps) {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  useEffect(() => {
    // Initial state
    setCurrentSongId(getPlayerState().currentSongId);

    // Subscribe to changes
    const unsubscribe = subscribe(() => {
      setCurrentSongId(getPlayerState().currentSongId);
    });

    return unsubscribe;
  }, []);

  const handlePlaySong = useCallback((songId: string) => {
    playSong(songId);
  }, []);

  // Empty state
  if (songs.length === 0) {
    return (
      <div 
        data-testid="empty-playlist"
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-[var(--text-muted)]"
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
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          Bu playlistte şarkı yok
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Müzik eklemek için aşağıdaki butonu kullanın
        </p>
        <button 
          data-testid="add-song-cta"
          className="px-4 py-2 bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30 rounded-lg text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors"
        >
          Playliste şarkı ekle
        </button>
      </div>
    );
  }

  return (
    <div 
      data-testid="song-list"
      className="space-y-2"
    >
      {songs.map((song) => (
        <SongItem
          key={song.id}
          song={song}
          isPlaying={currentSongId === song.id}
          onClick={() => handlePlaySong(song.id)}
        />
      ))}
    </div>
  );
}
