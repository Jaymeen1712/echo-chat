import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import OptimizedImage from '../OptimizedImage';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});

window.IntersectionObserver = mockIntersectionObserver;

describe('OptimizedImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders image with correct src and alt', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('shows placeholder while loading', () => {
    const placeholder = <div>Loading...</div>;

    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        placeholder={placeholder}
        lazy={false}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('hides placeholder after image loads', async () => {
    const placeholder = <div>Loading...</div>;

    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        placeholder={placeholder}
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    
    // Simulate image load
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('shows fallback image on error', async () => {
    render(
      <OptimizedImage
        src="https://example.com/broken-image.jpg"
        alt="Test image"
        fallbackSrc="https://example.com/fallback.jpg"
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    
    // Simulate image error
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    });
  });

  it('calls onLoad callback when image loads', async () => {
    const onLoad = vi.fn();

    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        onLoad={onLoad}
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
    });
  });

  it('calls onError callback when image fails to load', async () => {
    const onError = vi.fn();

    render(
      <OptimizedImage
        src="https://example.com/broken-image.jpg"
        alt="Test image"
        onError={onError}
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('sets up intersection observer for lazy loading', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        lazy={true}
      />
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '50px',
        threshold: 0.1,
      })
    );
  });

  it('does not render image immediately when lazy loading is enabled', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        lazy={true}
      />
    );

    // Image should not be rendered initially with lazy loading
    expect(screen.queryByAltText('Test image')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        className="custom-class"
        lazy={false}
      />
    );

    const container = screen.getByAltText('Test image').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('shows loading skeleton when no placeholder is provided', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        lazy={false}
      />
    );

    // Should show the default loading skeleton
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('optimizes image URL with quality parameter', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        quality={75}
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg?q=75');
  });

  it('does not modify local image URLs', () => {
    render(
      <OptimizedImage
        src="/local-image.jpg"
        alt="Test image"
        quality={75}
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('src', '/local-image.jpg');
  });

  it('sets loading attribute based on lazy prop', () => {
    const { rerender } = render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        lazy={true}
      />
    );

    // With lazy loading, should not render image initially
    expect(screen.queryByAltText('Test image')).not.toBeInTheDocument();

    rerender(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test image"
        lazy={false}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'eager');
  });
});
