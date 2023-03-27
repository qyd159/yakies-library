import { 树状图, 树节点 as 标签 } from '../common/组合图元/树状图';
import 基本图形 from '../common/图形';
import { TreeNode } from '@yakies/models/dist/tree';
import { batchCreate, getNextId } from '../utils';
import { dslSchema, viewSchema } from '../schemas/树状图';
import * as Yoga from 'yoga-layout-prebuilt';

const themes = {
  light: {
    文本: 'rgba(0, 0, 0, 0.85)',
    文本强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(0, 0, 0, 0.45)',
    线框强调: 'rgba(81, 160, 255, 1)',
  },
  dark: {
    文本: '#fff',
    强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(255, 255, 255, 0.45)',
    线框强调: 'rgba(81, 160, 255, 1)',
  },
};
class 树状图图形 extends 基本图形 {
  static 类名 = '树状图图形';
  static dslSchema = dslSchema;
  static viewSchema = viewSchema;

  get theme() {
    return themes[this.主题];
  }
  树: 树状图;
  层级标签: 标签[] = [];
  底部标签: 标签[] = [];
  constructor(data) {
    super(data);
    this.初始化();
  }

  初始化() {
    this.创建树状子图();
    if (this.有层级标签) {
      const 是否竖排 = this.constructor.name === '树状图图形' && this.树延展方向 === '向右';
      const 层级标签数量 = this.有底部标签 ? this.树状图.层级 + 1 : this.树状图.层级;
      this.层级标签 = !this.层级标签集
        ? (this.层级标签集 = batchCreate(
            标签,
            层级标签数量,
            (index) => {
              return { name: '' };
            },
            {},
            this,
            { 竖排: 是否竖排 }
          ))
        : this.层级标签集.slice(0, 层级标签数量).map((层级标签) => new 标签(层级标签, this, { 竖排: 是否竖排 }));
      if (this.层级标签.length < 层级标签数量) {
        // 补全标签
        this.层级标签 = this.层级标签.concat(
          batchCreate(
            标签,
            层级标签数量 - this.层级标签.length,
            (index) => {
              return { name: '' };
            },
            {},
            this,
            { 竖排: 是否竖排 }
          )
        );
      }
    } else {
      this.层级标签集 = [];
    }
    if (this.有底部标签) {
      const 底部标签数量 = this.树状图.最低层级叶子节点集.length;
      this.底部标签 = !this.底部标签集
        ? (this.底部标签集 = batchCreate(
            标签,
            底部标签数量,
            (index) => {
              return { name: '' };
            },
            {},
            this
          ))
        : this.底部标签集.slice(0, 底部标签数量).map((底部标签) => new 标签(底部标签, this, { width: 24 }));
      if (this.底部标签.length < 底部标签数量) {
        // 补全标签
        this.底部标签.concat(
          batchCreate(
            标签,
            底部标签数量 - this.底部标签.length,
            (index) => {
              return { name: '' };
            },
            {},
            this,
            { width: 24 }
          )
        );
      }
    } else {
      this.底部标签集 = [];
    }
  }

  创建树状子图() {
    // @ts-ignore
    this.树状图 = new 树状图(new TreeNode(this.树 || { name: 'root' }), this);
  }

  get 布局图元集() {
    return [this.树状图, ...this.层级标签, ...this.底部标签];
  }

  get 图元集() {
    return [...this.树状图.节点集, ...this.层级标签, ...this.底部标签];
  }

  get 排列方向() {
    return this.树延展方向 === '向下' || this.树延展方向 === '向上' ? '横向' : '纵向';
  }

  Flex布局() {
    const { Node } = Yoga;
    // SVG元素信息
    const root = Node.create();
    root.setWidthAuto();
    root.setHeightAuto();
    root.setMargin(Yoga.EDGE_ALL, 20);
    root.setFlexDirection(this.排列方向 === '横向' ? Yoga.FLEX_DIRECTION_ROW : Yoga.FLEX_DIRECTION_COLUMN);
    const rootChild1 = Node.create();
    rootChild1.setWidthAuto();
    rootChild1.setHeightAuto();
    rootChild1.setFlexDirection(this.排列方向 === '横向' ? Yoga.FLEX_DIRECTION_ROW : Yoga.FLEX_DIRECTION_COLUMN);
    this.排列方向 === '横向' ? rootChild1.setMargin(Yoga.EDGE_RIGHT, 20) : rootChild1.setMargin(Yoga.EDGE_BOTTOM, 10);
    let 层级节点集: Yoga.YogaNode;
    if (this.有层级标签) {
      层级节点集 = Node.create();
      层级节点集.setWidthAuto();
      层级节点集.setHeightAuto();
      层级节点集.setFlexDirection(this.排列方向 === '横向' ? Yoga.FLEX_DIRECTION_COLUMN : Yoga.FLEX_DIRECTION_ROW);
      层级节点集.setJustifyContent(Yoga.JUSTIFY_FLEX_END);

      const 层级偏移 = [];
      this.树状图.布局树.eachNode((node) => {
        if (!层级偏移[node.depth]) {
          const bbox1 = node.data.node.element.getBBox();
          层级偏移[node.depth] = this.树延展方向 === '向右' ? node.calculatedX : node.calculatedY + bbox1.height / 2;
        }
      });
      层级偏移.splice(0, 1);
      let width = 0;
      let maxHeight = 0;
      const 层级标签 = this.有底部标签 ? this.层级标签.slice(0, -1) : this.层级标签;
      层级标签.forEach((标签, index) => {
        const 节点 = Node.create();
        const bbox = 标签.element.getBBox();
        节点.setWidth(bbox.width);
        节点.setHeight(bbox.height);
        width = Math.max(width, bbox.width);
        maxHeight = Math.max(maxHeight, bbox.height);
        节点.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
        if (this.树延展方向 === '向上') {
          节点.setPosition(Yoga.EDGE_TOP, 层级偏移[index] - bbox.height / 2);
        } else if (this.树延展方向 === '向下') {
          节点.setPosition(Yoga.EDGE_TOP, 层级偏移[index] - bbox.height / 2);
        } else {
          节点.setPosition(Yoga.EDGE_LEFT, 层级偏移[index]);
        }
        层级节点集.insertChild(节点, index);
      });
      this.排列方向 === '横向' ? 层级节点集.setWidth(width) : 层级节点集.setHeight(maxHeight);
      rootChild1.insertChild(层级节点集, 0);
    }

    const 树状图 = Node.create();
    const bbox1 = this.树状图.element.getBBox();
    树状图.setWidth(bbox1.width);
    树状图.setHeight(bbox1.height);
    this.有底部标签 && 树状图.setMargin(this.树延展方向 === '向上' ? Yoga.EDGE_TOP : this.树延展方向 === '向右' ? Yoga.EDGE_RIGHT : Yoga.EDGE_BOTTOM, 10);
    const rootChild2 = Node.create();
    rootChild2.setWidthAuto();
    rootChild2.setHeightAuto();
    rootChild2.setFlexDirection(this.排列方向 === '横向' ? Yoga.FLEX_DIRECTION_COLUMN : Yoga.FLEX_DIRECTION_ROW);
    rootChild2.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
    const 最底层叶子节点集 = [];
    const 层级节点投影集 = [];
    this.树状图.布局树.eachNode((node) => {
      if (node.depth === this.树状图.层级) {
        最底层叶子节点集.push(node);
      }
      if (!层级节点投影集[node.depth] && 层级节点投影集.length === node.depth) {
        层级节点投影集.push(node);
      }
    });
    层级节点投影集.splice(0, 1);
    let 底部标签;
    let 底部层级节点;
    if (this.有底部标签) {
      底部标签 = Node.create();
      底部标签.setWidthAuto();
      底部标签.setHeightAuto();
      底部标签.setFlexDirection(this.排列方向 === '横向' ? Yoga.FLEX_DIRECTION_ROW : Yoga.FLEX_DIRECTION_COLUMN);
      底部标签.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
      底部标签.setAlignItems(Yoga.ALIGN_CENTER);
      if (this.排列方向 === '横向') {
        底部标签.setPadding(Yoga.EDGE_BOTTOM, 20);
      }
      const bbox0 = this.树状图.布局树.getBoundingBox();
      let width = 0;
      let maxHeight = 0;
      const 底部标签节点集 = this.有层级标签 ? this.层级标签.slice(-1).concat(this.底部标签) : this.底部标签;
      底部标签节点集.forEach((标签, index) => {
        const 节点 = Node.create();
        const bbox = 标签.element.getBBox();
        节点.setWidth(bbox.width);
        节点.setHeight(bbox.height);
        width = Math.max(width, bbox.width);
        maxHeight = Math.max(maxHeight, bbox.height);
        节点.setPositionType(Yoga.POSITION_TYPE_ABSOLUTE);
        if (!this.有层级标签 || (this.有层级标签 && index > 0)) {
          const idx = this.有层级标签 ? index - 1 : index;
          const bbox1 = 最底层叶子节点集[idx].data.node.element.getBBox();
          this.排列方向 === '横向' ? 节点.setPosition(Yoga.EDGE_LEFT, 最底层叶子节点集[idx].calculatedX) : 节点.setPosition(Yoga.EDGE_TOP, 最底层叶子节点集[idx].calculatedY + bbox1.height / 2 - bbox.height / 2);
          底部标签.insertChild(节点, 底部标签.getChildCount());
        } else {
          底部层级节点 = 标签;
          层级节点集.insertChild(节点, 层级节点集.getChildCount());
        }
      });
      if (底部层级节点 && this.排列方向 === '横向') {
        const bbox = 底部层级节点.element.getBBox();
        层级节点集.getChild(层级节点集.getChildCount() - 1).setPosition(Yoga.EDGE_TOP, maxHeight / 2 - bbox.height / 2);
      }
      this.排列方向 === '横向' ? 底部标签.setHeight(maxHeight) : 底部标签.setWidth(width);
    }

    if (this.树延展方向 === '向上') {
      if (底部标签) {
        rootChild2.insertChild(底部标签, rootChild2.getChildCount());
      }
      rootChild2.insertChild(树状图, rootChild2.getChildCount());
    } else {
      rootChild2.insertChild(树状图, rootChild2.getChildCount());
      if (底部标签) {
        rootChild2.insertChild(底部标签, rootChild2.getChildCount());
      }
    }

    if (this.有层级标签) {
      root.insertChild(rootChild1, 0);
    }
    root.insertChild(rootChild2, root.getChildCount());

    root.calculateLayout();
    return { root, rootChild1, rootChild2, 树状图, 层级节点集, 层级节点投影集, 底部标签, 最底层叶子节点集 };
  }

  async 布局(limitedWidth) {
    const { root, rootChild1, rootChild2, 树状图, 层级节点集, 层级节点投影集, 底部标签, 最底层叶子节点集 } = this.Flex布局();
    const { width, height, top, left, bottom, right } = root.getComputedLayout();
    // 布局后的渲染要进一步分离
    this.container.setAttribute('transform', `translate(${left},${top})`);
    const 树状图layout = 树状图.getComputedLayout();
    const rootChild1layout = rootChild1.getComputedLayout();
    const rootChild2layout = rootChild2.getComputedLayout();
    this.树状图.element.setAttribute('transform', 'translate(' + (rootChild2layout.left + 树状图layout.left) + ',' + (rootChild2layout.top + 树状图layout.top) + ')');
    if (this.有层级标签) {
      const 层级节点layout = 层级节点集.getComputedLayout();
      const 层级标签 = this.有底部标签 ? this.层级标签.slice(0, -1) : this.层级标签;
      层级标签.forEach((标签, index) => {
        const bbox = 层级节点投影集[index].data.node.element.getBBox();
        const bbox1 = 标签.element.getBBox();
        const 标签layout = 层级节点集.getChild(index).getComputedLayout();
        标签.element.setAttribute(
          'transform',
          `translate(${层级节点layout.left + 标签layout.left + (this.排列方向 !== '横向' ? bbox.width / 2 - bbox1.width / 2 + 树状图layout.left : 0)},${树状图layout.top + 层级节点layout.top + 标签layout.top})`
        );
      });
    }
    if (this.有底部标签) {
      const 底部标签layout = 底部标签.getComputedLayout();
      const 底部标签节点集 = this.有层级标签 ? this.层级标签.slice(-1).concat(this.底部标签) : this.底部标签;
      底部标签节点集.forEach((标签, index) => {
        const bbox = 标签.element.getBBox();
        if (!this.有层级标签 || (this.有层级标签 && index > 0)) {
          const 叶子节点元素 = 最底层叶子节点集[this.有层级标签 ? index - 1 : index].data.node.element;
          const bbox2 = 叶子节点元素.getBBox();
          const offset = {
            x: this.排列方向 === '横向' ? -bbox.width / 2 + bbox2.width / 2 : 0,
          };
          const 标签layout = 底部标签.getChild(this.有层级标签 ? index - 1 : index).getComputedLayout();
          标签.element.setAttribute('transform', `translate(${rootChild2layout.left + 底部标签layout.left + 标签layout.left + offset.x},${rootChild2layout.top + 底部标签layout.top + 标签layout.top})`);
        } else {
          const 标签layout = 层级节点集.getChild(层级节点集.getChildCount() - 1).getComputedLayout();
          const 标签layout2 = 底部标签.getChild(0).getComputedLayout();
          const 层级节点layout = 层级节点集.getComputedLayout();
          if (this.排列方向 === '横向') {
            标签.element.setAttribute('transform', `translate(${层级节点layout.left + 标签layout.left},${底部标签layout.top + 标签layout.top})`);
          } else {
            标签.element.setAttribute('transform', `translate(${底部标签layout.left + 标签layout2.left + 底部标签layout.width / 2 - bbox.width / 2},${层级节点layout.top + 标签layout.top})`);
          }
        }
      });
    }

    const dimensions = [width + left + right, height + top + bottom];
    if (limitedWidth && dimensions[0] > limitedWidth && this.排列方向 === '横向') {
      this.树延展方向 = '向右';
      this.updateProperties(this.validateObj(this.toJSON()));
      this.清空画布();
      this.初始化();
      for (const 图元 of this.布局图元集) {
        await 图元.渲染(this.container);
      }
      return this.布局(limitedWidth);
    }
    return {
      dimensions,
    };
  }
}

export default 树状图图形;
