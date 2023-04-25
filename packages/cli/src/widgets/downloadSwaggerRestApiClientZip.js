const generatorUrl = 'https://generator3.swagger.io/api/generate';
const Axios = require('axios').default;
const fs = require('fs-extra');
const extract = require('extract-zip');
const path = require('path');
const normalizeApiFile = require('./normalizeApiFile');
const os = require('os');

const swaggerJSONUrl =
  // 'http://dialoguex-backend.px-dialogue.dev.dm-ai.cn/v1/dialogue-backend/v2/api-docs';
  'http://localhost:3100/swagger.json';
// "http://rdac.dm-ai.cn/swagger.json"

const exec = async args => {
  const { data: spec } = await Axios.get(swaggerJSONUrl, {
    responseType: 'json'
  });

  delete spec.swagger;
  spec.openapi = '3.0.0';

  const res = await Axios.post(
    generatorUrl,
    {
      spec,
      lang: 'javascript',
      type: 'CLIENT'
    },
    {
      responseType: 'stream'
    }
  );
  fs.ensureDirSync(path.join(process.cwd(), 'tmp'));
  fs.emptyDirSync(path.join(process.cwd(), 'tmp'));
  const writer = fs.createWriteStream(
    path.join(process.cwd(), 'tmp/javascriptClient.zip')
  );
  res.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  // process.on('uncaughtException', (err, origin) => {
  //   fs.writeSync(
  //     process.stderr.fd,
  //     `捕获的异常: ${err}\n` + `异常的来源: ${origin}`
  //   );
  // });

  try {
    await extract(path.join(process.cwd(), 'tmp/javascriptClient.zip'), {
      dir: path.join(process.cwd(), 'tmp/source')
    });
  } catch (err) {
    // handle any errors
    console.log(err);
  }
  normalizeApiFile(
    {},
    {
      cwd: path.join(process.cwd(), 'tmp/source/src/api'),
      outputDir: path.join(process.cwd(), 'tmp/output/apiFiles')
    }
  );
};

module.exports = exec;

exec();
