import { 基本图元 } from './图元';
import { createSVGNode, getScale, getCanvasOffset } from '../../utils';
import { NS } from '../../consts/namespaces';
import { ellipticity } from '../../consts/geometry';

class 椭圆 extends 基本图元 {
    x: number;
    y: number;
    radius: number;
    fill: string;
    ellipticity: number;
    constructor(data, 图形) {
        super(data, 图形);
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.radius = data.radius || 5;
        this.fill = data.fill || 'none';
        this.ellipticity = data.ellipticity || ellipticity;
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('ellipse');
        this.element.setAttribute('cx', this.x.toString());
        this.element.setAttribute('cy', this.y.toString());
        this.element.setAttribute('rx', this.radius.toString());
        this.element.setAttribute('ry', (this.radius * this.ellipticity).toString());
        this.element.setAttribute('fill', this.fill);
        this.element.setAttribute('stroke-width', '2');
        this.element.setAttribute('stroke', 'rgba(81, 160, 255, 1)');
        return super.渲染(container);
    }
}

export default 椭圆;
