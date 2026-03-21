import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SongItem } from '@/components/music/SongItem';
import { Song } from '@/lib/types/music';

describe('SongItem', () => {
  const mockSong: Song = {
    id: 'song-1',
    title: 'Test Song',
    artist: 'Test Artist',
    duration: 185,
    coverUrl: '/test-cover.jpg',
  };

  const mockSongWithoutCover: Song = {
    id: 'song-2',
    title: 'Song Without Cover',
    artist: 'Unknown Artist',
    duration: 245,
  };

  it('renders song item with all details', () => {
    render(<SongItem song={mockSong} />);

    expect(screen.getByTestId('song-item')).toBeInTheDocument();
    expect(screen.getByTestId('song-title')).toHaveTextContent('Test Song');
    expect(screen.getByTestId('song-artist')).toHaveTextContent('Test Artist');
    expect(screen.getByTestId('song-duration')).toHaveTextContent('3:05');
  });

  it('displays cover image when coverUrl is provided', () => {
    render(<SongItem song={mockSong} />);

    const cover = screen.getByTestId('song-cover');
    expect(cover).toBeInTheDocument();
    const img = cover.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('src')).toContain('test-cover.jpg');
  });

  it('shows gradient placeholder when coverUrl is not provided', () => {
    render(<SongItem song={mockSongWithoutCover} />);

    const cover = screen.getByTestId('song-cover');
    expect(cover).toBeInTheDocument();
    expect(cover.querySelector('img')).not.toBeInTheDocument();
    expect(cover.querySelector('div')).toHaveClass('bg-gradient-to-br');
  });

  it('shows playing indicator when isPlaying is true', () => {
    render(<SongItem song={mockSong} isPlaying={true} />);

    expect(screen.getByTestId('playing-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('song-title')).toHaveClass('text-[var(--neon-cyan)]');
  });

  it('does not show playing indicator when isPlaying is false', () => {
    render(<SongItem song={mockSong} isPlaying={false} />);

    expect(screen.queryByTestId('playing-indicator')).not.toBeInTheDocument();
    expect(screen.getByTestId('song-title')).not.toHaveClass('text-[var(--neon-cyan)]');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<SongItem song={mockSong} onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('song-item'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('formats duration correctly for songs over 1 hour', () => {
    const longSong: Song = {
      ...mockSong,
      duration: 3661, // 1:01:01
    };
    render(<SongItem song={longSong} />);

    expect(screen.getByTestId('song-duration')).toHaveTextContent('61:01');
  });

  it('formats duration correctly for short songs', () => {
    const shortSong: Song = {
      ...mockSong,
      duration: 45,
    };
    render(<SongItem song={shortSong} />);

    expect(screen.getByTestId('song-duration')).toHaveTextContent('0:45');
  });

  it('applies data-song-id attribute', () => {
    render(<SongItem song={mockSong} />);

    expect(screen.getByTestId('song-item')).toHaveAttribute('data-song-id', 'song-1');
  });
});
