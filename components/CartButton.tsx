'use client';

import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';
import { CartIcon } from './icons';
import { MENU_ITEMS, formatToman } from '@/lib/menu-data';

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { cart, itemCount, total, setQuantity, removeItem } = useCart();

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
        aria-label={`سبد خرید${itemCount > 0 ? ` (${itemCount} کالا)` : ''}`}
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
        <div id="cart-panel" ref={panelRef} className="cart-panel" dir="rtl">
          {cart.length === 0 ? (
            <p className="cart-panel-empty">سبد خرید شما خالیست</p>
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
                  return (
                    <li key={line.id} className="cart-panel-line">
                      <div className="cart-panel-line-info">
                        <span className="cart-panel-line-name">{item.labelFa}</span>
                        <span className="cart-panel-line-price">{formatToman(item.price)}</span>
                      </div>
                      <div className="cart-panel-line-actions">
                        <div className="item-modal-qty item-modal-qty--compact" role="group" aria-label="تعداد">
                          <button
                            type="button"
                            className="item-modal-qty-btn focus-ring"
                            onClick={() => setQuantity(line.id, line.quantity - 1)}
                            aria-label="کم کردن تعداد"
                          >
                            −
                          </button>
                          <span className="item-modal-qty-value">{line.quantity}</span>
                          <button
                            type="button"
                            className="item-modal-qty-btn focus-ring"
                            onClick={() => setQuantity(line.id, line.quantity + 1)}
                            aria-label="زیاد کردن تعداد"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="cart-panel-remove focus-ring"
                          onClick={() => removeItem(line.id)}
                          aria-label={`حذف ${item.labelFa} از سبد`}
                        >
                          حذف
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="cart-panel-total">
                <span>جمع کل</span>
                <span>{formatToman(total)}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
