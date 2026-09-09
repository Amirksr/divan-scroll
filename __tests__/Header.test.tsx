import { render } from '@testing-library/react';
import Header from '../components/Header';
import { CartProvider } from '../components/CartContext';
import { getMessages } from '../lib/i18n';

jest.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({ push: jest.fn() }),
}));

describe('<Header /> desktop language switcher', () => {
  it('renders a LanguageSwitcher instance directly in the header, in addition to the one inside the off-canvas panel', () => {
    const { container } = render(
      <CartProvider>
        <Header locale="en" dict={getMessages('en')} />
      </CartProvider>
    );
    // MobileNav's own copy (portaled into document.body, so it's outside
    // this render's `container`) always renders one -- the header must
    // add a second, inside .site-header-lang, or this assertion would
    // pass even without the fix.
    const headerCopy = container.querySelector('.site-header-lang .language-switcher');
    expect(headerCopy).not.toBeNull();

    const allCopies = document.querySelectorAll('.language-switcher');
    expect(allCopies.length).toBe(2);
  });
});
