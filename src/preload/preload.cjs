// UrduOfDani preload script. Exposes a small, typed API to the renderer
// via contextBridge so the renderer never gets node globals.

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('udani', {
  spell: {
    check:   (text)      => ipcRenderer.invoke('udani:spell',     { text }),
    suggest: (word, lim)  => ipcRenderer.invoke('udani:suggest',  { word, limit: lim ?? 5 }),
    info:    ()          => ipcRenderer.invoke('udani:engine-info'),
  },
  openExternal: (url) => ipcRenderer.invoke('udani:open-external', url),
  platform: process.platform,
  isElectron: true,
});