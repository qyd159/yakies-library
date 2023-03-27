import * as chai from 'chai';
import { 图形集, createSVGNode } from '../../src';
const { 韦恩图 } = 图形集;
const pgFormatter = require('ait-pg-formatter');
const { Html2Eaog } = require('html-to-eaog');
declare const __html__: any;
const { aitParse } = require('@yakies/third-lib');

let pg;
describe('韦恩图', () => {
  before((done) => {
    pg = aitParse(__html__.韦恩图);
    done();
  });
  it('渲染韦恩图图形', async () => {
    const htmlRoot = document.createElement('div') as HTMLDivElement;
    document.body.append(htmlRoot);
    const 图形 = new 韦恩图(pg.node.children[2].children[0].children[1].children[0].语义布局.线段与数轴队列[0]);
    const limitedWidth = 375;
    const dimensions = await 图形.渲染({ htmlRoot });
    if (limitedWidth && dimensions[0] && limitedWidth < dimensions[0]) {
      图形.svgRoot.style.position = 'relative';
      图形.svgRoot.style.left = `-${(dimensions[0] - limitedWidth) / 2}px`;
    }
    return;
  });
});
