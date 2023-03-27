import { 基本图元 } from '../../图元';
import { 表盘svg } from '../../../assets/时钟素材';

class 表盘类 extends 基本图元 {
    x: number = 0;
    y: number = 0;
    color: string = '#1565c0';
    element: SVGGraphicsElement;
    constructor(data, 图形) {
        super(data, 图形);
        this.x = data.x;
        this.y = data.y;
    }
    async 渲染(container = this.图形.container) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(表盘svg, 'image/svg+xml');
        // @ts-ignore
        this.element = document.importNode(doc.documentElement, true);
        this.element.setAttribute('x', this.x.toString());
        this.element.setAttribute('y', this.y.toString());
        container.append(this.element);
        return super.渲染(container);
    }
}

export default 表盘类;
