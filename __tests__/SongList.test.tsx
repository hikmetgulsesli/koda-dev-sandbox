import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SongList } from '@/components/music/SongList';
import { Song } from '@/lib/types/music';
import * as musicStore from '@/lib/music-store';

describe('SongList', () => {
  const mockSongs: Song[] = [
    {
      id: 'song-1',
      title: 'First Song',
      artist: 'Artist One',
      duration: 180,
      coverUrl: '/cover1.jpg',
    },
    {
      id: 'song-2',
      title: 'Second Song',
      artist: 'Artist Two',
      duration: 240,
    },
    {
      id: 'song-3',
      title: 'Third Song',
      artist: 'Artist Three',
      duration: 195,
      coverUrl: '/cover3.jpg',
    },
  ];

  beforeEach(() => {
    // Reset player state before each test
    musicStore.stopSong();
  });

  it('renders all songs in the list', () => {
    render(<SongList songs={mockSongs} />);

    expect(screen.getByTestId('song-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('song-item')).toHaveLength(3);
    
    expect(screen.getByText('First Song')).toBeInTheDocument();
    expect(screen.getByText('Second Song')).toBeInTheDocument();
    expect(screen.getByText('Third Song')).toBeInTheDocument();
  });

  it('renders empty state when no songs', () => {
    render(<SongList songs={[]} />);

    expect(screen.getByTestId('empty-playlist')).toBeInTheDocument();
    expect(screen.getByText('Bu playlistte şarkı yok')).toBeInTheDocument();
    expect(screen.getByText('Playliste şarkı ekle')).toBeInTheDocument();
  });

  it('calls playSong when a song is clicked', () => {
    const playSongSpy = jest.spyOn(musicStore, 'playSong');
    render(<SongList songs={mockSongs} />);

    const firstSong = screen.getAllByTestId('song-item')[0];
    fireEvent.click(firstSong);

    expect(playSongSpy).toHaveBeenCalledWith('song-1');
    playSongSpy.mockRestore();
  });

  it('highlights currently playing song', async () => {
    render(<SongList songs={mockSongs} />);

    // Initially no song is playing
    expect(screen.queryAllByTestId('playing-indicator')).toHaveLength(0);

    // Play first song
    fireEvent.click(screen.getAllByTestId('song-item')[0]);

    await waitFor(() => {
      expect(screen.getAllByTestId('playing-indicator')).toHaveLength(1);
    });
  });

  it('updates highlight when different song is played', async () => {
    render(<SongList songs={mockSongs} />);

    // Play first song
    fireEvent.click(screen.getAllByTestId('song-item')[0]);
    await waitFor(() => {
      expect(screen.getByText('First Song').parentElement?.querySelector('[data-testid="playing-indicator"]')).toBeInTheDocument();
    });

    // Play second song
    fireEvent.click(screen.getAllByTestId('song-item')[1]);
    await waitFor(() => {
      expect(screen.getByText('Second Song').parentElement?.querySelector('[data-testid="playing-indicator"]')).toBeInTheDocument();
    });
  });

  it('renders with playlistId prop', () => {
    render(<SongList songs={mockSongs} playlistId="playlist-1" />);

    expect(screen.getByTestId('song-list')).toBeInTheDocument();
    expect(screen.getAllByTestId('song-item')).toHaveLength(3);
  });

  it('empty state has add song CTA button', () => {
    render(<SongList songs={[]} />);

    const ctaButton = screen.getByTestId('add-song-cta');
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveTextContent('Playliste şarkı ekle');
  });

  it('each song item has correct song data', () => {
    render(<SongList songs={mockSongs} />);

    const songItems = screen.getAllByTestId('song-item');
    
    songItems.forEach((item, index) => {
      expect(item).toHaveAttribute('data-song-id', mockSongs[index].id);
    });
  });
});
