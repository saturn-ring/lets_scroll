const puppet = require("puppeteer");

module.exports = async function(path, url) {
    const browser = await puppet.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.screenshot({ path: path });
    return await browser.close();
};
