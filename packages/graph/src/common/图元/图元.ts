import { getNextId } from '../../utils';
import 基本图形 from '../图形';
import { Position } from '../../consts/enums';
import { merge } from 'lodash-es';
import debug from 'debug';
const log = debug('图元');
class 基本图元 {
  data: GraphNode;
  id: string;
  name: string;
  element: Element & ElementCSSInlineStyle;
  placeBottom: boolean;
  // 定位方式
  position: Position = Position.middleCenter;
  outline: SVGGraphicsElement;
  hidden: boolean;
  图形: 基本图形;
  constructor(data, 图形: 基本图形, options?: { position?: Position; hidden?: boolean }) {
    this.data = data;
    if (!data.id) this.id = getNextId();
    else this.id = data.id;
    this.name = data.name;
    this.placeBottom = data.placeBottom || false;
    if (options) {
      const { position, hidden } = options;
      merge(this, { position, hidden });
    }
    this.图形 = 图形;
  }
  async 渲染(container) {
    if (this.placeBottom) {
      container.insertBefore(this.element, container.childNodes[0] || null);
    } else {
      container.append(this.element);
    }
    if (this.hidden) {
      this.element.style.visibility = 'hidden';
    }
    await this.布局后处理();
    return this;
  }

  // 这种定位方式针对多种图元有效
  定位(x, y?, position?: Position) {
    if (!this.element) {
      log('调用渲染方法后才能定位图元');
      return;
    }
    if (typeof y === 'undefined') {
      const position = x.split(',');
      x = +position[0];
      y = +position[1];
    }
    if (typeof position !== 'undefined') {
      this.position = position;
    }
    const { top: top1, left: left1 } = this.图形.svgRoot.getBoundingClientRect();
    const { width, height, top: top2, left: left2 } = this.element.getBoundingClientRect();
    let calculatedX = x,
      calculatedY = y;
    switch (this.position || position) {
      case Position.topCenter:
        calculatedX = x - width / 2;
        break;
      case Position.topRight:
        calculatedX = x - width;
        break;
      case Position.middleLeft:
        calculatedY = y - height / 2;
        break;
      case Position.middleCenter:
        calculatedY = y - height / 2;
        calculatedX = x - width / 2;
        break;
      case Position.middleRight:
        calculatedX = x - width;
        calculatedY = y - height / 2;
        break;
      case Position.bottomLeft:
        calculatedY = y - height;
        break;
      case Position.bottomCenter:
        calculatedY = y - height;
        calculatedX = x - width / 2;
        break;
      case Position.bottomRight:
        calculatedX = x - width;
        calculatedY = y - height;
        break;
      default:
        break;
    }
    // TODO: 如果this.element不是g元素，则要考虑其它定位方式，如果不是相对于画布定位，这里也要重新计算
    this.element.setAttribute('transform', `translate(${calculatedX},${calculatedY})`);
    if (this.outline) {
      this.图形.frontContainer.append(this.outline);
      let outlineY = top2 - top1 + calculatedY;
      const { height: outlineHeight } = this.outline.getBBox();
      switch (this.position) {
        case Position.middleLeft:
        case Position.middleCenter:
        case Position.middleRight:
          outlineY -= outlineHeight / 2 - height / 2;
          break;
        case Position.bottomLeft:
        case Position.bottomCenter:
        case Position.bottomRight:
          outlineY -= outlineHeight - height;
          break;
        default:
          break;
      }
      this.outline.setAttribute('x', (left2 - left1 + calculatedX).toString());
      this.outline.setAttribute('y', outlineY.toString());
    }
  }
  async 布局后处理() {}
}

export { 基本图元 };
