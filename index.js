const puppeteer = require('puppeteer');
const imgur = require('imgur');

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function generateScreenshot(webUrl){
  webUrl = 'http://www.'+webUrl;
  var imageTitle = extractRootDomain(webUrl);
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(webUrl, {waitUntil: 'networkidle2'});
    await page.setViewport({
      width: 1280,
      height: 720
    });
    await page.screenshot({path: `./captures/${imageTitle}.png`});
    await uploadtoImgur(`./captures/${imageTitle}.png`);
    await browser.close();

  })();
}

function uploadtoImgur(path){
  imgur.uploadFile(path)
      .then(function (json) {
          console.log(json.data.link);
      })
      .catch(function (err) {
          console.error(err.message);
      });
}

var args = process.argv.slice(2);
generateScreenshot(args);
