import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import MobileNav from '../components/MobileNav';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push }),
}));

describe('<MobileNav />', () => {
  beforeEach(() => {
    push.mockClear();
    document.body.style.overflow = '';
  });

  it('is closed by default and opens on trigger click', () => {
    render(<MobileNav />);
    expect(screen.getByRole('button', { name: 'باز کردن منو' })).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    expect(screen.getByRole('navigation', { name: 'ناوبری اصلی' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'بستن پنل ناوبری' })).toBeInTheDocument();
  });

  it('locks background scroll while open and restores it on close', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'بستن پنل ناوبری' }));
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByRole('button', { name: 'باز کردن منو' })).toHaveFocus();
  });

  it('closes on backdrop click', () => {
    const { container } = render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    const backdrop = container.ownerDocument.querySelector('.mobile-nav-backdrop--open');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);

    expect(document.body.style.overflow).toBe('');
  });

  it('navigates to the reserve link after the select delay', async () => {
    jest.useFakeTimers();
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    fireEvent.click(screen.getByRole('link', { name: /رزرو میز/ }));
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(push).toHaveBeenCalledWith('/contact');
    jest.useRealTimers();
  });

  it('marks the current route as active among the nav items', () => {
    render(<MobileNav />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    const homeLink = screen.getByRole('link', { name: 'خانه' });
    expect(homeLink.className).toContain('mobile-nav-item--active');
  });
});
