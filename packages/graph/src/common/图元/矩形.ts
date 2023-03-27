import { 基本图元 } from '../图元';
import { createSVGNode, getScale, getCanvasOffset } from '../../utils';
import { NS } from '../../consts/namespaces';

class 矩形 extends 基本图元 {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    constructor(data, 图形) {
        super(data, 图形);
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.width = data.width || 5;
        this.height = data.height || 5;
        this.fill = data.fill || 'none';
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('ellipse');
        this.element.setAttribute('x', this.x.toString());
        this.element.setAttribute('y', this.y.toString());
        this.element.setAttribute('width', this.width.toString());
        this.element.setAttribute('height', this.height.toString());
        this.element.setAttribute('fill', this.fill);
        this.element.setAttribute('stroke-width', '2');
        this.element.setAttribute('stroke', 'rgba(81, 160, 255, 1)');
        container.append(this.element);
        return this;
    }
}

export default 矩形;
