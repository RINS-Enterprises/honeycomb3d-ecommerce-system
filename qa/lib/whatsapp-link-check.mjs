// QA helper: parse and validate a WhatsApp order-handoff URL produced by the storefront.
// Dependency-free so it runs on plain Node >= 18 without touching app manifests.

const WA_HOSTS = new Set(['wa.me', 'api.whatsapp.com', 'web.whatsapp.com']);

/**
 * Parse a WhatsApp click-to-chat URL.
 * Supports https://wa.me/<digits>?text=..., https://api.whatsapp.com/send?phone=..&text=..,
 * and whatsapp://send?phone=..&text=..
 * @returns {{ok: boolean, host: string|null, number: string|null, text: string|null, errors: string[]}}
 */
export function parseWhatsAppUrl(href) {
  const out = { ok: false, host: null, number: null, text: null, errors: [] };
  let url;
  try {
    url = new URL(href);
  } catch {
    out.errors.push(`not a valid URL: ${String(href).slice(0, 120)}`);
    return out;
  }
  out.host = url.protocol === 'whatsapp:' ? 'whatsapp:' : url.hostname.replace(/^www\./, '');
  if (url.protocol === 'whatsapp:') {
    out.number = url.searchParams.get('phone');
  } else if (!WA_HOSTS.has(out.host)) {
    out.errors.push(`unexpected host "${url.hostname}" (expected wa.me or api.whatsapp.com)`);
    return out;
  } else if (url.protocol !== 'https:') {
    out.errors.push(`insecure protocol ${url.protocol}`);
  }
  if (out.host === 'wa.me') {
    out.number = url.pathname.replace(/^\/+|\/+$/g, '') || null;
  } else if (out.host !== 'whatsapp:') {
    out.number = url.searchParams.get('phone');
  }
  // URLSearchParams decodes percent-encoding and "+" as space.
  out.text = url.searchParams.get('text');
  if (!out.number) out.errors.push('no destination phone number');
  else if (!/^[1-9]\d{7,14}$/.test(out.number)) {
    out.errors.push(`phone "${out.number}" is not international digits-only (wa.me needs e.g. 94XXXXXXXXX, no +, spaces or leading 0)`);
  }
  if (!out.text) out.errors.push('no prefilled text parameter');
  out.ok = out.errors.length === 0;
  return out;
}

/** Build a regex that matches an amount written as 1200, 1,200, 1200.00 or 1,200.00. */
export function amountPattern(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error(`bad amount ${amount}`);
  const [intPart, frac = ''] = n.toFixed(2).split('.');
  // "1,200" -> "1,?200" so both grouped and ungrouped spellings match.
  const intRe = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/,/g, ',?');
  const fracRe = frac === '00' ? '(?:\\.00)?' : `\\.${frac}`;
  return new RegExp(`(?<![\\d.,])${intRe}${fracRe}(?!\\d|[.,]\\d)`);
}

/**
 * Validate a handoff URL against the cart the tester built.
 * @param {string} href
 * @param {{expectedNumber?: string, items?: {name: string, qty: number, unitPrice?: number}[], total?: number, maxTextLength?: number}} cart
 * @returns {{ok: boolean, parsed: object, issues: {severity: 'high'|'medium'|'low', message: string}[]}}
 */
export function validateHandoff(href, cart = {}) {
  const parsed = parseWhatsAppUrl(href);
  const issues = parsed.errors.map((message) => ({ severity: 'high', message }));
  const text = parsed.text || '';

  if (cart.expectedNumber && parsed.number && parsed.number !== cart.expectedNumber) {
    issues.push({ severity: 'high', message: `sends to ${parsed.number}, expected ${cart.expectedNumber}` });
  }
  if (/%[0-9A-Fa-f]{2}/.test(text)) {
    issues.push({ severity: 'medium', message: 'decoded text still contains %XX sequences (double-encoded?)' });
  }
  if (/\b(undefined|null|NaN|\[object Object\])\b/.test(text)) {
    issues.push({ severity: 'high', message: 'message contains undefined/null/NaN/[object Object]' });
  }
  const lines = text.split(/\r?\n/);
  for (const item of cart.items || []) {
    const nameLines = lines.filter((l) => l.toLowerCase().includes(item.name.toLowerCase()));
    if (nameLines.length === 0) {
      issues.push({ severity: 'high', message: `item "${item.name}" missing from message` });
      continue;
    }
    if (item.qty != null) {
      const qtyRe = new RegExp(`(?:\\b(?:qty|quantity)\\s*[:x×]?\\s*${item.qty}\\b|\\b${item.qty}\\s*[x×]|[x×]\\s*${item.qty}\\b)`, 'i');
      const ctx = lines.slice(lines.indexOf(nameLines[0]), lines.indexOf(nameLines[0]) + 3).join('\n');
      if (!qtyRe.test(ctx)) {
        issues.push({ severity: 'high', message: `quantity ${item.qty} for "${item.name}" not found near the item line` });
      }
    }
  }
  if (cart.total != null && !amountPattern(cart.total).test(text)) {
    issues.push({ severity: 'high', message: `cart total ${cart.total} not present in message` });
  }
  const max = cart.maxTextLength ?? 1500;
  if (text.length > max) {
    issues.push({ severity: 'low', message: `message is ${text.length} chars; long prefilled texts can be truncated by some clients` });
  }
  return { ok: !issues.some((i) => i.severity === 'high'), parsed, issues };
}
