'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { MenuItem } from '@/lib/menu-data';
import { formatToman } from '@/lib/menu-data';
import { parseIngredients } from '@/lib/ingredients-utils';
import { CATEGORY_META } from '@/lib/categories-data';
import { useCart } from './CartContext';
import { translate, type Locale, type Messages } from '@/lib/i18n';

interface MenuItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  locale: Locale;
  dict: Messages;
}

/**
 * A native <dialog> (via showModal()) rather than a hand-rolled overlay div:
 * focus trapping, Escape-to-close, and the ::backdrop are all handled by
 * the browser for free, which is both less code and more reliably
 * accessible than reimplementing that logic (see accessibility skill:
 * "prefer native semantic elements over ARIA replacements").
 */
export default function MenuItemModal({ item, onClose, locale, dict }: MenuItemModalProps) {
  const t = (key: string) => translate(dict, key);
  const isFa = locale === 'fa';
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const { addItem, getQuantity } = useCart();

  // Reset transient UI state (quantity stepper, "added" confirmation) each
  // time a *different* item is opened, but not on every render.
  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [item?.id]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (item && !dialog.open) {
      dialog.showModal();
    } else if (!item && dialog.open) {
      dialog.close();
    }
  }, [item]);

  // The dialog's native "close" event covers Escape, the browser's own
  // close affordances, and our own close button/backdrop click below --
  // one handler keeps onClose in sync regardless of which of those fired.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  const handleDismiss = () => {
    // Route every dismiss path (X button, backdrop click) through the
    // native .close() call instead of invoking the onClose prop directly.
    // The dialog's own "close" event listener above is then the single
    // place that calls onClose -- Escape/cancel already goes through that
    // same event, so this avoids onClose firing twice for one dismissal.
    dialogRef.current?.close();
  };

  if (!item) {
    // Still rendered (so the close animation / native close() has a node
    // to act on) but empty -- avoids a null-item render crash below.
    return <dialog ref={dialogRef} className="item-modal" />;
  }

  const ingredients = parseIngredients(isFa ? item.descFa : item.descEn);
  const category = CATEGORY_META.find((c) => c.slug === item.category);
  const categoryName = category ? (isFa ? category.name : category.nameEn) : undefined;
  const label = isFa ? item.labelFa : item.labelEn;
  const inCartQuantity = getQuantity(item.id);

  const handleAddToCart = () => {
    addItem(item.id, quantity);
    setJustAdded(true);
  };

  return (
    <dialog
      ref={dialogRef}
      className="item-modal"
      aria-labelledby="item-modal-title"
      onClick={(e) => {
        // Native <dialog> has no built-in "click outside to close" --
        // clicking the ::backdrop still fires a click on the dialog
        // element itself (since the backdrop isn't a child node), so a
        // click whose target IS the dialog (not one of its children)
        // means the backdrop was clicked.
        if (e.target === dialogRef.current) handleDismiss();
      }}
    >
      <div className="item-modal-content" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="item-modal-media">
          <button type="button" className="item-modal-close focus-ring" onClick={handleDismiss} aria-label={t('quick_view.close')}>
            ✕
          </button>
          <Image
            src={item.image}
            alt={label}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="item-modal-badges">
            {categoryName && <span className="item-modal-badge">{categoryName}</span>}
            {item.popular && <span className="item-modal-badge item-modal-badge--popular">{t('common.popular')}</span>}
            {item.vegetarian && <span className="item-modal-badge item-modal-badge--veg">{t('common.vegetarian')}</span>}
          </div>
        </div>

        <div className="item-modal-body">
          <h2 id="item-modal-title" className="item-modal-title">
            {label}
          </h2>

          {ingredients.length > 0 && (
            <ul className="item-modal-ingredients">
              {ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          )}

          <div className="item-modal-footer">
            <span className="item-modal-price">{formatToman(item.price, locale)}</span>

            <div className="item-modal-qty" role="group" aria-label={t('quick_view.quantity')}>
              <button
                type="button"
                className="item-modal-qty-btn focus-ring"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={t('quick_view.decrease_qty')}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="item-modal-qty-value" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                className="item-modal-qty-btn focus-ring"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label={t('quick_view.increase_qty')}
              >
                +
              </button>
            </div>
          </div>

          <button type="button" className="item-modal-add focus-ring" onClick={handleAddToCart}>
            {justAdded ? t('quick_view.added') : t('quick_view.add_to_cart')}
          </button>

          {inCartQuantity > 0 && (
            <p className="item-modal-in-cart" aria-live="polite">
              {t('quick_view.in_cart').replace('{count}', String(inCartQuantity))}
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
