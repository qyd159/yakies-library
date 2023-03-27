import { 基本图元 } from './图元';
import { createSVGNode, getScale, getCanvasOffset, findDefs } from '../../utils';
export default class 箭头 extends 基本图元 {
  start: position;
  end: position;
  element: SVGGraphicsElement;
  constructor(data, 图形) {
    super(data, 图形);
    this.start = data.start;
    this.end = data.end;
  }
  async 渲染(container = this.图形.container) {
    this.element = createSVGNode({
      element: 'line',
      attr: {
        x1: this.start.x.toString(),
        y1: this.start.y.toString(),
        x2: this.end.x.toString(),
        y2: this.end.y.toString(),
        'stroke-width': '1',
        'marker-end': 'url(#arrow)',
        class: `aid-line arrow-line-${this.图形.主题}`,
      },
    });
    if (!document.getElementById('#arrow')) {
      const marker = createSVGNode({
        element: 'marker',
        attr: {
          id: 'arrow',
          markerUnits: 'strokeWidth',
          orient: 'auto',
          viewBox: '0 0 100 100',
          markerWidth: 12,
          markerHeight: 8,
          se_type: 'rightarrow',
          refX: 100,
          refY: 50,
        },
      });
      findDefs(this.图形.svgRoot).append(marker);
      marker.append(
        createSVGNode({
          element: 'path',
          attr: {
            d: 'M100,50 L0,90 L0,10 Z',
            strokeWidth: 10,
            class: `arrow-${this.图形.主题}`,
          },
        })
      );
    }
    container.append(this.element);
    return this;
  }
}
