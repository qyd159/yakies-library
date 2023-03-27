import { 基本图元 } from '../../图元';
import { 秒针 } from '../../../assets/时钟素材';
import { createSVGNode, getNameCoordinate } from '../../../utils';

class 秒针类 extends 基本图元 {
    x: number = 159;
    y: number = 60;
    angle: number = 0;
    needleName: boolean = false;
    color: string = '#1565c0';
    element: SVGGraphicsElement;
    constructor(data, 图形) {
        super(data, 图形);
        this.angle = data.angle;
        this.needleName = data.needleName;
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('g');
        this.element.setAttribute('transform', `translate(${this.x},${this.y})rotate(${this.angle},1,100)`);
        let parser = new DOMParser();
        let doc = parser.parseFromString(秒针, 'image/svg+xml');
        this.element.appendChild(document.importNode(doc.documentElement, true));
        if (this.needleName) {
            let line = createSVGNode('line');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,5');
            line.setAttribute('stroke', 'gray');
            line.setAttribute('x1', '160');
            line.setAttribute('y1', `29`);
            line.setAttribute('x2', '160');
            line.setAttribute('y2', '63');
            line.setAttribute('transform', `rotate(${this.angle},160,160)`);
            container.append(line);
            let text = createSVGNode('text');
            text.setAttribute('font-size', '14');
            text.setAttribute('fill', '#F99019');
            text.setAttribute('font-weight', '600');
            text.appendChild(document.createTextNode(`秒针`));

            let coordinate = getNameCoordinate(this.angle);
            text.setAttribute('x', coordinate[0]);
            text.setAttribute('y', coordinate[1]);
            container.append(text);
        }
        container.append(this.element);
        return super.渲染(container);
    }
}

export default 秒针类;
