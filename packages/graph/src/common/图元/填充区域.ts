import { 基本图元 } from './图元';
import { createSVGNode, getScale, getCanvasOffset } from '../../utils';

export default class 填充区域 extends 基本图元 {
    pathD: string;
    fill: string = 'none';
    constructor(data, 图形) {
        super(data, 图形);
        this.pathD = data.pathD;
        this.fill = data.fill;
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('path');
        this.element.setAttribute('d', this.pathD);
        this.element.setAttribute('stroke-width', '2');
        this.element.setAttribute('fill', this.fill || 'rgba(81, 160, 255, 0.65)');
        return super.渲染(container);
    }
}
