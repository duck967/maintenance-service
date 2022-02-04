const puppeteer = require('puppeteer');

const {
    createDirectory,
    saveTextFile,
    writeImageFile,
    trimPath
} = require('./fileservices');


const PAGE_PATH = '../maintain/mtain.html';
const PAGE_ROOT = '../maintain';
const STATUS_PATH = `../status/status.json`;
const STATUS_ROOT = `../status`;

// GET A SINGLE PAGE AND IT'S CONTENT
const getPage = async (data) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    let returnStr = {};

    // GET ALL REQUESTS FOR EXTERNAL FILES
    await page.setRequestInterception(true)
    page.on('request', async (request) => {
        await request.continue()
    })

    // WHAT PAGE TO GET
    const pagePath = JSON.parse(data.payload);
    console.log('**** GET PAGE ****', pagePath.url);

    // WHEN CSS,JS AND IMAGES ARE LOADED SAVE THEM TO THEIR RELATIVE PATH
    page.on('response', async function (response) {
        try {
            if (response.url().toLowerCase().indexOf(".png") > 0 || response.url().toLowerCase().indexOf(".jpg") > 0 || response.url().toLowerCase().indexOf(".gif") > 0) {
                const buffer = await response.buffer();
                let trimedPath = trimPath(response.url());
                writeImageFile(buffer, `${PAGE_ROOT}/${trimedPath.path}/${trimedPath.fileName}`);
            };
        } catch (e) {
            console.log('IMAGE DOWNLOAD ERROR', e);
        }

        try {
            if (response.url().toLowerCase().indexOf(".css") > 0 || response.url().toLowerCase().indexOf(".js") > 0) {
                let trimedPath = trimPath(response.url());
                const cssFile = await response.text();
                const saveFileStatus = await saveTextFile(cssFile, `${PAGE_ROOT}/${trimedPath.path}/${trimedPath.fileName}`);
                console.log(`finished downloading! ${saveFileStatus.fileName}`)
            };
        } catch (e) {
            console.log('CSS OR JS DOWNLOAD ERROR', e);
        }
    });

    // LOAD THE pagePath.url TO PUPPETEER
    try {
        await page.goto(pagePath.url);
    } catch (e) {
        console.log('NO SUCH PAGE', e);
        returnStr = {
            fileName: "Bad path no page",
            status: 404
        };
    }

    // SAVE THE PAGE LOADED TO PUPPETEER
    const html = await page.content();
    saveTextFile(html, PAGE_PATH);

    // WHEN DONE
    await browser.close().then(() => {
        console.log('PAGE CLOSED');
        if (Object.keys(returnStr).length === 0) {
            returnStr = {
                fileName: pagePath.pagename,
                status: 200
            };
        }
        // Save the name of the file saved for the status check
        createDirectory(STATUS_ROOT);
        saveTextFile(JSON.stringify(returnStr), STATUS_PATH);
    });

    return returnStr;
}

module.exports = getPage;