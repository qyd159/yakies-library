import { 可竖排文本 as 标签, 基本图元 } from '../图元';
import { createSVGNode } from '../../utils';
import { Position } from '../../consts/enums';

type 概括位置 = '上' | '下' | '左' | '右';

interface 概括定义 extends GraphNode {
  位置: 概括位置;
  起点: position;
  终点: position;
  内容: string;
  隐藏?: boolean;
  前缀?: string;
  动画?: boolean;
  formula: number;
}

const positions = {
  上: Position.bottomCenter,
  下: Position.topCenter,
  左: Position.middleRight,
  右: Position.middleLeft,
};

class 概括 extends 基本图元 {
  static braceHeight = 6;
  data: 概括定义;
  element: SVGGraphicsElement;
  内容: 标签;
  private pathD: string;

  constructor(data: 概括定义, 图形, options?) {
    super(data, 图形, options);
    if (data.内容) {
      this.内容 = new 标签({ name: data.内容 }, this.图形, {
        position: positions[this.data.位置],
        height: options && options.textHeight,
        fontSize: 16,
        竖排: options && options.竖排文本,
        color: this.data.动画 ? 'rgba(81, 160, 255)' : 'rgba(0, 0, 0, 0.85)',
      });
    }
  }

  async 渲染(container = this.图形.container) {
    this.element = createSVGNode('g');
    container.append(this.element);
    const { x: x1, y: y1 } = this.data.起点;
    const { x: x2, y: y2 } = this.data.终点;
    const 向上 = this.data.位置 === '上';
    const 向左 = this.data.位置 === '左';
    const braceHeight = 概括.braceHeight;
    if (this.内容) {
      await this.内容.渲染(this.element);
    }
    let reverse, startpoint, midpoint: [number, number], endpoint;
    switch (this.data.位置) {
      case '上':
      case '下':
        let y = y1;
        reverse = 向上 ? 1 : -1;
        startpoint = [x1, y];
        midpoint = [(x1 + x2) / 2, y - braceHeight * reverse];
        endpoint = [x2, y];
        this.pathD = `M${startpoint[0]},${startpoint[1]}Q${startpoint[0]},${startpoint[1] - braceHeight * reverse} ${startpoint[0] + braceHeight},${startpoint[1] - braceHeight * reverse} L${midpoint[0] - braceHeight}, ${midpoint[1]} Q${
          midpoint[0]
        }, ${midpoint[1]} ${midpoint[0]}, ${midpoint[1] - braceHeight * reverse}Q${midpoint[0]}, ${midpoint[1]} ${midpoint[0] + braceHeight}, ${midpoint[1]}L${endpoint[0] - braceHeight}, ${endpoint[1] - braceHeight * reverse}Q${
          endpoint[0]
        }, ${endpoint[1] - braceHeight * reverse}, ${endpoint[0]}, ${endpoint[1]}`;
        this.内容 && this.内容.定位(midpoint[0], midpoint[1] - braceHeight * reverse);
        break;
      case '左':
      case '右':
        reverse = 向左 ? 1 : -1;
        startpoint = [向左 ? x2 : x1, y1];
        midpoint = [向左 ? x2 - braceHeight * 2 : x1 + braceHeight * 2, (y1 + y2) / 2];
        endpoint = [向左 ? x2 : x1, y2];
        this.pathD = `M${startpoint[0]},${startpoint[1]}Q${startpoint[0] - braceHeight * reverse},${startpoint[1]},${startpoint[0] - braceHeight * reverse},${startpoint[1] + braceHeight}L${midpoint[0] + reverse * braceHeight},${
          midpoint[1] - braceHeight
        }Q${midpoint[0] + braceHeight * reverse},${midpoint[1]},${midpoint[0]},${midpoint[1]}Q${midpoint[0] + braceHeight * reverse},${midpoint[1]},${midpoint[0] + reverse * braceHeight},${midpoint[1] + braceHeight}L${
          midpoint[0] + reverse * braceHeight
        },${endpoint[1] - braceHeight}Q${endpoint[0] - braceHeight * reverse},${endpoint[1]},${endpoint[0]},${endpoint[1]}`;
        this.内容 && this.内容.定位(...midpoint);
        break;
      default:
        break;
    }
    const path = createSVGNode('path');
    path.setAttribute('d', this.pathD);
    path.setAttribute('stroke', this.data.动画 ? 'rgba(81, 160, 255, 0.64)' : 'rgba(196, 196, 196, 1)');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('fill', 'none');
    this.element.append(path);
    // if(this.data.隐藏){
    //     this.element.style.opacity = '0';
    // }
    return super.渲染(container);
  }
}

export { 概括, 概括定义 };
