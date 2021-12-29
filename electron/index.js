const { app, BrowserWindow } = require('electron');
const path = require('path');
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
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        },
        vibrancy: {
            'theme': 'appearance-based',
            'effect': 'acrylic'
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
    run();
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})