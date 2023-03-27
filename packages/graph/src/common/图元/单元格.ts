import { 基本图元, 可竖排文本 as 标签 } from '../图元';
import 基本图形 from '../图形';
import { Position, 强调级别 } from '../../consts/enums';
import { parsePositionStrings } from '../../utils';
import { map } from 'lodash-es';

// 单元格
export default class 单元格 extends 基本图元 {
  data: 单元格定义;
  element: SVGGraphicsElement;
  dimensions: [number, number];
  内容: 标签;
  尺寸: [number, number];
  children?: 单元格[];
  container?: HTMLTableDataCellElement;
  内容定位?: keyof typeof Position;
  边框样式?: 边框样式;

  constructor(单元格定义: 单元格定义, 图形: 基本图形, options?: { container: HTMLTableDataCellElement; size: [number, number]; 边框样式?: 边框样式 }) {
    super(单元格定义, 图形);
    this.内容 = new 标签({ name: 单元格定义.content }, 图形, this.图形.定义内容样式 && this.图形.定义内容样式(单元格定义));
    this.内容定位 = this.图形.内容定位 && this.图形.内容定位(单元格定义);
    this.container = options?.container;
    this.尺寸 = options?.size;
    this.边框样式 = options?.边框样式;
    if (单元格定义.children && 单元格定义.children.length > 0) {
      this.children = [];
      for (const child of 单元格定义.children) {
        if (单元格定义.是否表头) {
          child.是否表头 = true;
        }
        this.children.push(new 单元格(child, 图形, options));
      }
    }
  }

  async 渲染(container: HTMLTableDataCellElement = this.container) {
    this.内容.渲染().then((内容) => {
      内容.wrapper.style.position = 'static';
      container.append(内容.wrapper);
      if (this.尺寸) {
        const [width, height] = this.尺寸;
        container.style.width = width + 'px';
        container.style.height = height + 'px';
        // container.style.display = "inline-block"
      }
      if (this.内容定位) {
        const [verticalAlign, textAlign] = parsePositionStrings(this.内容定位);
        container.style.textAlign = textAlign;
        container.style.verticalAlign = verticalAlign;
      }
      if (this.图形.强调级别) {
        const 强调级别 = this.图形.强调级别(this);
        if (强调级别 === 2) {
          container.style.backgroundColor = 'rgba(81, 160, 255, 0.64)';
        } else if (强调级别 === 1) {
          container.style.backgroundColor = 'rgba(81, 160, 255, 0.2)';
        }
      }

      if (this.边框样式) {
        map(this.边框样式, (value, key) => {
          container.style[key] = value;
        });
      }
    });
    return this;
  }
}
