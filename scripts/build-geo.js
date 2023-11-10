require('dotenv').config();
const fs = require('fs');
const path = require('path');
const http = require('http');
const zlib = require('zlib');
const tar = require('tar');

let url =
  'http://raw.githubusercontent.com/GitSquared/node-geolite2-redist/master/redist/GeoLite2-Country.tar.gz';

if (process.env.MAXMIND_LICENSE_KEY) {
  url =
    `https://download.maxmind.com/app/geoip_download` +
    `?edition_id=GeoLite2-Country&license_key=${process.env.MAXMIND_LICENSE_KEY}&suffix=tar.gz`;
}

const dest = path.resolve(__dirname, '../public/geo');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest);
}

const options = {
  host: process.env.HTTP_PROXY_URL,
  port: process.env.HTTP_PROXY_PORT,
  path: url,
  headers: {
    Host: process.env.HTTP_PROXY_URL,
    'Accept-Encoding': 'gzip',
  },
};

const download = () =>
  new Promise(resolve => {
    http.get(options, res => {
      resolve(res.pipe(zlib.createGunzip()).pipe(tar.t()));
    });
  });

download().then(
  res =>
    new Promise((resolve, reject) => {
      res.on('entry', entry => {
        if (entry.path.endsWith('.mmdb')) {
          const filename = path.join(dest, path.basename(entry.path));
          entry.pipe(fs.createWriteStream(filename));

          console.log('Saved geo database:', filename);
        }
      });

      res.on('error', e => {
        reject(e);
      });
      res.on('finish', () => {
        resolve();
      });
    }),
);
