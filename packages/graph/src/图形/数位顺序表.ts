import 基本图形 from '../common/图形';
import { dslSchema, viewSchema } from '../schemas/数位顺序表';
import { 表格 } from '../common/组合图元';

const themes = {
  light: {
    文本: 'rgba(0, 0, 0, 0.85)',
    文本强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(0, 0, 0, 0.45)',
    线框强调: 'rgba(81, 160, 255, 1)',
  },
  dark: {
    文本: '#fff',
    强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(255, 255, 255, 0.45)',
    线框强调: 'rgba(81, 160, 255, 1)',
  },
};

const 非竖排内容 = ['...', '整数部分', '小数点', '小数部分', '亿级', '万级', '个级'];

export default class 数位顺序表图形 extends 基本图形 {
  static 类名 = '数位顺序表图形';
  static dslSchema = dslSchema;
  static viewSchema = viewSchema;
  隐藏布局过程 = true;
  表格图元: 表格;
  get theme() {
    return themes[this.主题];
  }
  get 布局图元集() {
    return [this.表格图元];
  }
  get 图元集() {
    return [this.表格图元];
  }
  constructor(data) {
    super(data);
    this.表格图元 = new 表格(data.表格, this);
  }
  定义内容样式(cell: 单元格定义) {
    const 单元格内容样式: 标签内容样式 = { 竖排: true };
    if (非竖排内容.includes(cell.content)) {
      单元格内容样式.竖排 = false;
    }
    if (cell.是否表头) {
      if (!cell.children || cell.children.length === 1) {
        单元格内容样式.width = 19;
      }
      单元格内容样式.padding = '4px 0';
    } else {
      单元格内容样式.padding = '10px 0';
    }
    if (cell.content === '数级') {
      单元格内容样式.width = 26;
    }
    单元格内容样式.color = this.theme.文本;
    if (cell.是否强调) {
      单元格内容样式.color = 'rgba(249, 144, 25, 1)';
    }
    return 单元格内容样式;
  }
  内容定位(cell: 单元格定义) {
    if (非竖排内容.includes(cell.content)) {
      return 'middleCenter';
    }
  }
  async 布局(limitedWidth) {
    this.htmlRoot.style.position = 'relative';
    const { height } = this.htmlContainer.getBoundingClientRect();
    return {
      dimensions: [limitedWidth, height + 40],
    };
  }
  async 布局后处理() {
    const { top, width, left, height } = this.svgRoot.getBoundingClientRect();
    const { top: top2, left: left2 } = this.htmlRoot.getBoundingClientRect();
    const { width: 表格宽度, height: 表格高度 } = this.表格图元.element.getBoundingClientRect();
    this.表格图元.element.style.position = 'absolute';
    this.表格图元.element.style.left = left - left2 + width / 2 - 表格宽度 / 2 + 'px';
    this.表格图元.element.style.top = top - top2 + height / 2 - 表格高度 / 2 + 'px';
    super.布局后处理();
  }
}
