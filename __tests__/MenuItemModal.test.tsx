import { render, screen } from '@testing-library/react';
import MenuItemModal from '../components/MenuItemModal';
import { CartProvider } from '../components/CartContext';
import { getMessages } from '../lib/i18n';
import type { MenuItem } from '../lib/menu-data';

// jsdom does not implement <dialog>'s showModal()/close() -- standard
// no-op mock for this well-known gap, unrelated to what's under test here.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

const item: MenuItem = {
  id: 'test-item',
  slug: 'test-item',
  category: 'brunch',
  image: '/test.jpg',
  price: 100000,
  labelFa: 'لوبیا پلو با گوشت',
  labelEn: 'Green Bean Rice with Beef',
  descFa: 'لوبیا سبز، گوجه‌فرنگی، گوشت چرخ‌کرده، زعفران',
  descEn: 'Green beans, tomato, ground beef, saffron',
  popular: false,
  vegetarian: false,
  featured: false,
};

function renderModal(locale: 'fa' | 'en') {
  return render(
    <CartProvider>
      <MenuItemModal item={item} onClose={() => {}} locale={locale} dict={getMessages(locale)} />
    </CartProvider>
  );
}

describe('<MenuItemModal /> locale-aware content', () => {
  it('shows English ingredients (from descEn) on the English locale', () => {
    renderModal('en');
    // parseIngredients splits on Persian/Latin commas -- descEn's pieces
    // should each render as their own ingredient chip.
    expect(screen.getByText('Green beans')).toBeInTheDocument();
    expect(screen.getByText('ground beef')).toBeInTheDocument();
    // The Farsi description must not leak through.
    expect(screen.queryByText(/لوبیا سبز/)).not.toBeInTheDocument();
  });

  it('shows Farsi ingredients (from descFa) on the Farsi locale', () => {
    renderModal('fa');
    expect(screen.getByText('گوشت چرخ‌کرده')).toBeInTheDocument();
    expect(screen.queryByText(/ground beef/)).not.toBeInTheDocument();
  });

  it('does not render an English subtitle under the Farsi title', () => {
    renderModal('fa');
    // The Farsi title itself is present...
    expect(screen.getByRole('heading', { name: 'لوبیا پلو با گوشت' })).toBeInTheDocument();
    // ...but the English label must not also appear as a standalone subtitle.
    expect(screen.queryByText('Green Bean Rice with Beef')).not.toBeInTheDocument();
  });

  it('title is the English label on the English locale (no Farsi leaking in)', () => {
    renderModal('en');
    expect(screen.getByRole('heading', { name: 'Green Bean Rice with Beef' })).toBeInTheDocument();
    expect(screen.queryByText('لوبیا پلو با گوشت')).not.toBeInTheDocument();
  });
});
