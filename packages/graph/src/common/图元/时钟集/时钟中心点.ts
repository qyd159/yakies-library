import { 基本图元 } from '../../图元';
import { 时钟中心点 } from '../../../assets/时钟素材';

class 时钟中心点类 extends 基本图元 {
    x: number = 155;
    y: number = 155;
    color: string = '#1565c0';
    element: SVGGraphicsElement;
    constructor(data, 图形) {
        super(data, 图形);
    }
    async 渲染(container = this.图形.container) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(时钟中心点, 'image/svg+xml');
        // @ts-ignore
        this.element = document.importNode(doc.documentElement, true);
        this.element.setAttribute('x', this.x.toString());
        this.element.setAttribute('y', this.y.toString());
        container.append(this.element);
        return super.渲染(container);
    }
}

export default 时钟中心点类;
