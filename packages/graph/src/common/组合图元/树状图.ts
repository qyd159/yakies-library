import { 线, 标签节点 } from '../图元';
import { 基本图元 } from '../图元';
import { TreeNode } from '@yakies/models/dist/tree';
import * as Hierarchy from '@antv/hierarchy';
import { createSVGNode, getScale, getCanvasOffset, 获取当前图形 } from '../../utils';
class 树节点 extends 标签节点 {
  constructor(data: TreeNode, 图形, options?) {
    super(data, 图形, Object.assign({ padding: '2px 2px' }, options));
  }
  文本渲染(wrapper) {
    super.文本渲染(wrapper);
  }
}

class 连线 extends 线 {
  source: 基本图元;
  target: 基本图元;
  constructor(data, 图形) {
    super(data, 图形);
    this.source = data.source;
    this.target = data.target;
  }
}

class 树状图 extends 基本图元 {
  节点集: 树节点[] = [];
  根节点: 树节点;
  布局树: any;
  constructor(rootNode: TreeNode, 图形) {
    super(rootNode, 图形);
    const iterate = rootNode.iterate();
    let node;
    while ((node = iterate.next())) {
      if (node.done) {
        break;
      }
      if (!this.根节点) {
        this.根节点 = new 树节点(node.value, 图形, { width: node.value.name && node.value.name.length > 1 ? 28 : null, fontSize: 14 });
        this.节点集.push(this.根节点);
      } else {
        this.节点集.push(new 树节点(node.value, 图形, { width: node.value.name && node.value.name.length > 1 ? 24 : null }));
      }
      if (!node.value.children) {
        node.value.children = [];
      } else {
        // @ts-ignore
        node.value.children = node.value.children.map((child) => new TreeNode(child, node.value));
      }
    }
  }
  get 层级() {
    return this.根节点.data.deep;
  }
  get 最低层级叶子节点集() {
    const 层级 = this.层级;
    return this.节点集.filter((节点) => 节点.data.level === 层级);
  }
  get 连线集() {
    let 连线集 = [];
    this.节点集.forEach((node) => {
      if (node.data.children && node.data.children.length) {
        连线集 = 连线集.concat(
          node.data.children.map((child) => {
            return new 连线(
              {
                name: node.name + '_' + child.name,
                source: node,
                target: child.node,
              },
              this.图形
            );
          })
        );
      }
    });
    return 连线集;
  }
  get 邻接节点间距() {
    const { 邻接节点间距, 树延展方向, 底部标签 } = this.图形;
    if (树延展方向 === '向右' && this.最低层级叶子节点集.concat(底部标签).some((节点) => 节点.name && 节点.name.length > 2)) {
      return 40;
    }
    return 邻接节点间距;
  }
  布局() {
    const { 层级间距, 子树间距, 树延展方向 } = this.图形;
    this.布局树 = Hierarchy.dendrogram(this.根节点.data, {
      direction: 树延展方向 === '向下' ? 'TB' : 树延展方向 === '向上' ? 'BT' : 'LR',
      getId(d) {
        return d.id;
      },
      getHeight(d) {
        return d.node.element.getBBox().height;
      },
      getWidth(d) {
        return d.node.element.getBBox().width;
      },
      nodeSep: this.邻接节点间距,
      rankSep: 层级间距,
      subTreeSep: 子树间距,
    });
    const bbox = this.布局树.getBoundingBox();
    this.布局树.eachNode((node) => {
      const element = node.data.node.element;
      const bbox1 = element.getBBox();
      node.calculatedX = node.x - bbox.left - bbox1.width / 2;
      node.calculatedY = node.y - bbox.top + (树延展方向 === '向上' ? bbox1.height / 2 : -bbox1.height / 2);
    });
    const maxOffset = { width: this.布局树.calculatedX, height: this.布局树.calculatedY };
    this.布局树.eachNode((node) => {
      maxOffset.width = Math.min(maxOffset.width, node.calculatedX);
      maxOffset.height = Math.min(maxOffset.height, node.calculatedY);
    });
    this.布局树.eachNode((node) => {
      const element = node.data.node.element;
      node.calculatedX = node.calculatedX - maxOffset.width;
      node.calculatedY = node.calculatedY - maxOffset.height;
      element.setAttribute('transform', 'translate(' + node.calculatedX + ',' + node.calculatedY + ')');
    });
  }
  async 渲染(container) {
    this.element = createSVGNode('g');
    container.appendChild(this.element);
    for (const 图元 of this.节点集) {
      await 图元.渲染(this.element as SVGGraphicsElement);
    }
    this.布局();
    for (const 图元 of this.连线集) {
      await 图元.渲染(this.element);
      const { source, target } = 图元;
      const bbox1 = source.element.getBBox();
      const bbox2 = target.element.getBBox();
      const ctm1 = source.element.getCTM();
      const ctm2 = target.element.getCTM();
      const scale = getScale();
      const canvasOffset = getCanvasOffset();
      const sourceX = (ctm1.e - canvasOffset[0]) / scale;
      const sourceY = (ctm1.f - canvasOffset[1]) / scale;
      const targetX = (ctm2.e - canvasOffset[0]) / scale;
      const targetY = (ctm2.f - canvasOffset[1]) / scale;
      const offset = {
        x: source.data.isRoot && this.图形.排列方向 === '横向' ? (bbox1.width / (source.data.children.length + 1)) * (target.data.index + 1) - bbox1.width / 2 : 0,
        y: source.data.isRoot && this.图形.树延展方向 === '向右' ? (bbox1.height / (source.data.children.length + 1)) * (target.data.index + 1) - bbox1.height / 2 : 0,
      };
      const x1 = (this.图形.排列方向 === '横向' ? sourceX + bbox1.width / 2 + offset.x : sourceX + bbox1.width).toString();
      const y1 = (this.图形.排列方向 === '横向' ? (this.图形.树延展方向 === '向上' ? sourceY : sourceY + bbox1.height) : sourceY + bbox1.height / 2 + offset.y).toString();
      const x2 = (this.图形.排列方向 === '横向' ? targetX + bbox2.width / 2 : targetX).toString();
      const y2 = (this.图形.排列方向 === '横向' ? (this.图形.树延展方向 === '向上' ? targetY + bbox2.height : targetY) : targetY + bbox2.height / 2).toString();
      图元.重定位(x1, y1, x2, y2);
    }
    return this;
  }
  clear() {
    this.element && this.element.remove();
    this.根节点 = null;
    this.节点集 = [];
  }
}
export { 树状图, 树节点 };
