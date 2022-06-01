const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('terminal', {
    incomingData: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    },
    keystroke: (e) => {
        ipcRenderer.send("keystroke", e);
    }
})