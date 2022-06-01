const {app, BrowserWindow, ipcMain} = require("electron");
const path = require('path')
const pty = require("node-pty");
const os = require("os");
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        height: 450,
        width: 800,
        webPreferences: {
            // nodeIntegration: true,  // user node api at renderer process, disable for safety
            // contextIsolation: false
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on("closed", function() {
        mainWindow = null;
    });

    var ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env
    });

    ptyProcess.onData(function(data) {
        mainWindow&&mainWindow.webContents.send("incomingData", data);
        // console.log("Data sent");
    });
    ipcMain.on("keystroke", (event, key) => {
        ptyProcess.write(key);
    });
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})