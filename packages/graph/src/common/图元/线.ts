import { createSVGNode, getScale, getCanvasOffset } from '../../utils';
import { NS } from '../../consts/namespaces';
import { 基本图元 } from '.';

class 线 extends 基本图元 {
    端点位置: [number, number, number, number] = [0, 0, 5, 5];
    constructor(data, 图形) {
        super(data, 图形);
    }
    async 渲染(container) {
        this.element = createSVGNode('line');
        container.append(this.element);
        this.element.setAttribute('stroke', this.图形.theme.线框);
        this.element.setAttribute('stroke-width', '1');
        this.端点定位(...this.端点位置);
        return this;
    }
    重定位(x1, y1, x2, y2) {
        this.端点位置 = [x1, y1, x2, y2];
        this.端点定位(x1, y1, x2, y2);
    }
    端点定位(x1, y1, x2, y2) {
        this.element.setAttribute('x1', x1);
        this.element.setAttribute('y1', y1);
        this.element.setAttribute('x2', x2);
        this.element.setAttribute('y2', y2);
    }
}

export default 线;
