import { 基本图元 } from '../../图元';
import { 分针, 空分针 } from '../../../assets/时钟素材';
import { getNameCoordinate, createSVGNode } from '../../../utils';
import { merge } from 'lodash-es';

class 分针类 extends 基本图元 {
    x: number = 156;
    y: number = 80;
    angle: number = 0;
    needleName: boolean = false;
    time: string | undefined = undefined;
    圈: number | undefined = undefined;
    move?: { 时: number; 分: number; outside: boolean; inside: boolean };
    color: string = '#1565c0';
    element: SVGGraphicsElement;
    animate: SVGAnimateTransformElement;
    constructor(data, 图形) {
        super(data, 图形);
        const { angle, needleName, time, move, 圈 } = data;
        merge(this, { angle, needleName, time, move, 圈 });
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('g');
        this.element.setAttribute('transform', `translate(${this.x},${this.y})rotate(${this.angle},4,80)`);
        let parser = new DOMParser();
        let doc = parser.parseFromString(分针, 'image/svg+xml');

        if (this.needleName) {
            let line = createSVGNode('line');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,5');
            line.setAttribute('stroke', 'gray');
            line.setAttribute('x1', '160');
            line.setAttribute('y1', `29`);
            line.setAttribute('x2', '160');
            line.setAttribute('y2', '80');
            line.setAttribute('transform', `rotate(${this.angle},160,160)`);
            container.append(line);
            let text = createSVGNode('text');
            text.setAttribute('font-size', '14');
            text.setAttribute('fill', '#F99019');
            text.setAttribute('font-weight', '600');
            text.appendChild(document.createTextNode(`分针`));

            let coordinate = getNameCoordinate(this.angle);
            text.setAttribute('x', coordinate[0]);
            text.setAttribute('y', coordinate[1]);
            container.append(text);
        }

        if (this.time) {
            let g = createSVGNode('g');
            // g.setAttribute('id','分针类')
            g.appendChild(document.importNode(doc.documentElement, true));
            this.element.appendChild(g);
            this.animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform') as SVGAnimateTransformElement;
            this.animate.setAttribute('dur', this.time);
            this.animate.setAttribute('attributeName', 'transform');
            this.animate.setAttribute('type', 'rotate');
            this.animate.setAttribute('from', `0 4 80`);
            this.animate.setAttribute('to', `${this.圈 * 360} 4 80`);
            this.animate.setAttribute('repeatCount', '1');
            this.animate.setAttribute('fill', 'freeze');
            this.animate.setAttribute('begin', 'indefinite');
            g.appendChild(this.animate);
        } else {
            this.element.appendChild(document.importNode(doc.documentElement, true));
        }

        if (this.move && this.move.outside) {
            let parser = new DOMParser();
            let doc = parser.parseFromString(空分针, 'image/svg+xml');
            let 空分指针 = createSVGNode('g');
            空分指针.appendChild(document.importNode(doc.documentElement, true));
            // 空分指针.setAttribute('transform', `translate(${8},${0})`)
            this.element.appendChild(空分指针);
        }

        container.append(this.element);
        return super.渲染(container);
    }
    start() {
        if (this.animate) {
            // @ts-ignore
            this.animate.beginElement();
        }
    }
}

export default 分针类;
