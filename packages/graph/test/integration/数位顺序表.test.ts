import 数位顺序表 from '../../src/图形/数位顺序表';
import { 从PG解析教具指令 } from 'aid-editor/src/pg2instructions';
import { toPairs } from 'lodash-es';
const { aitParse } = require('@yakies/third-lib');

const pgFormatter = require('ait-pg-formatter');
const { Html2Eaog } = require('html-to-eaog');
declare const __html__: any;
let instructions;
describe('数位顺序表', () => {
  before((done) => {
    // let html = ''
    // const document = new DOMParser().parseFromString(__html__.数位顺序表, 'text/html')
    // $('tbody > tr', document).each(function (index) {
    //     const fragment = $('td', this).eq(1).html()
    //     html += `<li><p>【具】数位顺序表_${index}</p>${fragment}</li>`
    // })
    // html = `<ol>${html}</ol>`
    // console.log(html)
    instructions = 从PG解析教具指令(aitParse(__html__.数位顺序表));
    done();
  });
  it('渲染数位顺序表', async () => {
    // 先以数位顺序表为例子 https://wiki.dm-ai.cn/x/UIU6E
    for (let key in instructions) {
      const htmlRoot = document.createElement('div') as HTMLDivElement;
      document.body.append(htmlRoot);
      const 图形参数 = instructions[key][0].params.语义布局.线段与数轴队列[0];
      await new 数位顺序表(图形参数).渲染({ htmlRoot });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  });
});
