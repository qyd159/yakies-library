import 计数器 from '../../src/图形/计数器';
import { pruneEmpty, stripFromSchema } from '../../src';
import { 从PG解析教具指令 } from 'aid-editor/src/pg2instructions';
const { aitParse } = require('@yakies/third-lib');

declare const __html__: any;
let instructions;
describe('计数器', () => {
  before((done) => {
    let html = '';
    const document = new DOMParser().parseFromString(__html__.计数器, 'text/html');
    $('tbody > tr', document).each(function (index) {
      const fragment = $('td', this).eq(3);
      fragment.children().each(function () {
        if (this.tagName === 'P' || this.tagName === 'DIV') {
          const li = document.createElement('li');
          this.parentNode.replaceChild(li, this);
          li.append(...this.childNodes);
        }
      });
      html += `<li><p>【具】计数器_${index}</p><ol>${fragment.html()}</ol></li>`;
    });
    html = `${html}`;

    instructions = 从PG解析教具指令(aitParse(html));
    done();
  });
  it('渲染计数器', async () => {
    for (let key in instructions) {
      const htmlRoot = document.createElement('div') as HTMLDivElement;
      htmlRoot.style.width = '1000px';
      document.body.append(htmlRoot);
      const 图形参数 = pruneEmpty(stripFromSchema(计数器.viewSchema, instructions[key][0].params.语义布局.线段与数轴队列[0]));
      try {
        await new 计数器(图形参数).渲染({ htmlRoot });
      } catch (e) {
        console.error(decodeURI(e.stack.replace(/http\:\/\/localhost\:9876\/base\//g, '').replace(/\?(.*?)(?=:)/g, '')));
        throw new Error('fatal err');
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });
});
