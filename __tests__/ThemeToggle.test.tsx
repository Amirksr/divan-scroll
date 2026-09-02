import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ThemeToggle from '../components/ThemeToggle';

describe('<ThemeToggle />', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('light');
    // @ts-expect-error -- jsdom doesn't implement matchMedia; force the
    // "dark preferred" branch so tests start from a known state.
    delete window.matchMedia;
    window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
  });

  it('resolves to dark after mount and shows a sun icon', async () => {
    render(<ThemeToggle />);
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-theme-ready', 'true'));
    expect(screen.getByRole('button')).toHaveAccessibleName('رفتن به حالت روشن');
  });

  it('switches to light on click, updating the DOM class and storage', async () => {
    render(<ThemeToggle />);
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-theme-ready', 'true'));

    fireEvent.click(screen.getByRole('button'));

    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(window.localStorage.getItem('theme')).toBe('light');
    expect(screen.getByRole('button')).toHaveAccessibleName('رفتن به حالت تیره');
  });

  it('toggles back to dark on a second click', async () => {
    render(<ThemeToggle />);
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('data-theme-ready', 'true'));

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    expect(document.documentElement.classList.contains('light')).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });
});
