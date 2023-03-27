const _ = require('../lib/util');
const path = require('path');
const fs = require('fs-extra');
async function run(args, options = {}) {
  let toConvertFiles;
  if (!args.f) {
    const files = _.getAllFiles(
      '.',
      ['index.ts', 'baseApi.ts'],
      '.js',
      options
    );
    toConvertFiles = files.filter(file => !file.dir).map(file => file.path);
  } else {
    toConvertFiles = [args.f];
  }
  if (toConvertFiles) {
    toConvertFiles.forEach(file => {
      const filePath = path.join(options.cwd || process.cwd(), file);
      let fileContent = fs.readFileSync(filePath).toString();
      let className;
      fileContent = fileContent
        .replace(
          'import ApiClient from "../ApiClient";',
          "import BaseApi from './baseApi';"
        )
        .replace(/export default class (.*?) {/, ($0, $1) => {
          className = $1;
          return `class ${$1} extends BaseApi {`;
        })
        .replace(/constructor\(((.|\n)*?)\}/, () => {
          return 'constructor(){super(null);}';
        })
        .replace(
          /pathParams,\s+queryParams,\s+headerParams,\s+formParams,\s+postBody,\s+authNames,\s+contentTypes,\s+accepts,\s+returnType,\s+callback/g,
          () => {
            return 'pathParams, queryParams, formParams, postBody, contentTypes';
          }
        )
        .replace(/let headerParams = {((.|\n)*?)};\n?/g, '')
        .replace(/let authNames = \[((.|\n)*?)\];/g, '')
        .replace(/let accepts = \[((.|\n)*?)\];/g, '')
        .replace(/let returnType = null;/g, '')
        .replace(/\(,\scallback/g, '(postBody')
        .replace(/,\s+,\s+callback/g, 'id, postBody')
        .replace(/'id':/g, 'id')
        .replace(/,\s+opts,\s+callback/g, 'queryParams')
        .replace(/let\s+queryParams\s+=\s+{\s+'current':((.|\n)*?)};/g, '')
        .replace(/opts\s+\=\s+opts\s+\|\|\s+{};/g, '')
        .replace(/let postBody = null;/g, '')
        .replace(/\n\s+(let)\s+/g, ($0, $1) => {
          return $0.replace($1, 'const');
        });

      fileContent = fileContent + `\nexport default new ${className}()`;

      fs.outputFileSync(
        path.join(
          options.outputDir || path.dirname(filePath),
          path.basename(filePath,'.js') + '.ts'
        ),
        fileContent
      );
    });
  }
}

// run({}, { cwd: 'D:/downloads/javascript-client-generated (4)/src/api' });

module.exports = run;
