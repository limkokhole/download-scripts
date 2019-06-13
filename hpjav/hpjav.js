const Chromeless = require('wless').Chromeless;
const url = process.argv[2];

if(!url || url.length == 0) return process.exit();

const launchChrome = true;
const waitTimeout = 20*1000;
var onRequest = (req) => {
  if(req.request.url.indexOf('m3u8') != -1) {
    console.log(req.request.url);
    //process.exit();
  }
  return null;
}

var c = new Chromeless({launchChrome, function(){}, waitTimeout}) 
  .setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36.11')
  .goto(url)
  .wait(5*1000)
  .click('#download_div')
  .wait(2*1000)
  .evaluate(() => {
    var links = [];
    $('a').map((i, e) => {
      if(!e || !e.href || e.href.indexOf('verystream') == -1) return;
      links.push(e.href);
    })
    return links;
  })
  //.screenshot({filePath: './screen.png'})
  .end()
  .then(links => links.map(getVideo))
  .catch(console.error);

function getVideo(link) {
  var hex = link.split('vid=')[1],
    bytes = [],
    str;
  hex = hex['split']('')['reverse']()['join']('');
  for (var i = 0; i < hex['length'] - 1; i += 2) {
    bytes['push'](parseInt(hex['substr'](i, 2), 16))
  }
  str = String['fromCharCode']['apply'](String, bytes);
  hex = atob(str);
  console.log(hex);
}

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}
