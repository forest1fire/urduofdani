// UrduOfDani — Electron main process.
// Created by Muhammad Danish [Dani] · DaniLabs.
// Loads the Vite-built renderer in dev and prod, owns the spell-check sidecar.

const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('node:path');
const fs   = require('node:fs');
const { spawn } = require('node:child_process');

const isDev = !!process.env.UD_DEV || !app.isPackaged;
const VITE_DEV = process.env.UD_VITE_URL || 'http://localhost:5173';

let mainWindow = null;
const PYTHON = process.env.UD_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440, height: 900, minWidth: 1100, minHeight: 720,
    backgroundColor: '#FFFFFF',
    title: 'UrduOfDani',
    icon: path.join(__dirname, '..', '..', 'resources', 'icon.png'),
    titleBarStyle: 'default',
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // preload needs node access for spawn()
      spellcheck: false,
    },
    show: false,
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (isDev) {
    mainWindow.loadURL(VITE_DEV).catch(err => {
      console.error('Vite dev server unreachable; did you run "npm run dev"?', err);
    });
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
  }

  // Open external links in the OS browser, not inside the app.
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Block in-app navigation away from our app.
  mainWindow.webContents.on('will-navigate', (e, url) => {
    const allowed = isDev ? url.startsWith(VITE_DEV) : url.startsWith('file://');
    if (!allowed) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
}

function resolveEngine() {
  // Prefer the packaged vendor copy; in dev, also look one level up.
  const candidates = [
    path.join(process.resourcesPath || '', 'vendor', 'urduofdani_engine.py'),
    path.join(__dirname, '..', '..', 'vendor', 'urduofdani_engine.py'),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return candidates[candidates.length - 1];
}

function resolveDatabase() {
  const candidates = [
    path.join(process.resourcesPath || '', 'vendor', 'urdu_database.compact.gz'),
    path.join(__dirname, '..', '..', 'vendor', 'urdu_database.compact.gz'),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

// Run the Python dictionry engine in a separate process and parse its output.
function spellCheck({ text }) {
  return new Promise((resolve, reject) => {
    const engine = resolveEngine();
    const db = resolveDatabase();
    if (!fs.existsSync(engine)) return reject(new Error('urduofdani_engine.py not found at ' + engine));

    const args = ['--spell', text];
    if (db) args.push('--db', db);

    const p = spawn(PYTHON, [engine, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
        if (code !== 0) return reject(new Error(err || `engine exited ${code}`));
        // Format: "unknown: word1 word2 ..." or "ok"
        const line = out.trim();
        if (line === 'ok' || line === '') return resolve({ unknown: [] });
        const m = line.match(/^unknown:\s*(.*)$/);
        const words = m ? m[1].trim().split(/\s+/).filter(Boolean) : [];
        resolve({ unknown: words });
      });
    p.on('error', reject);
  });
}

function suggest({ word, limit = 5 }) {
  return new Promise((resolve, reject) => {
    const engine = resolveEngine();
    const db = resolveDatabase();
    if (!fs.existsSync(engine)) return reject(new Error('urduofdani_engine.py not found at ' + engine));

    const args = ['--suggest', word, '--limit', String(limit)];
    if (db) args.push('--db', db);

    const p = spawn(PYTHON, [engine, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
        if (code !== 0) return reject(new Error(err || `engine exited ${code}`));
        const sug = out.trim().split(/\s+/).filter(Boolean);
        resolve({ suggestions: sug });
    });
    p.on('error', reject);
  });
}

function engineInfo() {
  return new Promise((resolve, reject) => {
    const engine = resolveEngine();
    const db = resolveDatabase();
    const args = ['--info'];
    if (db) args.push('--db', db);
    const p = spawn(PYTHON, [engine, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    p.stdout.on('data', d => out += d);
    p.stderr.on('data', d => err += d);
    p.on('close', code => {
      if (code !== 0) return reject(new Error(err || `engine exited ${code}`));
      // Parse lines like "words    : 15,848"
      const info = {};
      for (const line of out.split('\n')) {
        const m = line.match(/^\s*([\w ]+?)\s*:\s*(.+?)\s*$/);
        if (m) info[m[1].trim()] = m[2].trim();
      }
      resolve(info);
  });
  });
}

// IPC handlers — preload uses contextBridge to expose these as `window.udani.spell.*`.
ipcMain.handle('udani:spell', (_evt, payload) => spellCheck(payload));
ipcMain.handle('udani:suggest', (_evt, payload) => suggest(payload));
ipcMain.handle('udani:engine-info', () => engineInfo());
ipcMain.handle('udani:open-external', (_evt, url) => shell.openExternal(url));

app.whenReady().then(() => {
  createWindow();
  Menu.setApplicationMenu(null);
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});