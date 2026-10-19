/**
 * HoneyComb 3D: MakerWorld → Google Drive, with pricing and AI images. Team version (v3).
 *
 * Two ways in:
 *   - Computer: the "Save to HoneyComb Drive" bookmark reads the open MakerWorld page in your own
 *     browser and opens this web app with what it found (bookmarklet.js).
 *   - Phone or tablet: open this web app, paste a MakerWorld model link and press "Get model".
 *     Google's server reads the page. If MakerWorld blocks that, add photos saved on the device and
 *     type grams and hours by hand.
 * You check everything, adjust the price and press Save. The script then:
 *   1. creates  <shared folder> / <title> (<model id>) - <date> /
 *        Designer photos/  Community prints/  Own photos/ (photos added from a device)  AI edited/
 *   2. downloads the photos you kept, recording each one's source link and author,
 *   3. writes model.json (details, print data, price breakdown, who saved it),
 *   4. adds a row to the "MakerWorld imports log" sheet in the shared folder.
 * Anyone on the team can then make AI versions of chosen photos with Gemini ("Nano Banana"), right
 * after saving or later from "Recent imports".
 *
 * The web app runs as the person using it (appsscript.json): everyone signs in with their own Google
 * account and needs Editor access to the shared folder. The owner runs setup() once (README.md).
 */

// The shared folder everything is saved in. '' makes setup() create "My Drive / MakerWorld imports" instead.
const SHARED_FOLDER_ID = '1qGplQuyLmQIW_yI9TRlxS68jwYdYSqtI'; // HoneyComb / MakerWorld imports
const ROOT_FOLDER_NAME = 'MakerWorld imports';
const LOG_SHEET_NAME = 'MakerWorld imports log';
const MAX_PHOTOS = 80;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;
const MAX_AI_PER_RUN = 6; // Apps Script stops a run after 6 minutes
const KINDS = { designer: 'Designer photos', community: 'Community prints', own: 'Own photos' };
const KIND_LABEL = { designer: 'Designer photo', community: 'Community print', own: 'Own photo' };
const LOG_HEADER = ['Saved at', 'Saved by', 'Title', 'Designer', 'Licence (as shown)', 'Licence bought / allows selling',
  'Model page', 'Drive folder', 'Designer photos', 'Community photos', 'Own photos', 'Filament (g)', 'Print time (h)',
  'Suggested price (LKR)', 'Your price (LKR)', 'Notes', 'Status'];

// Example values only. The owner sets real ones in the web app's "Pricing settings" panel.
const DEFAULT_PRICING = {
  filamentCostPerKg: 7000, // LKR per kg of filament
  wastePercent: 10,        // purge, supports, failed prints
  machineCostPerHour: 50,  // electricity + wear, LKR per print hour
  labourPerItem: 150,      // post-processing, assembly, LKR
  packagingPerItem: 50,    // LKR
  markupPercent: 100,      // on top of cost
  roundTo: 50,             // round the suggested price up to this step
};
const DEFAULT_AI_PROMPT = 'Place this 3D-printed object on a clean, softly lit studio background with a subtle shadow. ' +
  'Keep the object exactly as it is: same shape, proportions, colours, layer lines and details. Do not add text, logos or other objects.';
const BLOCKED_MSG = 'MakerWorld did not let Google\'s server read this page. On a computer, use the bookmark instead. ' +
  'On a phone or tablet, press "Fill in by hand": add photos you saved from MakerWorld and type the grams and hours.';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page')
    .setTitle('MakerWorld to Drive')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ---------- setup and access ----------

/** Run once from the Apps Script editor, signed in as the owner. Safe to run again. */
function setup() {
  const props = PropertiesService.getScriptProperties();
  const root = SHARED_FOLDER_ID ? DriveApp.getFolderById(SHARED_FOLDER_ID) : folderByName_(DriveApp.getRootFolder(), ROOT_FOLDER_NAME);
  const log = logSheet_(root);
  props.setProperties({ ROOT_FOLDER_ID: root.getId(), LOG_SHEET_ID: log.getId(), OWNER_EMAIL: Session.getEffectiveUser().getEmail() });
  Logger.log(`Shared folder: ${root.getUrl()}\nLog sheet: ${log.getUrl()}\nNext: share the folder with your team as Editor, then deploy.`);
  return { folderUrl: root.getUrl(), logUrl: log.getUrl() };
}

function me_() {
  return Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail() || '';
}

function owner_() {
  return PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || '';
}

function root_() {
  const id = PropertiesService.getScriptProperties().getProperty('ROOT_FOLDER_ID');
  if (!id) throw new Error('The tool is not set up yet. The owner needs to run setup once (README.md, owner setup step 3).');
  try {
    return DriveApp.getFolderById(id);
  } catch (e) {
    throw new Error(`You don't have access to the shared "${ROOT_FOLDER_NAME}" folder. Ask ${owner_() || 'the owner'} to share it with ${me_() || 'you'} as Editor.`);
  }
}

/** A model folder inside the shared folder. */
function importFolder_(folderId) {
  const root = root_();
  const folder = DriveApp.getFolderById(String(folderId));
  const parents = folder.getParents();
  while (parents.hasNext()) if (parents.next().getId() === root.getId()) return folder;
  throw new Error('That folder is not a MakerWorld import.');
}

function canEditPricing_() {
  const owner = owner_().toLowerCase();
  if (!owner) return true;
  const me = me_().toLowerCase();
  const editors = String(PropertiesService.getScriptProperties().getProperty('PRICING_EDITORS') || '')
    .toLowerCase().split(/[\s,;]+/).filter(Boolean);
  return me === owner || editors.indexOf(me) >= 0;
}

// ---------- settings ----------

function getSettings() {
  const props = PropertiesService.getScriptProperties();
  let pricing = DEFAULT_PRICING;
  try { pricing = Object.assign({}, DEFAULT_PRICING, JSON.parse(props.getProperty('PRICING') || '{}')); } catch (e) {}
  let folderUrl = '';
  let folderError = '';
  try { folderUrl = root_().getUrl(); } catch (e) { folderError = e.message; }
  return {
    pricing,
    pricingIsExample: !props.getProperty('PRICING'),
    canEditPricing: canEditPricing_(),
    aiReady: !!props.getProperty('GEMINI_API_KEY'),
    aiModel: props.getProperty('GEMINI_MODEL') || 'gemini-2.5-flash-image',
    aiPrompt: props.getProperty('AI_PROMPT') || DEFAULT_AI_PROMPT,
    user: me_(),
    owner: owner_(),
    folderUrl,
    folderError,
  };
}

function savePricing(p) {
  if (!canEditPricing_()) throw new Error(`Only ${owner_()} can change the shared pricing settings.`);
  const clean = {};
  Object.keys(DEFAULT_PRICING).forEach((k) => {
    const v = Number(p && p[k]);
    if (!Number.isFinite(v) || v < 0) throw new Error(`Pricing value "${k}" must be a number of 0 or more.`);
    clean[k] = v;
  });
  if (clean.roundTo < 1) clean.roundTo = 1;
  PropertiesService.getScriptProperties().setProperty('PRICING', JSON.stringify(clean));
  return clean;
}

/** Same formula as Page.html shows live. Returns the breakdown in LKR. */
function priceFor(grams, hours, p) {
  const material = grams * (1 + p.wastePercent / 100) * p.filamentCostPerKg / 1000;
  const machine = hours * p.machineCostPerHour;
  const cost = material + machine + p.labourPerItem + p.packagingPerItem;
  const suggested = Math.ceil((cost * (1 + p.markupPercent / 100)) / p.roundTo) * p.roundTo;
  return { material: Math.round(material), machine: Math.round(machine), labour: p.labourPerItem,
    packaging: p.packagingPerItem, cost: Math.round(cost), suggested };
}

// ---------- read a model page from a pasted link ----------

/** The MakerWorld link inside pasted text ("Check out … https://makerworld.com/en/models/123-x"), or an error. */
function modelUrl_(text) {
  const s = String(text || '').trim();
  const m = s.match(/(?:https?:\/\/)?(?:[\w-]+\.)*makerworld\.com(?:\.cn)?\/[^\s"'<>]*/i);
  if (!m) throw new Error('Paste a link to a model on makerworld.com.');
  return m[0].replace(/^(?:https?:\/\/)?/i, 'https://').split('#')[0];
}

function isModelUrl_(u) {
  return /^https:\/\/(?:[\w-]+\.)*makerworld\.com(?:\.cn)?\//i.test(String(u || ''));
}

/** Called from Page.html with a pasted link. Returns the same shape the bookmark sends. */
function fetchModel(text) {
  const url = modelUrl_(text);
  let res;
  try {
    res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true, headers: { 'Accept-Language': 'en' } });
  } catch (e) {
    throw new Error(`${BLOCKED_MSG} (${e.message})`);
  }
  const code = res.getResponseCode();
  const html = res.getContentText();
  if (code !== 200 || /challenge-platform|cf-chl|<title>Just a moment/i.test(html)) throw new Error(`${BLOCKED_MSG} (HTTP ${code})`);
  const d = parseModelHtml_(html, url);
  if (!d.designerImages.length && !d.community.length) throw new Error(`No photos found on that page. ${BLOCKED_MSG}`);
  return d;
}

/** Page HTML → { url, title, designer, license, description, designerImages[], community[], profiles[] }. */
function parseModelHtml_(html, url) {
  const d = { v: 3, via: 'link', url, title: '', designer: '', license: '', description: '',
    designerImages: [], community: [], profiles: [] };
  const nextData = html.match(/<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  let nd = null;
  if (nextData) { try { nd = JSON.parse(nextData[1]); } catch (e) { nd = null; } }
  if (nd) parseNextData_(nd, d);

  const meta = (n) => {
    const tag = (html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${n}["'][^>]*>`, 'i')) || [])[0] || '';
    return entities_((tag.match(/content=["']([^"']*)["']/i) || [])[1] || '');
  };
  if (!d.title) d.title = meta('og:title') || entities_((html.match(/<title[^>]*>([^<]*)/i) || [])[1] || '').replace(/\s*[|-]\s*MakerWorld.*$/i, '');
  if (!d.description) d.description = meta('og:description') || meta('description');

  // No usable page data (or a newer page format): collect photo links and print figures from the raw page.
  const text = html.replace(/\\u002[fF]/g, '/').replace(/\\\//g, '/').replace(/\\"/g, '"').replace(/&amp;/g, '&');
  if (!d.designerImages.length) {
    (text.match(/https:\/\/[^\s"'<>\\)]+?\.(?:jpe?g|png|webp|avif)(?:\?[^\s"'<>\\)]*)?/gi) || [])
      .filter((u) => !/avatar|icon|logo|badge|emoji|favicon|banner/i.test(u))
      .forEach((u) => d.designerImages.push(u));
  }
  d.designerImages.push(meta('og:image'));
  if (!d.profiles.length) {
    const seen = {};
    const weightRe = /"(?:weight|filamentWeight|totalWeight)"\s*:\s*"?(\d+(?:\.\d+)?)/g;
    let w;
    while ((w = weightRe.exec(text)) && d.profiles.length < 12) {
      const near = text.slice(Math.max(0, w.index - 600), w.index + 600);
      const t = near.match(/"(?:prediction|printTime|costTime)"\s*:\s*"?(\d+)/);
      const name = (near.match(/"(?:title|name|profileName)"\s*:\s*"([^"]{1,80})"/) || [])[1] || '';
      const key = `${name}|${w[1]}|${t ? t[1] : ''}`;
      if (Number(w[1]) > 0 && !seen[key]) { seen[key] = 1; d.profiles.push({ name, weightG: Number(w[1]), timeRaw: t ? Number(t[1]) : null }); }
    }
  }
  return tidy_(d);
}

/** Same reading of Next.js page data as bookmarklet.js. */
function parseNextData_(nd, d) {
  const COMMUNITY_KEY = /comment|make|rating|review|reply|boost/i;
  const SKIP_KEY = /avatar|head(img|url)?$|icon|badge|logo|user/i;
  const num = (v) => (typeof v === 'number' ? v : typeof v === 'string' && /^\d+(\.\d+)?$/.test(v) ? Number(v) : NaN);
  let design = null;
  const findDesign = (o, depth) => {
    if (!o || typeof o !== 'object' || design || depth > 9) return;
    if (typeof o.title === 'string' && (o.coverUrl || o.designCreator || o.designExtension)) { design = o; return; }
    Object.keys(o).forEach((k) => findDesign(o[k], depth + 1));
  };
  const photosIn = (o, depth, out) => {
    if (!o || depth > 9) return out;
    if (typeof o === 'string') { if (isPhoto_(o)) out.push(o); return out; }
    if (typeof o === 'object') {
      Object.keys(o).forEach((k) => { if (!SKIP_KEY.test(k) && !COMMUNITY_KEY.test(k)) photosIn(o[k], depth + 1, out); });
    }
    return out;
  };
  findDesign(nd, 0);
  if (design) {
    d.title = design.title || '';
    d.designer = (design.designCreator && design.designCreator.name) || (design.creator && design.creator.name) || '';
    d.license = String(design.license || design.licenseType || '');
    d.description = String(design.summary || design.description || '').replace(/<[^>]+>/g, ' ');
    d.designerImages = photosIn(design, 0, []);
    const seen = {};
    const findProfiles = (o, depth) => {
      if (!o || typeof o !== 'object' || depth > 9) return;
      const w = num(o.weight != null ? o.weight : o.filamentWeight != null ? o.filamentWeight : o.totalWeight != null ? o.totalWeight : o.weightG);
      if (w > 0) {
        const t = num(o.prediction != null ? o.prediction : o.printTime != null ? o.printTime : o.costTime != null ? o.costTime : o.time != null ? o.time : o.duration);
        const name = String(o.title || o.name || o.profileName || '').slice(0, 80);
        const key = `${name}|${w}|${t}`;
        if (!seen[key]) { seen[key] = 1; d.profiles.push({ name, weightG: w, timeRaw: Number.isFinite(t) ? t : null }); }
      }
      Object.keys(o).forEach((k) => findProfiles(o[k], depth + 1));
    };
    findProfiles(design, 0);
  }
  // The poster's name sits on the comment, often above the list of its photos, so it is passed down.
  const findCommunity = (o, depth, inCommunity, author) => {
    if (!o || typeof o !== 'object' || depth > 10) return;
    const by = String(o.userName || o.nickname || (o.creator && o.creator.name) || (o.user && o.user.name) || author || '');
    Object.keys(o).forEach((k) => {
      if (SKIP_KEY.test(k)) return;
      const v = o[k];
      const here = inCommunity || COMMUNITY_KEY.test(k);
      if (typeof v === 'string' && here && isPhoto_(v)) d.community.push({ src: v, author: by });
      else findCommunity(v, depth + 1, here, by);
    });
  };
  findCommunity(nd, 0, false, '');
}

/** Full-size links, no duplicates, nothing in both lists, same limits as the bookmark. */
function tidy_(d) {
  const designer = [];
  const seen = {};
  d.designerImages.map(fullSize_).filter(isPhoto_).forEach((u) => { if (!seen[u]) { seen[u] = 1; designer.push(u); } });
  d.community = d.community.map((c) => ({ src: fullSize_(c.src), author: String(c.author || '').slice(0, 60) }))
    .filter((c) => isPhoto_(c.src) && !seen[c.src] && (seen[c.src] = 1));
  d.designerImages = designer.slice(0, 40);
  d.community = d.community.slice(0, 60);
  d.profiles = d.profiles.slice(0, 12);
  ['title', 'designer', 'license'].forEach((k) => { d[k] = clean(d[k], 200); });
  d.description = clean(d.description, 1500);
  return d;
}

function isPhoto_(u) {
  return /^https:\/\/.+\.(jpe?g|png|webp|avif)(\?|$)/i.test(String(u || ''));
}

function fullSize_(u) {
  return String(u || '').replace(/&amp;/g, '&').replace(/([?&])x-oss-process=[^&#]*&?/, '$1').replace(/[?&]$/, '');
}

function entities_(s) {
  return String(s).replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

// ---------- save ----------

/** Called from Page.html. Returns { folderId, folderUrl, saved, failed[], files[] }. Device photos follow via addPhoto(). */
function saveImport(data) {
  if (!data || typeof data !== 'object') throw new Error('No model data received.');
  const url = String(data.url || '');
  if (!isModelUrl_(url)) throw new Error('Only makerworld.com model pages are supported.');
  const photos = (Array.isArray(data.photos) ? data.photos : [])
    .filter((x) => x && /^https:\/\//.test(String(x.src)))
    .slice(0, MAX_PHOTOS);
  if (!photos.length && !(Number(data.deviceCount) > 0)) throw new Error('No photos selected.');

  const root = root_();
  const title = clean(data.title, 120) || 'Untitled model';
  const modelId = (url.match(/models\/(\d+)/) || [])[1] || '';
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HHmm');
  let folder;
  try {
    folder = root.createFolder(`${title}${modelId ? ` (${modelId})` : ''} - ${stamp}`);
  } catch (e) {
    throw new Error(`You can open the shared folder but not add to it. Ask ${owner_() || 'the owner'} to make ${me_() || 'you'} an Editor.`);
  }

  const saved = [];
  const failed = [];
  const counter = {};
  photos.forEach((p) => {
    const kind = p.kind === 'community' ? 'community' : 'designer';
    try {
      const res = UrlFetchApp.fetch(String(p.src), { muteHttpExceptions: true, followRedirects: true });
      const code = res.getResponseCode();
      if (code !== 200) { failed.push(`${p.src} (HTTP ${code})`); return; }
      const blob = res.getBlob();
      const type = (blob.getContentType() || '').toLowerCase();
      if (type.indexOf('image/') !== 0) { failed.push(`${p.src} (not an image: ${type || 'unknown'})`); return; }
      const bytes = blob.getBytes().length;
      if (bytes > MAX_IMAGE_BYTES) { failed.push(`${p.src} (too large)`); return; }
      counter[kind] = (counter[kind] || 0) + 1;
      const author = clean(p.author, 60);
      blob.setName(`${String(counter[kind]).padStart(2, '0')}-${slug_(title)}${author ? `-by-${slug_(author)}` : ''}.${extFor_(type)}`);
      const file = folderByName_(folder, KINDS[kind]).createFile(blob);
      file.setDescription(`${KIND_LABEL[kind]}${author ? ` by ${author}` : ''}\nDownloaded from: ${p.src}\nModel page: ${url}\nSaved: ${stamp} by ${me_()}`);
      saved.push({ kind, name: file.getName(), driveId: file.getId(), source: String(p.src), author, bytes });
    } catch (e) {
      failed.push(`${p.src} (${e.message})`);
    }
  });

  const grams = Number(data.filamentGrams) || 0;
  const hours = Number(data.printHours) || 0;
  const pricing = getSettings().pricing;
  const breakdown = priceFor(grams, hours, pricing);
  const yourPrice = Number(data.yourPrice) || breakdown.suggested;

  const meta = {
    modelUrl: url,
    modelId,
    title,
    designer: clean(data.designer, 120),
    licenceAsShown: clean(data.license, 300),
    licenceBoughtOrAllowsSelling: data.licencePurchased === true,
    description: clean(data.description, 5000),
    notes: clean(data.notes, 1000),
    print: { filamentGrams: grams, printHours: hours, profileChosen: clean(data.profileName, 120), profilesSeen: data.profiles || [] },
    price: { pricingUsed: pricing, breakdown, yourPriceLkr: yourPrice },
    savedAt: new Date().toISOString(),
    savedBy: me_(),
    readVia: data.via === 'link' ? 'pasted link' : data.via === 'manual' ? 'typed by hand' : 'bookmark',
    photos: saved,
    failed,
  };
  folder.createFile('model.json', JSON.stringify(meta, null, 2), 'application/json');
  withLock_(() => logSheet_(root).getSheets()[0].appendRow(logValues_(meta, folder)));
  return { folderId: folder.getId(), folderUrl: folder.getUrl(), saved: saved.length, failed,
    files: saved.map((s) => ({ id: s.driveId, name: s.name, kind: s.kind, source: s.source })) };
}

/** Adds one photo from the user's device to a saved import. Page.html sends them one at a time. */
function addPhoto(folderId, kind, fileName, mime, base64) {
  const folder = importFolder_(folderId);
  if (!KINDS[kind]) kind = 'own';
  const type = String(mime || '').toLowerCase();
  if (type.indexOf('image/') !== 0) throw new Error(`${fileName}: only image files can be added.`);
  const bytes = Utilities.base64Decode(String(base64 || ''));
  if (!bytes.length) throw new Error(`${fileName}: the file is empty.`);
  if (bytes.length > MAX_UPLOAD_BYTES) throw new Error(`${fileName}: larger than 20 MB.`);

  const original = clean(fileName, 120);
  return withLock_(() => {
    const sub = folderByName_(folder, KINDS[kind]);
    let n = 1;
    for (const it = sub.getFiles(); it.hasNext(); it.next()) n += 1;
    const metaFiles = folder.getFilesByName('model.json');
    const metaFile = metaFiles.hasNext() ? metaFiles.next() : null;
    const meta = metaFile ? JSON.parse(metaFile.getBlob().getDataAsString()) : { title: folder.getName(), photos: [] };
    const name = `${String(n).padStart(2, '0')}-${slug_(meta.title || folder.getName())}-${kind === 'own' ? 'own' : 'device'}.${extFor_(type, original)}`;
    const file = sub.createFile(Utilities.newBlob(bytes, type, name));
    const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HHmm');
    file.setDescription(`${KIND_LABEL[kind]}, added from a device by ${me_()}\nOriginal file name: ${original}\nSaved: ${stamp}`);

    meta.photos = meta.photos || [];
    meta.photos.push({ kind, name, driveId: file.getId(), source: `added from a device: ${original}`, author: '', bytes: bytes.length, addedBy: me_() });
    if (metaFile) metaFile.setContent(JSON.stringify(meta, null, 2));
    else folder.createFile('model.json', JSON.stringify(meta, null, 2), 'application/json');
    const sheet = logSheet_(root_()).getSheets()[0];
    const cell = sheet.createTextFinder(folder.getUrl()).matchEntireCell(true).findNext();
    if (cell) {
      const range = sheet.getRange(cell.getRow(), 1, 1, LOG_HEADER.length);
      range.setValues([logValues_(meta, folder, range.getValues()[0])]);
    }
    return { id: file.getId(), name, kind };
  });
}

// ---------- recent imports (for AI later) ----------

/** The 20 newest rows of the log. */
function recentImports() {
  const sheet = logSheet_(root_()).getSheets()[0];
  const last = sheet.getLastRow();
  if (last < 2) return [];
  const n = Math.min(20, last - 1);
  const col = (h) => LOG_HEADER.indexOf(h);
  return sheet.getRange(last - n + 1, 1, n, LOG_HEADER.length).getDisplayValues().reverse()
    .map((r) => ({ savedAt: r[col('Saved at')], savedBy: r[col('Saved by')], title: r[col('Title')],
      folderUrl: r[col('Drive folder')], folderId: (r[col('Drive folder')].match(/folders\/([\w-]+)/) || [])[1] || '' }))
    .filter((x) => x.folderId);
}

/** Image files of one import, for the AI step. */
function folderPhotos(folderId) {
  const folder = importFolder_(folderId);
  const files = [];
  Object.keys(KINDS).forEach((kind) => {
    const subs = folder.getFoldersByName(KINDS[kind]);
    if (!subs.hasNext()) return;
    const list = [];
    for (const it = subs.next().getFiles(); it.hasNext();) {
      const f = it.next();
      if (String(f.getMimeType()).indexOf('image/') === 0) list.push({ id: f.getId(), name: f.getName(), kind });
    }
    list.sort((a, b) => (a.name < b.name ? -1 : 1)).forEach((x) => files.push(x));
  });
  return { folderId: folder.getId(), folderUrl: folder.getUrl(), title: folder.getName(), files: files.slice(0, 150) };
}

// ---------- AI versions (Gemini image model) ----------

/** Makes AI versions of up to MAX_AI_PER_RUN photos into <folder>/AI edited/. Returns { made, errors[] }. */
function makeAiVersions(folderId, fileIds, prompt) {
  const props = PropertiesService.getScriptProperties();
  const key = props.getProperty('GEMINI_API_KEY');
  if (!key) throw new Error('No Gemini API key yet. The owner adds it once (README.md, owner setup step 4).');
  const model = props.getProperty('GEMINI_MODEL') || 'gemini-2.5-flash-image';
  const text = clean(prompt, 2000) || DEFAULT_AI_PROMPT;
  const folder = importFolder_(folderId);
  const out = folderByName_(folder, 'AI edited');
  const errors = [];
  let made = 0;
  (fileIds || []).slice(0, MAX_AI_PER_RUN).forEach((id) => {
    let src = null;
    try {
      src = DriveApp.getFileById(String(id));
      const parent = src.getParents();
      const grand = parent.hasNext() ? parent.next().getParents() : null;
      if (!grand || !grand.hasNext() || grand.next().getId() !== folder.getId()) throw new Error('not a photo of this import');
      const blob = src.getBlob();
      const res = UrlFetchApp.fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'post',
        contentType: 'application/json',
        headers: { 'x-goog-api-key': key },
        muteHttpExceptions: true,
        payload: JSON.stringify({
          contents: [{ parts: [{ text }, { inline_data: { mime_type: blob.getContentType(), data: Utilities.base64Encode(blob.getBytes()) } }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      });
      const body = JSON.parse(res.getContentText() || '{}');
      if (res.getResponseCode() !== 200) throw new Error((body.error && body.error.message) || `HTTP ${res.getResponseCode()}`);
      const parts = (((body.candidates || [])[0] || {}).content || {}).parts || [];
      const img = parts.map((p) => p.inlineData || p.inline_data).find((x) => x && x.data);
      if (!img) throw new Error('The model returned no image.');
      const mime = img.mimeType || img.mime_type || 'image/png';
      const file = out.createFile(Utilities.newBlob(Utilities.base64Decode(img.data), mime,
        `${src.getName().replace(/\.[^.]+$/, '')}-ai-${Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'HHmmss')}.${extFor_(mime)}`));
      file.setDescription(`AI-edited with ${model} from "${src.getName()}" (${src.getId()}) by ${me_()}.\nPrompt: ${text}`);
      made += 1;
    } catch (e) {
      errors.push(`${src ? src.getName() : id}: ${e.message}`);
    }
  });
  return { made, errors, folderUrl: out.getUrl(), limit: MAX_AI_PER_RUN };
}

// ---------- helpers ----------

function logSheet_(root) {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('LOG_SHEET_ID');
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) { /* recreated below */ } }
  const existing = root.getFilesByName(LOG_SHEET_NAME);
  if (existing.hasNext()) return SpreadsheetApp.open(existing.next());
  const ss = SpreadsheetApp.create(LOG_SHEET_NAME);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  ss.getSheets()[0].appendRow(LOG_HEADER).setFrozenRows(1);
  return ss;
}

/** One log row. `previous` keeps the row's Status and anything else the team edited by hand. */
function logValues_(meta, folder, previous) {
  const count = (k) => (meta.photos || []).filter((p) => p.kind === k).length;
  const row = previous ? previous.slice() : LOG_HEADER.map(() => '');
  const set = (h, v) => { row[LOG_HEADER.indexOf(h)] = v; };
  set('Designer photos', count('designer'));
  set('Community photos', count('community'));
  set('Own photos', count('own'));
  if (previous) return row;
  set('Saved at', Utilities.formatDate(new Date(meta.savedAt), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm'));
  set('Saved by', meta.savedBy);
  set('Title', meta.title);
  set('Designer', meta.designer);
  set('Licence (as shown)', meta.licenceAsShown);
  set('Licence bought / allows selling', meta.licenceBoughtOrAllowsSelling ? 'Yes' : 'NO - check before listing');
  set('Model page', meta.modelUrl);
  set('Drive folder', folder.getUrl());
  set('Filament (g)', meta.print.filamentGrams);
  set('Print time (h)', meta.print.printHours);
  set('Suggested price (LKR)', meta.price.breakdown.suggested);
  set('Your price (LKR)', meta.price.yourPriceLkr);
  set('Notes', meta.notes);
  set('Status', 'New');
  return row;
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function folderByName_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function extFor_(type, fileName) {
  const known = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif', 'image/heic': 'heic', 'image/heif': 'heif' }[type];
  return known || ((String(fileName || '').match(/\.([a-z0-9]{2,5})$/i) || [])[1] || 'img').toLowerCase();
}

function clean(s, max) {
  return String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, max || 500);
}

function slug_(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'model';
}
