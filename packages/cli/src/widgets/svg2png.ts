import { svg2png, initialize } from 'svg2png-wasm';
// const { svg2png, initialize } = require('svg2png-wasm');
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export default async function (args) {
  await initialize(readFileSync(path.join(__dirname, '../../node_modules/svg2png-wasm/svg2png_wasm_bg.wasm')));
  let width = 1024,height=1024;
  if(args.size){
    [width,height] = args.size.split(',')
  }
  /** @type {Uint8Array} */
  const png = await svg2png(readFileSync(path.join(process.cwd(), args.f)).toString(), {
    // scale: 2, // optional
    width, // optional
    height, // optional
  });
  writeFileSync(args.o || './output.png', png);
}
