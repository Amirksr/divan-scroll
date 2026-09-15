import { render, screen, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/components/CartContext';
import { CART_STORAGE_KEY } from '@/lib/cart-storage';
import { MENU_ITEMS } from '@/lib/menu-data';

const realId = MENU_ITEMS[0].id;

function Probe() {
  const { cart, itemCount, addItem } = useCart();
  return (
    <div>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="lines">{JSON.stringify(cart)}</span>
      <button type="button" onClick={() => addItem(realId, 2)}>
        add
      </button>
    </div>
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
});

/**
 * Regression test for a real bug: <html> (and therefore CartProvider) is
 * rendered inside app/[locale]/layout.tsx, so switching language changes
 * the [locale] route segment and Next.js remounts the whole layout --
 * wiping an in-progress cart every time the reader changed language.
 * Unmounting and remounting the provider here reproduces exactly that.
 */
describe('CartProvider persistence across a remount (locale switch)', () => {
  it('starts empty when nothing is stored', () => {
    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('restores the cart after an unmount/remount', () => {
    const first = render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    act(() => {
      screen.getByText('add').click();
    });
    expect(screen.getByTestId('count')).toHaveTextContent('2');

    first.unmount();

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('lines')).toHaveTextContent(realId);
  });

  it('does not let the initial empty state overwrite a stored cart before restore runs', () => {
    window.sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ id: realId, quantity: 5 }])
    );

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('5');
    // ...and the stored value is still intact for the next mount.
    expect(JSON.parse(window.sessionStorage.getItem(CART_STORAGE_KEY)!)).toEqual([
      { id: realId, quantity: 5 },
    ]);
  });

  it('ignores a stored cart referencing an item no longer on the menu', () => {
    window.sessionStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ id: 'no-longer-on-menu', quantity: 3 }])
    );

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('persists an emptied cart rather than resurrecting the old one on remount', () => {
    const first = render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );
    act(() => {
      screen.getByText('add').click();
    });
    act(() => {
      screen.getByText('add').click();
    });
    expect(screen.getByTestId('count')).toHaveTextContent('4');
    first.unmount();

    // Simulate the reader clearing it out in a later mount.
    window.sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
