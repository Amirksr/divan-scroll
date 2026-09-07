import fs from 'fs';
import path from 'path';

/**
 * Regression test for a real production bug: --font-fa/--font-display/
 * --font-body/--font-mono/--font-current were declared on `:root` (i.e.
 * <html>), but the actual next/font variables they reference
 * (--font-vazirmatn etc., see app/[locale]/layout.tsx) are only ever set
 * on <body> via a className there. A custom property's var() references
 * are resolved at the element where the property is declared, not
 * lazily wherever it's later consumed -- so on <html>, where
 * --font-vazirmatn doesn't exist, --font-fa computed to invalid, and
 * every descendant inherited that invalid result regardless of
 * --font-vazirmatn being perfectly available lower down on body.
 *
 * This produced a real bug confirmed live: every themed selector's
 * font-family silently fell back to the browser's UA default ("Times
 * New Roman"), even though the next/font variable itself, and unrelated
 * :root tokens like --gold, checked out fine in isolation via
 * getComputedStyle.
 *
 * jsdom's CSS engine does not reproduce this "invalid at declaration
 * site" behavior (confirmed by hand -- the same assertions passed under
 * jsdom whether these were declared on :root or body), so a computed-
 * style test here would pass either way and wouldn't catch a
 * regression. This checks CSS structure directly instead: these five
 * properties must be declared inside a rule whose selector resolves to
 * <body> or a descendant of it, never bare `:root`/`html`.
 */
describe('font alias tokens are declared on body, not :root/html', () => {
  const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Strip comments first so documentation mentioning these property names
  // (there's plenty, explaining exactly this bug) can't produce a
  // false match/miss.
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

  // Extract every top-level rule as {selector, body} so each property can
  // be checked against the specific selector that declares it, not just
  // "appears somewhere in the file".
  const rules: { selector: string; body: string }[] = [];
  const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = ruleRegex.exec(withoutComments)) !== null) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }

  function selectorsDeclaring(prop: string): string[] {
    return rules.filter((r) => new RegExp(`(^|[^-])${prop}:`).test(r.body)).map((r) => r.selector);
  }

  const tokens = ['--font-fa', '--font-display', '--font-body', '--font-mono', '--font-current'];

  it.each(tokens)('%s is declared only on selectors resolving to <body> (never bare :root/html)', (token) => {
    const selectors = selectorsDeclaring(token);
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector).not.toBe(':root');
      expect(selector).not.toBe('html');
      // Every selector must resolve to <body> itself: either exactly
      // "body", or a combinator selector ending in "body" (e.g.
      // "html[lang='en'] body").
      expect(selector === 'body' || /\bbody$/.test(selector)).toBe(true);
    }
  });

  it('the html[lang="en"] override targets body specifically, not html', () => {
    const selectors = selectorsDeclaring('--font-current');
    const langOverride = selectors.find((s) => s.includes("lang="));
    expect(langOverride).toBeDefined();
    expect(langOverride).toMatch(/\bbody$/);
  });
});
