import { 基本图元 } from './图元';
import { createSVGNode, getScale, getCanvasOffset } from '../../utils';

class 点 extends 基本图元 {
    x: number = 0;
    y: number = 0;
    color: string = '#1565c0';
    element: SVGGraphicsElement;
    constructor(data, 图形, options?) {
        super(data, 图形);
        if (!data.x || !data.y) {
            if (data.position) {
                const position = data.position.split(',').map((a) => +a);
                this.x = position[0];
                this.y = position[1];
            }
        } else {
            this.x = data.x;
            this.y = data.y;
        }
        if (options && options.color) {
            this.color = options.color;
        }
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('circle');
        this.element.classList.add('aid-point');
        this.element.setAttribute('cx', this.x.toString());
        this.element.setAttribute('cy', this.y.toString());
        this.element.setAttribute('r', '4');
        this.element.setAttribute('fill', this.color);
        // @ts-ignore
        this.element.node = this;
        container.append(this.element);
        return this;
    }
}

export default 点;
