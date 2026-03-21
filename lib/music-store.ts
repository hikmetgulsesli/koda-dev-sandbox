import { Song, Playlist, PlayerState } from './types/music';

// Sample songs for testing
export const sampleSongs: Song[] = [
  {
    id: 'song-1',
    title: 'Neon Nights',
    artist: 'Cyber Dreams',
    duration: 184,
    coverUrl: '/covers/neon-nights.jpg',
  },
  {
    id: 'song-2',
    title: 'Digital Horizon',
    artist: 'Synthwave Orchestra',
    duration: 226,
    coverUrl: '/covers/digital-horizon.jpg',
  },
  {
    id: 'song-3',
    title: 'Midnight Drive',
    artist: 'Retro Riders',
    duration: 195,
  },
  {
    id: 'song-4',
    title: 'Electric Soul',
    artist: 'Neon Collective',
    duration: 248,
    coverUrl: '/covers/electric-soul.jpg',
  },
];

// Sample playlists
export const samplePlaylists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'Synthwave Essentials',
    songs: sampleSongs,
  },
  {
    id: 'playlist-2',
    name: 'Empty Playlist',
    songs: [],
  },
];

// Player state store
let playerState: PlayerState = {
  currentSongId: null,
  isPlaying: false,
  currentPlaylistId: null,
};

const listeners: Set<() => void> = new Set();

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach(listener => listener());
}

export function getPlayerState(): PlayerState {
  return { ...playerState };
}

export function playSong(songId: string): void {
  playerState = {
    ...playerState,
    currentSongId: songId,
    isPlaying: true,
  };
  notify();
}

export function pauseSong(): void {
  playerState = {
    ...playerState,
    isPlaying: false,
  };
  notify();
}

export function resumeSong(): void {
  if (playerState.currentSongId) {
    playerState = {
      ...playerState,
      isPlaying: true,
    };
    notify();
  }
}

export function stopSong(): void {
  playerState = {
    ...playerState,
    currentSongId: null,
    isPlaying: false,
  };
  notify();
}

export function setCurrentPlaylist(playlistId: string | null): void {
  playerState = {
    ...playerState,
    currentPlaylistId: playlistId,
  };
  notify();
}

// Helper functions
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getSongById(id: string): Song | undefined {
  return sampleSongs.find(s => s.id === id);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return samplePlaylists.find(p => p.id === id);
}

export function getSongsByPlaylistId(playlistId: string): Song[] {
  const playlist = getPlaylistById(playlistId);
  return playlist?.songs ?? [];
}
