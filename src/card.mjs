// Product card markup, shared by the static build and the browser (recently viewed).
import {escapeHtml as e, money} from './domain.mjs';

export const price = p => p.priceLkr === null ? 'Price on enquiry' : money(p.priceLkr);
export const CARD_MAX_WIDTH = 960;
export const CARD_SIZES = '(max-width: 700px) calc((100vw - 52px) / 2), (max-width: 1000px) calc((100vw - 124px) / 3), (max-width: 1280px) calc((100vw - 146px) / 4), 284px';
// AVIF first inside <picture> when every variant has an AVIF twin; the WebP <img> stays the fallback.
export function avifSource(variants, sizes, media='') {
  if (!variants?.length || !variants.every(v=>v.avif)) return '';
  return '<source type="image/avif"'+(media?' media="'+e(media)+'"':'')+' srcset="'+e(variants.map(v=>v.avif+' '+v.width+'w').join(', '))+'" sizes="'+e(sizes)+'">';
}
export const withPicture = (source, img) => source ? '<picture>'+source+img+'</picture>' : img;
export function picture(p, {sizes=CARD_SIZES, loading='lazy', priority=false, maxWidth=Infinity}={}) {
  if (!p.image) return '';
  // Cards cap their candidates (a card slot is at most 284 CSS px, 852 px at DPR 3); larger frames keep everything.
  p={...p,imageVariants:(p.imageVariants||[]).filter(v=>v.width<=maxWidth)};
  const responsive=p.imageVariants?.length ?
    ' srcset="'+e(p.imageVariants.map(v=>v.src+' '+v.width+'w').join(', '))+'" sizes="'+e(sizes)+'"' : '';
  return withPicture(avifSource(p.imageVariants,sizes),'<img src="'+e(p.image)+'"'+responsive+' alt="'+e(p.imageAlt)+'" width="'+(p.imageWidth||640)+'" height="'+(p.imageHeight||640)+'" loading="'+loading+'"'+(priority?' fetchpriority="high"':'')+'>');
}
// Second gallery photo for the hover cross-fade; the browser builds the <img> lazily (aria-hidden, so its alt never reaches assistive tech).
function altPhoto(p) {
  const g=p.gallery?.[0];if(!g?.variants?.length)return '';
  return ' data-alt-srcset="'+e(g.variants.map(v=>v.src+' '+v.width+'w').join(', '))+'" data-alt-src="'+e(g.src)+'" data-alt-text="'+e(g.alt||'')+'"';
}
export function card(p, {headingLevel=3, loading='lazy'}={}) {
  const heading=headingLevel===2?'h2':'h3';
  // One link per card; its ::after stretches over the whole card so the photo is clickable too.
  return '<article class="product-card" data-product-card data-testid="product-card" data-category="' + e(p.category) + '" data-search="' + e([p.name,p.category,...p.tags].join(' ').toLowerCase()) + '" data-tags="' + e(p.tags.join('|')) + '" data-name="' + e(p.name) + '" data-price="' + (p.priceLkr===null?'':p.priceLkr) + '">' +
    '<div class="product-image"' + altPhoto(p) + '>' + picture(p,{loading,maxWidth:CARD_MAX_WIDTH}) + '</div>' +
    '<div class="card-copy"><p class="eyebrow">' + e(p.category) + '</p><'+heading+'><a class="card-link" href="/products/' + e(p.slug) + '/">' + e(p.name) + '</a></'+heading+'><p class="price" data-testid="product-price">' + e(price(p)) + '</p><div class="card-foot"><p class="card-status">' + availability(p) + '</p>' +
    (p.availability==='unavailable'?'':'<button type="button" class="quick-add" data-quick-add="' + e(p.id) + '" data-testid="quick-add" aria-label="Add ' + e(p.name) + ' to request cart" hidden><span aria-hidden="true">+</span> Add</button>') + '</div></div></article>';
}
export function availability(p) {
  return ({unconfirmed:'Availability to confirm',available:'Available',unavailable:'Currently unavailable','made-to-order':'Made to order'})[p.availability];
}
