const handleHtml = require('../src/lib/util').handleHtml;
const fs = require('fs-extra');
const path = require('path');
const html = fs.readFileSync(
  path.join(__dirname, '../../editor/public/index.html')
);

global.wwwFileMap = {
  proxy: {
    target: 'http://localhost:8080/',
    baseApi: '/v1',
    name: 'px-dialog-frontend',
    description: '对话流平台'
  },

};

handleHtml(html);
