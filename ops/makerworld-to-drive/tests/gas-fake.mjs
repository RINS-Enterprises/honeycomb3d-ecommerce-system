// In-memory stand-ins for the Apps Script services Code.gs uses, so the real Code.gs can run in Node.
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

export function makeEnv({ codePath, fetchRoutes = {}, sharedFolderId = '1qGplQuyLmQIW_yI9TRlxS68jwYdYSqtI' }) {
  let seq = 0;
  const id = (p) => `${p}${++seq}`;
  const state = { user: 'owner@example.com', noAccess: [], readOnly: [], files: new Map(), folders: new Map(), sheets: new Map(), props: {}, fetches: [] };
  const iter = (arr) => { let i = 0; return { hasNext: () => i < arr.length, next: () => arr[i++] }; };

  function Blob(bytes, type, name) {
    this.bytes = Buffer.from(bytes || []); this.type = type || ''; this.name = name || '';
  }
  Blob.prototype.getBytes = function () { return [...this.bytes]; };
  Blob.prototype.getContentType = function () { return this.type; };
  Blob.prototype.setName = function (n) { this.name = n; return this; };
  Blob.prototype.getName = function () { return this.name; };
  Blob.prototype.getDataAsString = function () { return this.bytes.toString('utf8'); };

  function File(blob, parent) {
    this.id = id('file'); this.blob = blob; this.parent = parent; this.desc = '';
    state.files.set(this.id, this);
  }
  Object.assign(File.prototype, {
    getId() { return this.id; }, getName() { return this.blob.name; }, getUrl() { return `https://drive.google.com/file/d/${this.id}/view`; },
    getMimeType() { return this.blob.type; }, getBlob() { return this.blob; }, setDescription(d) { this.desc = d; return this; },
    setContent(s) { this.blob = new Blob(Buffer.from(s), this.blob.type, this.blob.name); return this; },
    getParents() { return iter(this.parent ? [this.parent] : []); },
    moveTo(f) { this.parent = f; return this; },
  });

  function Folder(name, parent) {
    this.id = id('fold'); this.name = name; this.parent = parent;
    state.folders.set(this.id, this);
  }
  const kids = (f) => [...state.folders.values()].filter((x) => x.parent === f);
  const filesIn = (f) => [...state.files.values()].filter((x) => x.parent === f);
  const guardWrite = (f) => {
    for (let x = f; x; x = x.parent) if (state.readOnly.some((r) => r.folder === x.id && r.user === state.user)) throw new Error('Access denied: DriveApp.');
  };
  Object.assign(Folder.prototype, {
    getId() { return this.id; }, getName() { return this.name; }, getUrl() { return `https://drive.google.com/drive/folders/${this.id}`; },
    createFolder(n) { guardWrite(this); return new Folder(n, this); },
    getFoldersByName(n) { return iter(kids(this).filter((x) => x.name === n)); },
    getFilesByName(n) { return iter(filesIn(this).filter((x) => x.getName() === n)); },
    getFiles() { return iter(filesIn(this)); },
    getParents() { return iter(this.parent ? [this.parent] : []); },
    createFile(a, content, mime) {
      guardWrite(this);
      const blob = a instanceof Blob ? a : new Blob(Buffer.from(String(content)), mime || 'text/plain', a);
      return new File(blob, this);
    },
  });
  const myDrive = new Folder('My Drive', null);
  // The real shared folder: My Drive / HoneyComb / MakerWorld imports.
  const shared = new Folder('MakerWorld imports', new Folder('HoneyComb', myDrive));
  state.folders.delete(shared.id); shared.id = sharedFolderId; state.folders.set(shared.id, shared);
  const visible = (x) => { for (let f = x; f; f = f.parent) if (state.noAccess.some((r) => r.folder === f.id && r.user === state.user)) return false; return true; };

  function Sheet() { this.rows = []; }
  Object.assign(Sheet.prototype, {
    appendRow(r) { this.rows.push(r.slice()); return this; }, setFrozenRows() { return this; },
    getLastRow() { return this.rows.length; },
    getRange(r, c, nr, nc) {
      const sh = this;
      const vals = () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => ((sh.rows[r - 1 + i] || [])[c - 1 + j] ?? '')));
      return { getValues: vals, getDisplayValues: () => vals().map((row) => row.map(String)),
        setValues(v) { v.forEach((row, i) => { sh.rows[r - 1 + i] = sh.rows[r - 1 + i] || []; row.forEach((x, j) => { sh.rows[r - 1 + i][c - 1 + j] = x; }); }); return this; } };
    },
    createTextFinder(t) {
      const sh = this;
      return { matchEntireCell() { return this; }, findNext() { const i = sh.rows.findIndex((row) => row.some((x) => String(x) === t)); return i < 0 ? null : { getRow: () => i + 1 }; } };
    },
  });
  function Spreadsheet(name) {
    this.file = new File(new Blob(Buffer.alloc(0), 'application/vnd.google-apps.spreadsheet', name), myDrive);
    this.sheet = new Sheet(); state.sheets.set(this.file.id, this);
  }
  Object.assign(Spreadsheet.prototype, { getId() { return this.file.id; }, getUrl() { return `https://docs.google.com/spreadsheets/d/${this.file.id}`; }, getSheets() { return [this.sheet]; } });

  const ctx = {
    console,
    Logger: { log: (m) => { state.log = m; } },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Session: { getActiveUser: () => ({ getEmail: () => state.user }), getEffectiveUser: () => ({ getEmail: () => state.user }), getScriptTimeZone: () => 'Asia/Colombo' },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (k in state.props ? state.props[k] : null), setProperty: (k, v) => { state.props[k] = String(v); },
      setProperties: (o) => { Object.entries(o).forEach(([k, v]) => { state.props[k] = String(v); }); } }) },
    Utilities: {
      formatDate: (d, tz, f) => (f === 'HHmmss' ? '120000' : '2026-10-16 1800'),
      base64Decode: (s) => [...Buffer.from(s, 'base64')], base64Encode: (b) => Buffer.from(b).toString('base64'),
      newBlob: (b, t, n) => new Blob(b, t, n),
    },
    UrlFetchApp: { fetch: (url, opts) => {
      state.fetches.push({ url, opts });
      const route = Object.entries(fetchRoutes).find(([p]) => url.startsWith(p));
      if (!route) throw new Error(`Address unavailable: ${url}`);
      const r = route[1](url, opts);
      return { getResponseCode: () => r.code ?? 200, getContentText: () => (Buffer.isBuffer(r.body) ? r.body.toString('utf8') : String(r.body ?? '')),
        getBlob: () => new Blob(Buffer.isBuffer(r.body) ? r.body : Buffer.from(String(r.body ?? '')), r.type || 'text/html', 'download') };
    } },
    DriveApp: {
      getRootFolder: () => myDrive,
      getFolderById: (fid) => { const f = state.folders.get(fid); if (!f || !visible(f)) throw new Error('No item with the given ID could be found. Access denied.'); return f; },
      getFileById: (fid) => { const f = state.files.get(fid); if (!f || !visible(f.parent)) throw new Error('No item with the given ID could be found.'); return f; },
    },
    SpreadsheetApp: {
      create: (n) => new Spreadsheet(n),
      openById: (sid) => { const s = state.sheets.get(sid); if (!s) throw new Error('not found'); return s; },
      open: (file) => state.sheets.get(file.id),
    },
    HtmlService: {},
  };
  vm.createContext(ctx);
  vm.runInContext(readFileSync(codePath, 'utf8'), ctx, { filename: 'Code.gs' });
  return { ctx, state, myDrive, Folder };
}
