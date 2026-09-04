'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';
import { CartIcon } from './icons';
import { MENU_ITEMS, formatToman } from '@/lib/menu-data';
import { translate, type Locale, type Messages } from '@/lib/i18n';

export default function CartButton({ locale, dict }: { locale: Locale; dict: Messages }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { cart, itemCount, total, setQuantity, removeItem } = useCart();
  const t = (key: string) => translate(dict, key);
  const isFa = locale === 'fa';

  // Same open/close pattern as the mobile nav panel in Header.tsx (Escape +
  // click-outside), kept local here rather than shared since the two
  // panels don't have enough in common to be worth a hook of their own.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  return (
    <div className="cart-button-wrap">
      <button
        ref={toggleRef}
        type="button"
        className="cart-button focus-ring"
        aria-expanded={open}
        aria-controls="cart-panel"
        aria-label={itemCount > 0 ? t('cart.aria_label_with_count').replace('{count}', String(itemCount)) : t('cart.aria_label')}
        onClick={() => setOpen((v) => !v)}
      >
        <CartIcon className="cart-button-icon" />
        {itemCount > 0 && (
          <span className="cart-button-badge" aria-hidden="true">
            {itemCount}
          </span>
        )}
      </button>

      {open && (
        <div id="cart-panel" ref={panelRef} className="cart-panel" dir={isFa ? 'rtl' : 'ltr'}>
          {cart.length === 0 ? (
            <p className="cart-panel-empty">{t('cart.empty')}</p>
          ) : (
            <>
              <ul className="cart-panel-list">
                {cart.map((line) => {
                  // MENU_ITEMS lookup uses id, not slug -- findMenuItemBySlug
                  // is exported for the /menu page's per-slug deep link, but
                  // its underlying array lookup works fine keyed on id too
                  // since both are unique strings; using .find directly here
                  // to avoid a slug/id mismatch.
                  const item = MENU_ITEMS.find((m) => m.id === line.id);
                  if (!item) return null;
                  const label = isFa ? item.labelFa : item.labelEn;
                  return (
                    <li key={line.id} className="cart-panel-line">
                      <div className="cart-panel-line-info">
                        <span className="cart-panel-line-name">{label}</span>
                        <span className="cart-panel-line-price">{formatToman(item.price, locale)}</span>
                      </div>
                      <div className="cart-panel-line-actions">
                        <div className="item-modal-qty item-modal-qty--compact" role="group" aria-label={t('cart.quantity')}>
                          <button
                            type="button"
                            className="item-modal-qty-btn focus-ring"
                            onClick={() => setQuantity(line.id, line.quantity - 1)}
                            aria-label={t('cart.decrease_qty')}
                          >
                            −
                          </button>
                          <span className="item-modal-qty-value">{line.quantity}</span>
                          <button
                            type="button"
                            className="item-modal-qty-btn focus-ring"
                            onClick={() => setQuantity(line.id, line.quantity + 1)}
                            aria-label={t('cart.increase_qty')}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-panel-remove focus-ring"
                          onClick={() => removeItem(line.id)}
                          aria-label={t('cart.remove_item').replace('{name}', label)}
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="cart-panel-total">
                <span>{t('cart.total')}</span>
                <span>{formatToman(total, locale)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
