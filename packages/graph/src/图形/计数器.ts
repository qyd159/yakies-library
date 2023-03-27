import 基本图形 from '../common/图形';
import { dslSchema, viewSchema } from '../schemas/计数器';
import { 线, 椭圆, 文本 } from '../common/图元';
import { 表格 } from '../common/组合图元';
import { flatten } from 'lodash-es';
import { numberToChNumber } from '../utils';

const themes = {
  light: {
    文本: 'rgba(0, 0, 0, 0.85)',
    文本强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(81, 160, 255, 1)',
    线框强调: 'rgba(81, 160, 255, 1)',
  },
  dark: {
    文本: '#fff',
    强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(81, 160, 255, 1)',
    线框强调: 'rgba(81, 160, 255, 1)',
  },
};

const 线长 = 116;
const ellipticity = 6 / 11;
const radius = 11;
export default class 计数器图形 extends 基本图形 {
  static 类名 = '计数器图形';
  static dslSchema = dslSchema;
  static viewSchema = viewSchema;
  隐藏布局过程 = true;
  表格图元集: 表格[];
  线集: 线[][] = [];
  表格定位: Map<string, rect> = new Map();
  get theme() {
    return themes[this.主题];
  }
  get 布局图元集() {
    return [...this.表格图元集, ...flatten(this.线集)];
  }
  get 图元集() {
    return this.表格图元集;
  }
  constructor(data) {
    super(data);
    this.表格图元集 = data.表格集.map((计数器表格参数) => {
      this.线集.push(Array.from({ length: 计数器表格参数.表体[0].length }).map(() => new 线({}, this)));
      return new 表格(this.是否隐藏数字 ? { ...计数器表格参数, 表体: 计数器表格参数.表体.slice(0, 1) } : 计数器表格参数, this);
    });
  }
  定义内容样式(cell: 单元格定义) {
    const 单元格内容样式: 标签内容样式 = {};
    单元格内容样式.padding = '8px 5px';
    单元格内容样式.color = this.theme.文本;
    return 单元格内容样式;
  }
  强调级别() {
    return 1;
  }
  async 布局(limitedWidth) {
    let maxWidth = 0,
      maxHeight = 0;
    this.表格图元集.forEach((表格, index) => {
      const { width, height } = 表格.element.getBoundingClientRect();
      this.表格定位.set(表格.id, { width, height });
      if (index > 0) {
        maxWidth += width + 27;
      } else {
        maxWidth += width;
      }
      maxHeight = Math.max(maxHeight, height);
    });
    let 中间符号图元;
    if (this.中间符号) {
      中间符号图元 = await new 文本({ name: this.中间符号 }, this, { fontSize: 14, color: this.theme.文本 }).渲染();
    }
    let offsetX = (limitedWidth - maxWidth) / 2;
    this.表格图元集.reduce((offsetX, 表格, index) => {
      const { width, height } = this.表格定位.get(表格.id);
      this.表格定位.set(表格.id, { width, height, x: offsetX, y: 线长 + 18 });
      // 线定位
      const 偏移单位 = width / this.线集[index].length;
      this.线集[index].forEach((线, rowIndex) => {
        const x = offsetX + 偏移单位 / 2 + rowIndex * 偏移单位;
        线.重定位(x, 20, x, 线长 + 20);
        const num = +this.表格集[index].表体[1][rowIndex].content ?? 0;
        for (let i = 0; i < num; i++) {
          new 椭圆({ radius, ellipticity, x, y: 线长 + 20 - (1 + 2 * i) * radius * ellipticity, fill: '#8EC1FF' }, this).渲染();
        }
      });
      let spacingWidth = 27;
      if (中间符号图元) {
        spacingWidth = 中间符号图元.element.getBBox().width + 18;
        中间符号图元.定位(limitedWidth / 2, 20 + 线长 + height / 2);
      }
      return offsetX + spacingWidth + width;
    }, offsetX);

    if (this.显示读写 && this.表格图元集.length === 1) {
      await new 文本({ name: numberToChNumber(+this.表格图元集[0].表体[1].map((单元格) => 单元格.data.content).join('')) }, this, { fontSize: 14 }).渲染().then((文本) => {
        文本.定位(offsetX + this.表格定位.get(this.表格图元集[0].id).width / 2, 线长 + maxHeight + 35);
      });
      await new 文本({ name: '写作' }, this, { fontSize: 14, color: '#51A0FF' }).渲染().then((文本) => {
        文本.定位(offsetX - 30, 线长 + maxHeight - 8);
      });
      await new 文本({ name: '读作' }, this, { fontSize: 14, color: '#51A0FF' }).渲染().then((文本) => {
        文本.定位(offsetX - 30, 线长 + maxHeight + 35);
      });
    }
    return {
      dimensions: [limitedWidth, maxHeight + (this.显示读写 ? 14 : 0) + 线长 + 40],
    };
  }
  async 布局后处理() {
    this.表格图元集.forEach((表格) => {
      表格.element.style.position = 'absolute';
    });
    this.htmlRoot.style.position = 'relative';
    const { top: rTop, left: rLeft } = this.htmlRoot.getBoundingClientRect();
    const { top, left } = this.container.getBoundingClientRect();
    for (const 表格 of this.表格图元集) {
      const 表格位置 = this.表格定位.get(表格.id);
      表格.定位(表格位置.x + left - rLeft, 表格位置.y + top - rTop);
    }
    super.布局后处理();
  }
}
