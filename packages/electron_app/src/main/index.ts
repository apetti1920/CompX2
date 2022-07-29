import { app, BrowserWindow } from 'electron';
const url = require('url');
const path = require('path');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/../renderer/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});