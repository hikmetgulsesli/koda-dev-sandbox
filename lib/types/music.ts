export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  coverUrl?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

export interface PlayerState {
  currentSongId: string | null;
  isPlaying: boolean;
  currentPlaylistId: string | null;
}
