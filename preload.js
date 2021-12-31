const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
    if(window.location.href.endsWith("index.html")){
        const version = document.createElement('div');
        version.innerText = `v${require('./package.json').version}`;
        version.style.position = 'absolute';
        version.style.right = '5px';
        version.style.bottom = '5px';
        version.style.color = '#82828282';
        document.getElementsByClassName('wrp')[0].appendChild(version);
    }
    titlebar = new customTitlebar.Titlebar({
    	backgroundColor: customTitlebar.Color.fromHex('#191919'),
        menu: null
    });
});