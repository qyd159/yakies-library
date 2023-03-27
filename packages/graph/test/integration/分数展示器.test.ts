import 分数展示器 from '../../src/图形/分数展示器';
import { pruneEmpty, stripFromSchema } from '../../src';
import { 从PG解析教具指令 } from 'aid-editor/src/pg2instructions';
const { aitParse } = require('@yakies/third-lib');
declare const __html__: any;
let instructions;
describe('分数展示器', () => {
  before((done) => {
    // let html = ''
    // const document = new DOMParser().parseFromString(__html__.分数展示器, 'text/html')
    // $('tbody > tr', document).each(function (index) {
    //     const fragment = $('td', this).eq(3)∏
    //     fragment.children().each(function () {
    //         if (this.tagName === 'P' || this.tagName === 'DIV') {
    //             const li = document.createElement('li')
    //             this.parentNode.replaceChild(li, this)
    //             li.append(...this.childNodes)
    //         }
    //     })
    //     html += `<li><p>【具】分数展示器_${index}</p><ol>${fragment.html()}</ol></li>`
    // })
    // html = `${html}`
    // console.log(html)
    instructions = 从PG解析教具指令(aitParse(__html__.分数展示器));
    done();
  });
  it('渲染分数展示器', async () => {
    const htmlRoot = document.createElement('div') as HTMLDivElement;
    document.body.append(htmlRoot);
    for (let key in instructions) {
      const htmlRoot = document.createElement('div') as HTMLDivElement;
      document.body.append(htmlRoot);
      const 教具参数 = pruneEmpty(stripFromSchema(分数展示器.viewSchema, instructions[key][0].params.语义布局.线段与数轴队列[0]));
      console.log(教具参数);
      教具参数.动画 = {};
      教具参数.动画.type = 2;
      教具参数.动画.动画 = 教具参数.分数表格[0].列数 === 10 ? true : false;
      教具参数.动画.算式 = '<p><math xmlns="http://www.w3.org/1998/Math/MathML"><mn>4</mn><msup><mi>x</mi><mrow><mn>2</mn></mrow></msup><mo>−</mo><mn>1</mn><mo>=</mo><mn>0</mn></math></p>';
      教具参数.分数表格[0].概括集[0].formula = 1;
      教具参数.分数表格[0].概括集[1].formula = 2;
      教具参数.分数表格[0].概括集.push({
        位置: '下',
        偏移: 0,
        内容: '<math xmlns="http://www.w3.org/1998/Math/MathML"> <mfrac> <mn> 2 </mn> <mn> 10 </mn> </mfrac> </math>',
        内容富文本: [
          '<svg style="vertical-align: -0.816ex" xmlns="http://www.w3.org/2000/svg" width="2.595ex" height="2.773ex" role="img" focusable="false" viewBox="0 -864.9 1147.1 1225.5" aria-hidden="true"><g stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g data-mml-node="math"><g data-mml-node="mfrac"><g data-mml-node="mn" transform="translate(396.8,394) scale(0.707)"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path></g><g data-mml-node="mn" transform="translate(220,-345) scale(0.707)"><path data-c="31" d="M213 578L200 573Q186 568 160 563T102 556H83V602H102Q149 604 189 617T245 641T273 663Q275 666 285 666Q294 666 302 660V361L303 61Q310 54 315 52T339 48T401 46H427V0H416Q395 3 257 3Q121 3 100 0H88V46H114Q136 46 152 46T177 47T193 50T201 52T207 57T213 61V578Z"></path><path data-c="30" d="M96 585Q152 666 249 666Q297 666 345 640T423 548Q460 465 460 320Q460 165 417 83Q397 41 362 16T301 -15T250 -22Q224 -22 198 -16T137 16T82 83Q39 165 39 320Q39 494 96 585ZM321 597Q291 629 250 629Q208 629 178 597Q153 571 145 525T137 333Q137 175 145 125T181 46Q209 16 250 16Q290 16 318 46Q347 76 354 130T362 333Q362 478 354 524T321 597Z" transform="translate(500,0)"></path></g><rect width="907.1" height="60" x="120" y="220"></rect></g></g></g></svg>',
        ],
        宽度: 2,
        formula: 3,
      });
      console.log(教具参数);
      try {
        let a = await new 分数展示器(教具参数);
        a.渲染({ htmlRoot });
        let button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.value = '下一步动画';
        htmlRoot.appendChild(button);
        if (教具参数.type === 3) {
          button.onclick = a.分数乘法.bind(a);
        } else if (教具参数.type === 1) {
          button.onclick = a.分数加法.bind(a);
        } else {
          button.onclick = a.分数减法.bind(a);
        }
        console.log(a);
      } catch (e) {
        console.error(decodeURI(e.stack.replace(/http\:\/\/localhost\:9876\/base\//g, '').replace(/\?(.*?)(?=:)/g, '')));
        throw new Error('fatal err');
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });
});
