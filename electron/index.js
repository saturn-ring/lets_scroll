const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
var exec = require('child_process').execFile;

const isdev = true;

function createWindow () {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../files/Pt1xz.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile(`${require('path').join(__dirname, '../files/index.html')}`)
    win.once('ready-to-show', () => {
        win.show();
        win.maximize();
        if (isdev) {
            win.webContents.openDevTools();
        }
    });
    win.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();
        if (!fs.existsSync(url)) {
            if(url.endsWith('files')||url.endsWith('files/')) {
                url = path.join(__dirname, '../files/index.html');
                win.loadURL(url);
                return;
            }
            if(!url.includes(app.getAppPath())) {
                url = path.join(__dirname, '../files', url.split('/')[url.split('/').length - 1]);
            }
            if (!url.split('?')[0].includes('.html')) {
                url = url.split('?')[0] + '.html' + (url.split('?').length > 1 ? '?' + url.split('?')[1] : '');
            }
        }
        win.loadURL(url);
    });
    win.on('closed', () => {
        win = null;
    });
}

function run(){
    exec(path.join(__dirname, "../builded/windows_lets_scroll_x86-64.exe"), function(err, data) {
        if(!!err) console.log(err);
        console.log(data.toString());
     });
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
    //run();
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})