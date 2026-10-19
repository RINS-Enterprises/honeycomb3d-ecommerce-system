// Runs the real Code.gs against gas-fake.mjs and checks the team features.
import assert from 'node:assert/strict';
import { makeEnv } from './gas-fake.mjs';

const CODE = new URL('../', import.meta.url).pathname + 'Code.gs';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const nextPage = `<!doctype html><html><head><title>Cute Dragon | MakerWorld</title>
<meta content="Cute Dragon" property="og:title"><meta property="og:image" content="https://public-cdn.bblmw.com/a/cover.jpg?x-oss-process=image/resize,w_400">
<script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: {
  design: { title: 'Cute Dragon', designCreator: { name: 'Maker Mia', avatarUrl: 'https://public-cdn.bblmw.com/u/avatar.jpg' }, license: 'Standard Digital File License',
    summary: '<p>Print in place dragon</p>', coverUrl: 'https://public-cdn.bblmw.com/a/cover.jpg',
    designExtension: { design_pictures: [{ url: 'https://public-cdn.bblmw.com/a/p1.jpg' }, { url: 'https://public-cdn.bblmw.com/a/p2.webp' }] },
    instances: [{ title: '0.2mm PLA', weight: 34.6, prediction: 8100 }, { title: '0.16mm PLA', weight: '36', prediction: 10800 }] },
  comments: [{ nickname: 'Printer Pat', images: ['https://public-cdn.bblmw.com/c/make1.jpg'] }] } } })}</script></head><body></body></html>`;
// Newer Next.js pages stream data inside script strings instead of __NEXT_DATA__.
const rscPage = `<!doctype html><html><head><meta property="og:title" content="Flexi Fox"></head><body><script>self.__next_f.push([1,"{\\"title\\":\\"0.2mm Bambu PLA\\",\\"weight\\":21.5,\\"prediction\\":5400,\\"cover\\":\\"https:\\u002F\\u002Fmakerworld.bblmw.com\\u002Fm\\u002Ffox1.jpg\\",\\"avatar\\":\\"https:\\u002F\\u002Fmakerworld.bblmw.com\\u002Fu\\u002Favatar.png\\"}"])</script></body></html>`;

const routes = {
  'https://makerworld.com/en/models/111': () => ({ body: nextPage }),
  'https://makerworld.com/en/models/222': () => ({ body: rscPage }),
  'https://makerworld.com/en/models/333': () => ({ code: 403, body: '<title>Just a moment...</title>' }),
  'https://public-cdn.bblmw.com/a/missing.jpg': () => ({ code: 404, body: 'nope' }),
  'https://public-cdn.bblmw.com/': () => ({ body: png, type: 'image/png' }),
  'https://makerworld.bblmw.com/': () => ({ body: png, type: 'image/jpeg' }),
  'https://generativelanguage.googleapis.com/': () => ({ body: JSON.stringify({ candidates: [{ content: { parts: [{ text: 'ok' }, { inlineData: { mimeType: 'image/png', data: png.toString('base64') } }] } }] }) }),
};
const { ctx, state } = makeEnv({ codePath: CODE, fetchRoutes: routes });
const deq = (a, b) => assert.deepStrictEqual(JSON.parse(JSON.stringify(a)), b);
const ok = (name) => console.log('PASS', name);

// Not set up yet: a clear message, not a crash.
assert.match(ctx.getSettings().folderError, /not set up yet/); ok('settings before setup explain what to do');

ctx.setup();
assert.ok(state.props.ROOT_FOLDER_ID && state.props.LOG_SHEET_ID); assert.equal(state.props.OWNER_EMAIL, 'owner@example.com');
const log = state.sheets.get(state.props.LOG_SHEET_ID).sheet;
assert.equal(log.rows[0][1], 'Saved by'); ok('setup creates shared folder, log sheet and records the owner');
ctx.setup(); assert.equal([...state.sheets.keys()].length, 1); ok('setup is safe to run again');

let s = ctx.getSettings();
assert.equal(s.canEditPricing, true); assert.equal(s.user, 'owner@example.com'); assert.match(s.folderUrl, /folders\//); ok('owner settings');
ctx.savePricing({ filamentCostPerKg: 6500, wastePercent: 10, machineCostPerHour: 40, labourPerItem: 100, packagingPerItem: 50, markupPercent: 80, roundTo: 50 });

state.user = 'team@example.com';
s = ctx.getSettings();
assert.equal(s.canEditPricing, false); assert.equal(s.pricing.filamentCostPerKg, 6500); assert.equal(s.folderError, '');
assert.throws(() => ctx.savePricing(s.pricing), /Only owner@example.com/); ok('teammate sees shared pricing but cannot change it');
state.props.PRICING_EDITORS = 'Someone@x.com, TEAM@example.com';
assert.equal(ctx.getSettings().canEditPricing, true); delete state.props.PRICING_EDITORS; ok('PRICING_EDITORS lets named people edit pricing');

// Pasted links
assert.equal(ctx.modelUrl_('Check out this model on MakerWorld! https://makerworld.com/en/models/111-cute-dragon#profileId-9 '), 'https://makerworld.com/en/models/111-cute-dragon');
assert.equal(ctx.modelUrl_('makerworld.com/en/models/111'), 'https://makerworld.com/en/models/111');
assert.throws(() => ctx.modelUrl_('https://evil.example/makerworld.com'), /Paste a link/);
assert.throws(() => ctx.modelUrl_('https://makerworld.com.evil.example/x'), /Paste a link/); ok('link extraction from share text, no look-alike hosts');

const d1 = ctx.fetchModel('https://makerworld.com/en/models/111');
assert.equal(d1.title, 'Cute Dragon'); assert.equal(d1.designer, 'Maker Mia'); assert.equal(d1.license, 'Standard Digital File License');
deq(d1.designerImages, ['https://public-cdn.bblmw.com/a/cover.jpg', 'https://public-cdn.bblmw.com/a/p1.jpg', 'https://public-cdn.bblmw.com/a/p2.webp']);
deq(d1.community, [{ src: 'https://public-cdn.bblmw.com/c/make1.jpg', author: 'Printer Pat' }]);
deq(d1.profiles.map((p) => [p.name, p.weightG, p.timeRaw]), [['0.2mm PLA', 34.6, 8100], ['0.16mm PLA', 36, 10800]]);
assert.ok(!JSON.stringify(d1).includes('avatar')); ok('fetchModel reads __NEXT_DATA__ pages (photos, community, profiles, no avatars, full-size cover)');

const d2 = ctx.fetchModel('https://makerworld.com/en/models/222');
assert.equal(d2.title, 'Flexi Fox'); deq(d2.designerImages, ['https://makerworld.bblmw.com/m/fox1.jpg']);
deq(d2.profiles.map((p) => [p.name, p.weightG, p.timeRaw]), [['0.2mm Bambu PLA', 21.5, 5400]]); ok('fetchModel falls back to raw page data (newer page format)');

assert.throws(() => ctx.fetchModel('https://makerworld.com/en/models/333'), /did not let Google's server read this page.*HTTP 403/); ok('blocked page gives the fill-in-by-hand message');

// Save as the teammate
const r = ctx.saveImport({ url: 'https://makerworld.com/en/models/111', via: 'link', title: 'Cute Dragon', designer: 'Maker Mia', license: 'SDFL',
  licencePurchased: true, filamentGrams: 34.6, printHours: 2.25, yourPrice: 0, deviceCount: 1, profiles: d1.profiles, profileName: '0.2mm PLA',
  photos: [{ src: d1.designerImages[0], kind: 'designer' }, { src: d1.designerImages[1], kind: 'designer' },
    { src: 'https://public-cdn.bblmw.com/a/missing.jpg', kind: 'designer' }, { src: d1.community[0].src, kind: 'community', author: 'Printer Pat' }] });
assert.equal(r.saved, 3); assert.equal(r.failed.length, 1); assert.match(r.failed[0], /HTTP 404/);
const folder = state.folders.get(r.folderId);
assert.equal(folder.parent.id, state.props.ROOT_FOLDER_ID); assert.equal(state.props.ROOT_FOLDER_ID, '1qGplQuyLmQIW_yI9TRlxS68jwYdYSqtI'); assert.equal(folder.name, 'Cute Dragon (111) - 2026-10-16 1800');
const meta = JSON.parse([...state.files.values()].find((f) => f.parent === folder && f.getName() === 'model.json').blob.getDataAsString());
assert.equal(meta.savedBy, 'team@example.com'); assert.equal(meta.readVia, 'pasted link');
// 34.6 g × 1.1 × 6500/1000 = 247.39; + 2.25 × 40 = 90; + 100 + 50 → 487.39; × 1.8 = 877.3 → 900
assert.equal(meta.price.breakdown.suggested, 900); assert.equal(meta.price.yourPriceLkr, 900);
const row = log.rows[1];
assert.equal(row[1], 'team@example.com'); assert.equal(row[2], 'Cute Dragon'); assert.equal(row[5], 'Yes'); assert.equal(row[8], 2); assert.equal(row[9], 1); assert.equal(row[10], 0); assert.equal(row[16], 'New');
const communityFile = [...state.files.values()].find((f) => f.parent?.name === 'Community prints');
assert.equal(communityFile.getName(), '01-cute-dragon-by-printer-pat.png'); assert.match(communityFile.desc, /by Printer Pat[\s\S]*Saved: .* by team@example.com/);
ok('saveImport: shared folder, numbered files, failures listed, price, log row with Saved by');

// Device photo afterwards; Status edited by hand in the sheet must survive.
log.rows[1][16] = 'Listed';
const added = ctx.addPhoto(r.folderId, 'own', 'IMG_2041.JPG', 'image/jpeg', png.toString('base64'));
assert.equal(added.name, '01-cute-dragon-own.jpg');
const ownFile = state.files.get(added.id); assert.equal(ownFile.parent.name, 'Own photos'); assert.match(ownFile.desc, /Original file name: IMG_2041.JPG/);
const meta2 = JSON.parse([...state.files.values()].find((f) => f.parent === folder && f.getName() === 'model.json').blob.getDataAsString());
assert.equal(meta2.photos.length, 4); assert.equal(meta2.photos[3].addedBy, 'team@example.com');
assert.equal(log.rows[1][10], 1); assert.equal(log.rows[1][16], 'Listed'); assert.equal(log.rows.length, 2);
assert.equal(ctx.addPhoto(r.folderId, 'bogus', 'b.png', 'image/png', png.toString('base64')).name, '02-cute-dragon-own.png');
assert.throws(() => ctx.addPhoto(r.folderId, 'own', 'x.pdf', 'application/pdf', 'AAAA'), /only image files/);
assert.throws(() => ctx.addPhoto(r.folderId, 'own', 'e.jpg', 'image/jpeg', ''), /empty/);
ok('addPhoto: Own photos, model.json and log counts updated, hand-edited Status kept, non-images refused');

// Only folders inside the shared folder
const stray = state.folders.get(state.props.ROOT_FOLDER_ID).parent.createFolder('Private stuff');
assert.throws(() => ctx.addPhoto(stray.id, 'own', 'a.png', 'image/png', png.toString('base64')), /not a MakerWorld import/);
assert.throws(() => ctx.folderPhotos(stray.id), /not a MakerWorld import/); ok('cannot write to folders outside the shared folder');

const recent = ctx.recentImports();
assert.equal(recent.length, 1); assert.equal(recent[0].folderId, r.folderId); assert.equal(recent[0].savedBy, 'team@example.com'); ok('recentImports');
const fp = ctx.folderPhotos(r.folderId);
deq(fp.files.map((f) => f.kind), ['designer', 'designer', 'community', 'own', 'own']); ok('folderPhotos lists images by kind');

// AI
assert.throws(() => ctx.makeAiVersions(r.folderId, [fp.files[0].id], ''), /No Gemini API key/);
state.props.GEMINI_API_KEY = 'test-key';
const ai = ctx.makeAiVersions(r.folderId, [fp.files[0].id, fp.files[3].id, stray.createFile('z.png', 'x', 'image/png').getId()], 'On a wooden desk');
assert.equal(ai.made, 2); assert.equal(ai.errors.length, 1); assert.match(ai.errors[0], /not a photo of this import/);
const gem = state.fetches.filter((f) => f.url.includes('generativelanguage'));
assert.equal(gem.length, 2); assert.equal(gem[0].opts.headers['x-goog-api-key'], 'test-key'); assert.match(gem[0].url, /gemini-2\.5-flash-image:generateContent/);
const aiFiles = [...state.files.values()].filter((f) => f.parent?.name === 'AI edited');
assert.equal(aiFiles.length, 2); assert.match(aiFiles[0].getName(), /-ai-120000\.png$/); assert.match(aiFiles[0].desc, /by team@example.com[\s\S]*Prompt: On a wooden desk/);
ok('makeAiVersions saves into AI edited, refuses photos from other folders');

// Someone without folder access, and someone with view-only access.
state.user = 'stranger@example.com';
state.noAccess.push({ folder: state.props.ROOT_FOLDER_ID, user: 'stranger@example.com' });
assert.match(ctx.getSettings().folderError, /Ask owner@example.com to share it with stranger@example.com as Editor/);
assert.throws(() => ctx.saveImport({ url: 'https://makerworld.com/en/models/111', photos: [{ src: d1.designerImages[0] }] }), /share it with stranger/);
state.user = 'viewer@example.com';
state.readOnly.push({ folder: state.props.ROOT_FOLDER_ID, user: 'viewer@example.com' });
assert.throws(() => ctx.saveImport({ url: 'https://makerworld.com/en/models/111', photos: [{ src: d1.designerImages[0] }] }), /not add to it.*make viewer@example.com an Editor/);
ok('no access / view-only access get clear messages');

assert.throws(() => ctx.saveImport({ url: 'https://evil.example/', photos: [{ src: 'https://x/y.jpg' }] }), /Only makerworld.com/);
state.user = 'team@example.com';
assert.throws(() => ctx.saveImport({ url: 'https://makerworld.com/en/models/1', photos: [] }), /No photos selected/);
const devOnly = ctx.saveImport({ url: 'https://makerworld.com/en/models/444-flexi-fox', via: 'manual', title: 'Flexi Fox', photos: [], deviceCount: 2 });
assert.equal(devOnly.saved, 0); assert.equal(log.rows.length, 3); assert.equal(log.rows[2][4] ?? '', ''); assert.equal(log.rows[2][5], 'NO - check before listing');
ok('device-only save allowed (filled in by hand); licence untick flagged');
console.log('ALL SERVER CHECKS PASSED');
