// Readable source of the "Save to HoneyComb Drive" bookmark (v2). README.md explains how to turn it
// into a bookmark; bookmark-link.txt is this code in one line. Replace WEB_APP_URL with your Apps
// Script web app URL (it ends in /exec).
//
// On a MakerWorld model page it collects: title, designer, licence, description, the designer's
// photos, photos from the comments / community prints you have scrolled into view, and the print
// profile figures (filament grams, print time). Then it opens the web app with that data.
(() => {
  const WEB_APP_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
  if (!/(^|\.)makerworld\.com$/.test(location.hostname)) { alert('Open a MakerWorld model page first.'); return; }

  const meta = (n) => document.querySelector(`meta[property="${n}"],meta[name="${n}"]`)?.content || '';
  const text = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim();
  const full = (u) => { try { const x = new URL(u, location.href); x.searchParams.delete('x-oss-process'); return x.href; } catch { return ''; } };
  const isPhoto = (u) => /^https:\/\/.+\.(jpe?g|png|webp|avif)(\?|$)/i.test(u);
  const num = (v) => (typeof v === 'number' ? v : typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? Number(v) : NaN);
  const COMMUNITY_KEY = /comment|make|rating|review|reply|boost/i;
  const SKIP_KEY = /avatar|head(img|url)?$|icon|badge|logo|user/i;

  const d = { v: 2, url: location.href.split('#')[0], title: '', designer: '', license: '', description: '',
    designerImages: [], community: [], profiles: [] };

  // 1) The page's own data (Next.js), if present.
  let nd = null;
  try { nd = JSON.parse(document.getElementById('__NEXT_DATA__')?.textContent || 'null'); } catch (e) { nd = null; }
  let design = null;
  const findDesign = (o, depth) => {
    if (!o || typeof o !== 'object' || design || depth > 9) return;
    if (typeof o.title === 'string' && (o.coverUrl || o.designCreator || o.designExtension)) { design = o; return; }
    Object.values(o).forEach((v) => findDesign(v, depth + 1));
  };
  findDesign(nd, 0);

  // Photo strings under an object, skipping avatars/icons and (optionally) community subtrees.
  const photosIn = (o, skipCommunity, depth = 0, out = []) => {
    if (!o || depth > 9) return out;
    if (typeof o === 'string') { if (isPhoto(o)) out.push(o); return out; }
    if (typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (SKIP_KEY.test(k)) continue;
        if (skipCommunity && COMMUNITY_KEY.test(k)) continue;
        photosIn(v, skipCommunity, depth + 1, out);
      }
    }
    return out;
  };

  if (design) {
    d.title = design.title || '';
    d.designer = design.designCreator?.name || design.creator?.name || '';
    d.license = String(design.license || design.licenseType || '');
    d.description = String(design.summary || design.description || '').replace(/<[^>]+>/g, ' ');
    d.designerImages = photosIn(design, true);
    // Print profiles: any object carrying a filament weight.
    const seen = new Set();
    const findProfiles = (o, depth) => {
      if (!o || typeof o !== 'object' || depth > 9) return;
      const w = num(o.weight ?? o.filamentWeight ?? o.totalWeight ?? o.weightG);
      if (w > 0) {
        const t = num(o.prediction ?? o.printTime ?? o.costTime ?? o.time ?? o.duration);
        const name = String(o.title || o.name || o.profileName || '').slice(0, 80);
        const key = `${name}|${w}|${t}`;
        if (!seen.has(key)) { seen.add(key); d.profiles.push({ name, weightG: w, timeRaw: Number.isFinite(t) ? t : null }); }
      }
      Object.values(o).forEach((v) => findProfiles(v, depth + 1));
    };
    findProfiles(design, 0);
  }
  if (nd) {
    // Community photos the page data already carries (comments, makes, ratings).
    // The poster's name sits on the comment, often above the list of its photos, so it is passed down.
    const findCommunity = (o, depth, inCommunity, author) => {
      if (!o || typeof o !== 'object' || depth > 10) return;
      const by = String(o.userName || o.nickname || o.creator?.name || o.user?.name || author || '');
      for (const [k, v] of Object.entries(o)) {
        if (SKIP_KEY.test(k)) continue;
        const here = inCommunity || COMMUNITY_KEY.test(k);
        if (typeof v === 'string' && here && isPhoto(v)) d.community.push({ src: v, author: by });
        else findCommunity(v, depth + 1, here, by);
      }
    };
    findCommunity(nd, 0, false, '');
  }

  // 2) What is visible on the page (fills gaps, and catches comments loaded after the page opened).
  if (!d.title) d.title = meta('og:title') || document.title;
  if (!d.description) d.description = meta('og:description') || meta('description');
  if (!d.designer) d.designer = text(document.querySelector('a[href*="/@"]'));
  if (!d.license) {
    const el = [...document.querySelectorAll('a,span,div,p')].find((e) => e.children.length === 0 && /licen[cs]e/i.test(e.textContent) && e.textContent.length < 120);
    d.license = text(el);
  }
  const communityBox = '[class*="comment" i],[class*="make" i],[class*="rating" i],[class*="review" i],[id*="comment" i]';
  for (const img of document.images) {
    const src = img.currentSrc || img.src;
    if (!isPhoto(full(src))) continue;
    const box = img.closest(communityBox);
    if (box) {
      if (img.naturalWidth >= 150) d.community.push({ src, author: text(box.querySelector('a[href*="/@"]')) });
    } else if (img.naturalWidth >= 400) {
      d.designerImages.push(src);
    }
  }
  d.designerImages.push(meta('og:image'));
  if (!d.profiles.length) {
    // Text like "2h 15m  ·  34.6 g" in the print profile list.
    document.body.innerText.split('\n').forEach((line) => {
      const g = line.match(/(\d+(?:\.\d+)?)\s?g\b/);
      const h = line.match(/(\d+(?:\.\d+)?)\s?h/i);
      const m = line.match(/(\d+)\s?m(in)?\b/i);
      if (g && (h || m) && line.length < 160) {
        d.profiles.push({ name: line.trim().slice(0, 80), weightG: Number(g[1]), timeRaw: null,
          hours: (h ? Number(h[1]) : 0) + (m ? Number(m[1]) / 60 : 0) });
      }
    });
  }

  // Tidy: full-size links, no duplicates, nothing in both lists.
  const designer = [...new Set(d.designerImages.map(full).filter(isPhoto))];
  const seenC = new Set(designer);
  d.community = d.community.map((c) => ({ src: full(c.src), author: c.author.slice(0, 60) }))
    .filter((c) => isPhoto(c.src) && !seenC.has(c.src) && seenC.add(c.src));
  d.designerImages = designer.slice(0, 40);
  d.community = d.community.slice(0, 60);
  d.profiles = d.profiles.slice(0, 12);
  d.description = d.description.replace(/\s+/g, ' ').trim().slice(0, 1500);

  if (!d.designerImages.length && !d.community.length) { alert('No photos found. Scroll through the photos and the comments once, then try again.'); return; }
  window.open(`${WEB_APP_URL}#${encodeURIComponent(JSON.stringify(d))}`, '_blank');
})();
