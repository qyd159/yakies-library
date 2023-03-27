import { 基本图元 } from '../图元';
import { createSVGNode } from '../../../utils';
class 外轨迹类 extends 基本图元 {
    move: { 时: number; 分: number; outside: boolean; inside: boolean };
    时: number;
    分: number;
    from: number = 0;
    to: number = 400;
    time: string = '3s';
    圈: number;
    r: number = 138;
    color: string = '#F99019';
    opcaity: number = 0.25;
    element: SVGGraphicsElement;
    animate1: SVGAnimateElement;
    animate2: SVGAnimateElement;
    time1: string = '0s';
    time2: string = '0s';
    constructor(data, 图形) {
        super(data, 图形);
        this.时 = data.时;
        this.分 = data.分;
        this.move = data.move;
        this.time = data.time;
        this.圈 = data.圈;
    }
    async 渲染(container = this.图形.container) {
        if (!this.move.outside) return super.渲染(container);
        this.from = this.分;
        this.to = this.move.分;
        this.element = createSVGNode('g');
        let path = createSVGNode('path');
        this.element.appendChild(path);

        if (this.to === 0) this.to = 360;
        let degrees = this.to - this.from;
        let 开始坐标 = this.angleToCoordinate(this.from, this.r);
        let 结束坐标 = this.angleToCoordinate(this.from + 180, this.r);
        if (this.圈 <= 1) {
            this.time1 = this.time;
        } else {
            this.time1 = '3s';
            this.time2 = `${Number(this.time.replace('s', '')) - 3}s`;
            degrees = 360;
        }
        let movelength = (degrees * this.r * Math.PI * 2) / 360;
        let descriptions = ['M 160, 160', 'M', 开始坐标[0], 开始坐标[1], 'A', this.r, this.r, 0, 0, 0, 结束坐标[0], 结束坐标[1], 'A', this.r, this.r, 0, 0, 0, 开始坐标[0], 开始坐标[1]];
        path.setAttribute('d', descriptions.join(' '));
        path.setAttribute('stroke-width', String(42));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', this.color);
        path.setAttribute('stroke-opacity', String(this.opcaity));
        path.setAttribute('stroke-dasharray', `0 ${this.r * Math.PI * 2} ${this.r * Math.PI * 2} ${this.r * Math.PI * 2} `);

        this.animate1 = document.createElementNS('http://www.w3.org/2000/svg', 'animate') as SVGAnimateElement;
        this.animate1.setAttribute('id', 'animate1');
        this.animate1.setAttribute('dur', this.time1);
        this.animate1.setAttribute('attributeName', 'stroke-dashoffset');
        this.animate1.setAttribute('from', '0');
        this.animate1.setAttribute('to', String(movelength));
        this.animate1.setAttribute('repeatCount', '1');
        this.animate1.setAttribute('fill', 'freeze');
        this.animate1.setAttribute('begin', 'indefinite');
        path.appendChild(this.animate1);
        if (this.圈 > 1) {
            let path2 = createSVGNode('path');
            this.element.appendChild(path2);
            // degrees = this.to - this.from
            movelength = (this.圈 - 1) * this.r * Math.PI * 2;
            开始坐标 = this.angleToCoordinate(this.from, this.r);
            结束坐标 = this.angleToCoordinate(this.from + 180, this.r);
            let descriptions = ['M 160, 160', 'M', 开始坐标[0], 开始坐标[1], 'A', this.r, this.r, 0, 0, 0, 结束坐标[0], 结束坐标[1], 'A', this.r, this.r, 0, 0, 0, 开始坐标[0], 开始坐标[1]];
            path2.setAttribute('d', descriptions.join(' '));
            path2.setAttribute('stroke-width', String(42));
            path2.setAttribute('fill', 'none');
            path2.setAttribute('stroke', this.color);
            path2.setAttribute('stroke-opacity', String(this.opcaity));
            path2.setAttribute('stroke-dasharray', `0 ${this.r * Math.PI * 2} ${this.r * Math.PI * 2} ${this.r * Math.PI * 2} `);

            this.animate2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate') as SVGAnimateElement;
            this.animate2.setAttribute('dur', this.time2);
            this.animate2.setAttribute('attributeName', 'stroke-dashoffset');
            this.animate2.setAttribute('from', '0');
            this.animate2.setAttribute('to', String(movelength));
            this.animate2.setAttribute('repeatCount', '1');
            this.animate2.setAttribute('fill', 'freeze');
            this.animate2.setAttribute('begin', 'indefinite');
            path2.appendChild(this.animate2);
            this.element.appendChild(path2);
        }
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
        if (this.animate1) {
            // @ts-ignore
            this.animate1.beginElement();
        }
        if (this.animate2) {
            this.animate2.setAttribute('begin', 'animate1.begin+3s');
        }
    }
}

export default 外轨迹类;
