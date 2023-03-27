import { 基本图元 } from '../../图元';
import { 大刻度 } from '../../../assets/时钟素材';
import { 小刻度 } from '../../../assets/刻度素材';
import { createSVGNode } from '../../../utils';
class 刻度类 extends 基本图元 {
    x: number = 12;
    y: number = 10;
    小刻度: boolean;
    大刻度: boolean;
    分: number;
    color: string = '#1565c0';
    element: SVGGraphicsElement;
    constructor(data, 图形) {
        super(data, 图形);
        this.大刻度 = data.大刻度;
        this.小刻度 = data.小刻度;
        this.分 = data.分;
    }
    async 渲染(container = this.图形.container) {
        if (!this.大刻度) return;
        this.element = createSVGNode('g');
        let parser = new DOMParser();
        let doc = parser.parseFromString(大刻度, 'image/svg+xml');
        if (this.小刻度) {
            let i = Math.floor(this.分 / 30);
            let 小刻度svg = new DOMParser().parseFromString(小刻度[i], 'image/svg+xml');
            this.element.appendChild(document.importNode(小刻度svg.documentElement, true));
        }
        this.element.appendChild(document.importNode(doc.documentElement, true));
        this.element.setAttribute('transform', `translate(${this.x},${this.y})`);

        container.append(this.element);
        return super.渲染(container);
    }
}

export default 刻度类;
