const customTitlebar = require('custom-electron-titlebar');
const path = require('path');

window.addEventListener('DOMContentLoaded', () => {
    new customTitlebar.Titlebar({
    	backgroundColor: customTitlebar.Color.fromHex('#191919'),
        menu: null
    });
});