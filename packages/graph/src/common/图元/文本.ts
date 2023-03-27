import { 基本图元 } from './图元';
import { createSVGNode, getScale, countTextLines } from '../../utils';
import { NS } from '../../consts/namespaces';
import { Position } from '../../consts/enums';
import { merge } from 'lodash-es';
import { nodable } from '../../mixins';
import { 数字正则, 字母数字混合正则 } from '../../consts/regexes';
import debug from 'debug';
const log = debug('节点');

interface 文本数据 extends GraphNode {
  边框样式: string;
  强调效果: string;
  index: number;
}
class 文本 extends 基本图元 {
  data: 文本数据;
  // 文本对齐，默认值50即表示居中。@detail: https://gitlab.dm-ai.cn/AIT/libs/graph-model/-/issues/26
  textAlign: number = 50;
  // 默认字体大小,默认继承基本图形中定义的全局字体大小
  fontSize?: number;
  // 文本颜色
  color?: string;
  // 文本容器宽度
  width: number;
  // 文本容器高度
  height: number;
  // 是否mathml表达式
  isMathml: boolean;
  mathmlElement: HTMLElement;
  // 留白区域
  padding: string;
  element: SVGGraphicsElement;
  wrapper: HTMLDivElement;

  constructor(data: GraphNode, 图形, options: { fontSize?: number; position?: Position; textAlign?: number; color?: string; width?: number; height?: number; padding?: string; isMathml?: boolean } = {}) {
    super(data, 图形, options);
    this.data.node = this;
    const { fontSize, textAlign, color, width, height, padding, isMathml } = options;
    merge(this, { fontSize, textAlign, color, width, height, padding, isMathml });
  }
  设置字体颜色(spanText) {
    // 文本的颜色的优先级，主题色 < 自定义颜色属性 < 强调效果设置的颜色
    spanText.style.color = this.图形.theme.文本;
    if (this.color) {
      spanText.style.color = this.color;
    }
    if (this.data.强调效果 && this.data.强调效果 === '文本着色') {
      spanText.style.color = this.图形.theme.文本强调;
    }
  }
  设置字体大小(wrapper) {
    // 数字的字体大小为16
    if (数字正则.test(this.data.name) && ((this.fontSize && this.fontSize < 16) || !this.fontSize)) {
      wrapper.style.fontSize = '16px';
    } else if (字母数字混合正则.test(this.data.name) && ((this.fontSize && this.fontSize < 14) || !this.fontSize)) {
      wrapper.style.fontSize = '14px';
    } else if (this.fontSize) {
      wrapper.style.fontSize = this.fontSize + 'px';
    }
  }
  设置文本容器宽度(wrapper) {
    if (this.width) {
      wrapper.style.width = this.width + 'px';
    }
  }
  设置文本容器高度(wrapper) {
    if (this.height) {
      wrapper.style.height = this.height + 'px';
    }
  }
  设置留白(wrapper) {
    if (this.padding) {
      wrapper.style.padding = this.padding;
    }
  }
  文本渲染(wrapper) {
    this.设置字体大小(wrapper);
    this.设置文本容器宽度(wrapper);
    this.设置文本容器高度(wrapper);
    this.设置留白(wrapper);
    const spanText = document.createElementNS(NS.HTML, 'span') as HTMLDivElement;
    wrapper.append(spanText);
    spanText.innerHTML = this.data.name || '';
    this.设置字体颜色(spanText);
  }
  async 表达式渲染(wrapper) {
    let mathList = wrapper.querySelectorAll('math');
    for (let math of mathList) {
      let mml = math.outerHTML;
      math.parentNode && math.parentNode.replaceChild(await MathJax.mathml2chtml(mml), math);
    }
    mathList.length && MathJax.startup.document.updateDocument();
    this.mathmlElement = wrapper.firstChild.firstChild as HTMLElement;
    this.mathmlElement.style.display = 'inline-block';
    // ~~TODO: 间隔时间是假定的（应该超过了mathjax数学表达式的完成最终渲染的时间点），原因是mathjax数学表达式会有个中间态，高度会偏大，尚不清楚mathjax数学表达式的完成最终渲染的时间点~~
    // await new Promise((resolve) => setTimeout(resolve, 100))
  }
  async 渲染(container = this.图形.container) {
    this.element = createSVGNode('g');
    this.element.classList.add('text-node');
    container.append(this.element);
    const fo = createSVGNode('foreignObject');
    this.element.append(fo);
    const wrapper = (this.wrapper = document.createElementNS(NS.HTML, 'div') as HTMLDivElement);
    wrapper.setAttribute('xmlns', NS.HTML);
    wrapper.classList.add('node-wrapper');
    wrapper.style.boxSizing = 'content-box';
    if (!this.isMathml) {
      wrapper.style.lineHeight = '1.2';
    } else {
      wrapper.style.lineHeight = wrapper.style.height;
    }
    wrapper.style.textAlign = this.textAlign < 50 ? 'left' : this.textAlign === 50 ? 'center' : 'right';
    this.文本渲染(wrapper);
    if (this.isMathml) {
      await this.表达式渲染(wrapper);
    }
    fo.append(wrapper);
    fo.classList.add(`text-node-${this.图形.主题}`);
    if (this.isMathml) {
      wrapper.style.lineHeight = wrapper.style.height;
      this.mathmlElement.style.display = 'inline-block';
    }
    const { width, height } = this.isMathml && !this.height ? this.mathmlElement.getBoundingClientRect() : wrapper.getBoundingClientRect();
    const scale = getScale();
    fo.style.width = (width / scale).toString();
    fo.style.height = (height / scale).toString();
    const 边框样式 = this.data.边框样式 && this.data.边框样式.split('-')[0];
    const 是否强调边框 = 边框样式 && this.data.边框样式.split('-')[1];
    if (边框样式 && 边框样式 !== '无') {
      const rect = createSVGNode('rect');
      this.element.append(rect);
      rect.setAttribute('width', ((Math.max(width, height) * 1.2) / scale).toString());
      rect.setAttribute('height', ((height * 1.2) / scale).toString());
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('stroke', 'transparent');
      rect.setAttribute('fill', 'none');
      fo.style.width = rect.getAttribute('width');
      fo.setAttribute('transform', 'translate(0,' + (height * 0.1) / scale + ')');
      const rect2 = createSVGNode('rect');
      rect2.setAttribute('width', (Math.max(width, height) / scale).toString());
      rect2.setAttribute('height', (height / scale).toString());
      rect2.setAttribute('transform', 'translate(' + (Math.max(width, height) * 0.1) / scale + ',' + (height * 0.1) / scale + ')');
      rect2.setAttribute('stroke-width', '1');
      rect2.setAttribute('stroke', this.图形.theme.线框);
      rect2.setAttribute('fill', 'none');
      if (边框样式 === '虚线边框') {
        rect2.setAttribute('stroke-dasharray', '2,2');
      }
      if (是否强调边框) {
        rect2.setAttribute('stroke', this.图形.theme.线框强调);
      }
      this.element.append(rect2);
    }
    await this.布局后处理();
    return this;
  }

  async 强调() {
    const node = this.element.childNodes[1] as HTMLElement;
    node && node.classList.add('svg-font1');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        node && node.classList.remove('svg-font1');
        resolve(null);
      }, 2000);
    });
  }
}

class 标签 extends 文本 {
  lineClamp?: number;
  constructor(data, 图形, options?) {
    super(data, 图形, options || {});
    if (options) {
      const { lineClamp } = options;
      Object.assign(this, { lineClamp });
    }
  }
  文本渲染(wrapper) {
    if (this.width) {
      wrapper.style.width = this.width + 'px';
      wrapper.classList.add('text-wrap');
    }

    if (this.lineClamp) {
      wrapper.classList.add('line-clamp');
      wrapper.style.webkitLineClamp = this.lineClamp;
    }
    super.文本渲染(wrapper);
  }
  定位(x, y?) {
    super.定位(x, y);
    // @ts-ignore
    const wrapper = this.element.firstChild.firstChild;
    // @ts-ignore
    const { width } = wrapper.firstChild.getBoundingClientRect();
    if (this.textAlign !== 0 && this.textAlign !== 50 && this.textAlign !== 100) {
      const offsetX = this.textAlign < 50 ? (this.textAlign * this.width) / 100 - width / 2 : this.width - width / 2 - (this.textAlign * this.width) / 100;
      if (offsetX > 1e-1) {
        // @ts-ignore
        wrapper.firstChild.style[this.textAlign < 50 ? 'paddingLeft' : 'paddingRight'] = offsetX + 'px';
      }
    }
  }
  async 布局后处理() {
    const wrapper = this.element.firstChild.firstChild as HTMLDivElement;
    if (log.enabled && typeof svgCanvas !== 'undefined' && this.lineClamp) {
      // 如果是在画图板上，画一个矩形框框，标识文本所占区域
      const calculatedHeight = (this.lineClamp * wrapper.getBoundingClientRect().height) / countTextLines(wrapper);
      this.outline = createSVGNode({
        element: 'rect',
        attr: {
          width: this.width,
          height: calculatedHeight,
          'stroke-width': 1,
          stroke: 'blue',
          fill: 'none',
        },
      });
    }
    super.布局后处理();
  }
}

class 可竖排文本 extends 标签 {
  竖排: boolean = false;
  constructor(data, 图形, options?) {
    super(data, 图形, options || {});
    if (options) {
      const { 竖排 } = options;
      Object.assign(this, { 竖排 });
    }
  }
  生成竖排文字(wrapper) {
    this.设置字体大小(wrapper);
    this.设置文本容器宽度(wrapper);
    this.设置留白(wrapper);

    const 创建并插入文本节点 = (text) => {
      const span = document.createElementNS(NS.HTML, 'span') as HTMLSpanElement;
      span.style.display = 'block';
      span.innerHTML = text;
      this.设置字体颜色(span);
      wrapper.append(span);
    };

    Array.from(this.data.name || '').forEach((content) => {
      const isHTML = /^</.test(content);
      if (isHTML) return 创建并插入文本节点(content);
      // 长度大于1的字符串，进一步拆分
      content.split('').forEach((text) => 创建并插入文本节点(text));
    });
  }
  文本渲染(wrapper) {
    if (this.竖排) {
      this.生成竖排文字(wrapper);
    } else {
      super.文本渲染(wrapper);
    }
  }
}

const 标签节点 = nodable(可竖排文本);

export { 文本, 标签, 标签节点, 可竖排文本 };
