const fs = require('fs');

const stream = fs.createReadStream('./text.txt', {encoding: 'utf8'});
stream.pipe(process.stdout);