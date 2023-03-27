import { 基本图元 } from '../../图元';
import { merge } from 'lodash-es';
import { createSVGNode } from '../../../utils';

class 角名类 extends 基本图元 {
    from: number = 0;
    to: number = 60;
    r: number = 29;
    longR?: boolean = false;
    angleName: string = '锐角';
    linetype: '虚线' | '实线' = '实线';
    color: '蓝' | '黄' = '黄';
    colorObj: object = { 蓝: '#51A0FF', 黄: '#F99019' };
    辅助线?: Array<number> = [];
    直角?: boolean = false;
    element: SVGGraphicsElement;
    constructor(data, 图形) {
        super(data, 图形);
        const { from, to, angleName, colorObj, 辅助线, 直角, longR } = data;
        merge(this, { from, to, angleName, colorObj, 辅助线, 直角, longR });
        if (longR) this.r = 50;
    }
    async 渲染(container = this.图形.container) {
        this.element = createSVGNode('g');
        if (this.from > this.to && this.to === 0) {
            this.to = 360 + this.to;
        }
        //path
        let path = createSVGNode('path');
        let degrees = this.to - this.from;
        let 开始坐标,
            结束坐标,
            descriptions = [];
        if (this.直角) {
            //path画直角
            开始坐标 = this.angleToCoordinate(this.from, 15);
            结束坐标 = this.angleToCoordinate(this.to, 15);
            let midpoint = this.angleToCoordinate(this.from + 45, Math.sqrt(450));
            descriptions = ['M', 开始坐标[0], 开始坐标[1], 'L', midpoint[0], midpoint[1], 'L', 结束坐标[0], 结束坐标[1]];
        } else {
            //path画圆
            //大于180度时候画大角度弧，小于180度的画小角度弧，(deg > 180) ? 1 : 0
            let lenghty = window.Number(degrees > 180);
            //path
            开始坐标 = this.angleToCoordinate(this.from);
            结束坐标 = this.angleToCoordinate(this.to);
            descriptions = ['M', 开始坐标[0], 开始坐标[1], 'A', this.r, this.r, 0, lenghty, 1, 结束坐标[0], 结束坐标[1]];
        }

        path.setAttribute('d', descriptions.join(' '));
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', this.colorObj[this.color]);
        if (this.linetype === '虚线') path.setAttribute('stroke-dasharray', '5,5');
        //text
        let text = createSVGNode('text');
        text.setAttribute('font-size', '14');
        text.setAttribute('fill', this.colorObj[this.color]);
        text.setAttribute('font-weight', '600');
        text.appendChild(document.createTextNode(this.angleName));
        let textangle = this.from + degrees / 2;
        if (this.from > this.to) textangle = (this.from / 2 + 180 + this.to / 2) % 360;
        let 文字坐标 = this.angleToCoordinate(textangle);
        if (textangle >= 0 && textangle <= 30) {
            文字坐标[1] = 文字坐标[1] - 10;
        } else if (textangle > 30 && textangle <= 150) {
            文字坐标[0] = 文字坐标[0] + 10;
        } else if (textangle > 150 && textangle <= 180) {
            文字坐标[0] = 文字坐标[0] + 10;
            文字坐标[1] = 文字坐标[1] + 10;
        } else if (textangle > 180 && textangle <= 230) {
            文字坐标[0] = 文字坐标[0] - 35;
            文字坐标[1] = 文字坐标[1] + 15;
        } else {
            文字坐标[0] = 文字坐标[0] - 40;
        }
        text.setAttribute('x', 文字坐标[0] + '');
        text.setAttribute('y', 文字坐标[1] + '');

        //辅助线
        for (let i in this.辅助线) {
            let line = createSVGNode('line');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('stroke-dasharray', '5,5');
            line.setAttribute('stroke', 'gray');
            line.setAttribute('x1', '160');
            line.setAttribute('y1', `60`);
            line.setAttribute('x2', '160');
            line.setAttribute('y2', '160');
            line.setAttribute('transform', `rotate(${this.辅助线[i]},160,160)`);
            this.element.appendChild(line);
        }

        this.element.appendChild(text);
        this.element.appendChild(path);
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
}

export default 角名类;
