import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import MobileNav from '../components/MobileNav';
import { getMessages } from '../lib/i18n';

const push = jest.fn();
let mockPathname = '/fa';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push }),
}));

const dict = getMessages('fa');

describe('<MobileNav />', () => {
  beforeEach(() => {
    push.mockClear();
    mockPathname = '/fa';
    document.body.style.overflow = '';
  });

  it('is closed by default and opens on trigger click', () => {
    render(<MobileNav locale="fa" dict={dict} />);
    expect(screen.getByRole('button', { name: 'باز کردن منو' })).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    expect(screen.getByRole('navigation', { name: 'ناوبری اصلی' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'بستن پنل ناوبری' })).toBeInTheDocument();
  });

  it('locks background scroll while open and restores it on close', () => {
    render(<MobileNav locale="fa" dict={dict} />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'بستن پنل ناوبری' }));
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape and returns focus to the trigger', () => {
    render(<MobileNav locale="fa" dict={dict} />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.getByRole('button', { name: 'باز کردن منو' })).toHaveFocus();
  });

  it('closes on backdrop click', () => {
    const { container } = render(<MobileNav locale="fa" dict={dict} />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    const backdrop = container.ownerDocument.querySelector('.mobile-nav-backdrop--open');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop as Element);

    expect(document.body.style.overflow).toBe('');
  });

  it('navigates to the locale-prefixed reserve link after the select delay', async () => {
    jest.useFakeTimers();
    render(<MobileNav locale="fa" dict={dict} />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    fireEvent.click(screen.getByRole('link', { name: /رزرو میز/ }));
    act(() => {
      jest.advanceTimersByTime(250);
    });

    expect(push).toHaveBeenCalledWith('/fa/contact');
    jest.useRealTimers();
  });

  it('marks the current route as active among the nav items, with the colored indicator bar', () => {
    render(<MobileNav locale="fa" dict={dict} />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    const homeLink = screen.getByRole('link', { name: 'خانه' });
    expect(homeLink.className).toContain('mobile-nav-item--active');
    expect(homeLink.querySelector('.mobile-nav-item-active-bar')).not.toBeNull();

    const menuLink = screen.getByRole('link', { name: 'منوی کامل' });
    expect(menuLink.className).not.toContain('mobile-nav-item--active');
    expect(menuLink.querySelector('.mobile-nav-item-active-bar')).toBeNull();
  });

  it('renders English labels and links for the en dictionary', () => {
    mockPathname = '/en';
    render(<MobileNav locale="en" dict={getMessages('en')} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/en#hero');
    expect(screen.getByRole('link', { name: 'Full menu' })).toHaveAttribute('href', '/en/menu');
    expect(screen.getByRole('link', { name: /Reserve a table/ })).toHaveAttribute('href', '/en/contact');
  });

  it('includes the language switcher in the panel', () => {
    render(<MobileNav locale="fa" dict={dict} />);
    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منو' }));

    expect(screen.getByRole('group', { name: 'زبان' })).toBeInTheDocument();
  });
});
