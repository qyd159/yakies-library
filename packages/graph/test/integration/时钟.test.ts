import 时钟图形 from '../../src/图形/时钟';
import { pruneEmpty, stripFromSchema } from '../../src';
import { 从PG解析教具指令 } from 'aid-editor/src/pg2instructions';
const { aitParse } = require('@yakies/third-lib');

declare const __html__: any;
let instructions;
describe('时钟', () => {
  before((done) => {
    // let html = ''
    // const document = new DOMParser().parseFromString(__html__.a, 'text/html')
    // $('tbody > tr', document).each(function (index) {
    //     const fragment = $('td', this).eq(3)
    //     fragment.children().each(function () {
    //         if (this.tagName === 'P' || this.tagName === 'DIV') {
    //             const li = document.createElement('li')
    //             this.parentNode.replaceChild(li, this)
    //             li.append(...this.childNodes)
    //         }
    //     })
    //     html += `<li><p>【具】时钟_${index}</p>${fragment.html()}</li>`
    // })
    // html = `${html}`
    // console.log(html)
    instructions = 从PG解析教具指令(aitParse(__html__.时钟));
    done();
  });
  it('渲染时钟', async () => {
    const htmlRoot = document.createElement('div') as HTMLDivElement;
    document.body.append(htmlRoot);
    for (let key in instructions) {
      const htmlRoot = document.createElement('div') as HTMLDivElement;
      document.body.append(htmlRoot);
      const 图形参数 = pruneEmpty(stripFromSchema(时钟图形.viewSchema, instructions[key][0].params.语义布局.线段与数轴队列[0]));
      try {
        let 时钟例子 = await new 时钟图形(图形参数);
        时钟例子.渲染({ htmlRoot });
      } catch (e) {
        console.error(decodeURI(e.stack.replace(/http\:\/\/localhost\:9876\/base\//g, '').replace(/\?(.*?)(?=:)/g, '')));
        throw new Error('fatal err');
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });
});
