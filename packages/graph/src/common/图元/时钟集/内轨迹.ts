import { 基本图元 } from '../图元';
import { createSVGNode } from '../../../utils';
class 内轨迹类 extends 基本图元 {
    move: { 时: number; 分: number; outside: boolean; inside: boolean };
    时: number;
    分: number;
    from: number = 0;
    to: number = 180;
    time: string = '3s';
    r: number = 53;
    color: string = '#51A0FF';
    opcaity: number = 0.25;
    element: SVGGraphicsElement;
    animate: SVGAnimateElement;
    constructor(data, 图形) {
        super(data, 图形);
        this.时 = data.时;
        this.分 = data.分;
        this.move = data.move;
        this.time = data.time;
    }
    async 渲染(container = this.图形.container) {
        if (!this.move.inside) return super.渲染(container);
        this.from = this.时;
        this.to = this.move.时;
        if (this.to === 0) this.to = 360;
        let degrees = 0;
        if (this.from > this.to) {
            //时间跨过了12时
            degrees = 360 - (this.from - this.to);
        } else {
            degrees = this.to - this.from;
        }
        this.element = createSVGNode('path');
        let movelength = (degrees * this.r * Math.PI * 2) / 360;
        let 开始坐标 = this.angleToCoordinate(this.from, this.r);
        let 结束坐标 = this.angleToCoordinate(this.from + 180, this.r);
        let descriptions = ['M 160, 160', 'M', 开始坐标[0], 开始坐标[1], 'A', this.r, this.r, 0, 0, 0, 结束坐标[0], 结束坐标[1], 'A', this.r, this.r, 0, 0, 0, 开始坐标[0], 开始坐标[1]];
        this.element.setAttribute('d', descriptions.join(' '));
        this.element.setAttribute('stroke-width', String(this.r * 2));
        this.element.setAttribute('fill', 'none');
        this.element.setAttribute('stroke', this.color);
        this.element.setAttribute('stroke-opacity', String(this.opcaity));
        this.element.setAttribute('stroke-dasharray', `0 ${this.r * Math.PI * 2} ${this.r * Math.PI * 2}`);

        this.animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate') as SVGAnimateElement;
        // this.animate = createSVGElement('animate');
        this.animate.setAttribute('dur', this.time);
        this.animate.setAttribute('attributeName', 'stroke-dashoffset');
        this.animate.setAttribute('from', '0');
        this.animate.setAttribute('to', String(movelength));
        this.animate.setAttribute('repeatCount', '1');
        this.animate.setAttribute('fill', 'freeze');
        this.animate.setAttribute('begin', 'indefinite');
        this.element.appendChild(this.animate);
        container.append(this.element);
        return super.渲染(container);
    }
    angleToCoordinate(angle: number, r: number = this.r) {
        let rad = (90 - angle) * (Math.PI / 180);
        //极坐标转换成直角坐标
        let x = 160 + Math.cos(rad) * r;
        let y = 160 - Math.sin(rad) * r;
        return [x, y];
    }
    start() {
        if (this.animate) {
            // @ts-ignore
            this.animate.beginElement();
        }
    }
}

export default 内轨迹类;
