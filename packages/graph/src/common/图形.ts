import { isString, isNumber, get, set } from 'lodash-es';
import { createSVGNode, pruneEmpty, CompareValuesWithConflicts, 设定当前图形, isViewMode, getMatrix, createSVGElement } from '../utils';
import { parseRootSchema, stripFromSchema, travseSchemaWithValues } from '../utils/schema';
import { NS } from '../consts/namespaces';
import { Schemable } from '@yakies/models';
import { mix, mixin } from 'mix-with';
import * as Joi from 'joi';

class 基本图形 extends mix().with(Schemable) {
  static 类名 = '基本图形';

  [propName: string]: any;
  static idMap: Map<string, number> = new Map();
  static schema: Joi.ObjectSchema;
  static subSchemas: Joi.ObjectSchema;
  static dslSchema: Joi.ObjectSchema;
  static viewSchema: Joi.ObjectSchema;
  // 用来装载outline等元素
  frontContainer: SVGGElement;
  container: SVGGElement;
  svgRoot: SVGSVGElement;
  htmlRoot: HTMLDivElement;
  htmlContainer: HTMLDivElement;
  // 延迟`布局后处理`方法的执行
  delay = 0;
  resolve: Function;
  // 由于使用的是dom编程方式布局，布局过程中可能会发生图元抖动的情况,设置为true,将会将布局过程隐藏，从而让用户不会看到抖动
  隐藏布局过程: boolean;
  主题: 'light' | 'dark';
  id: string;
  // 是否需要调整Y方向的偏移
  adjustY: boolean;
  keys: string[];

  constructor(data) {
    super(data);
    // @ts-ignore
    this.id = this.constructor.getNextId();
    // TODO 见https://gitlab.dm-ai.cn/AIT/libs/graph-model/-/issues/36 这里补充一下子孙object schema的默认值
    设定当前图形(this);
  }

  get _schema() {
    // @ts-ignore
    return this.constructor.viewSchema;
  }

  get 布局图元集() {
    return [];
  }

  get 附属图元集() {
    return [];
  }

  get 图元集() {
    return [];
  }

  static getNextId() {
    let id = this.idMap.get(this.类名);
    if (typeof id === 'undefined') {
      id = 0;
    } else {
      id++;
    }
    this.idMap.set(this.类名, id);
    return this.idMap.get(this.类名);
  }

  static jsonSchemaDefs(viewMode): any {
    return parseRootSchema(viewMode ? this.viewSchema : this.dslSchema);
  }

  // 这里应该是抽象方法，必须被子类实现
  async 布局(limitedWidth: number) {
    return {
      dimensions: [limitedWidth, 0],
    };
  }

  async 渲染({ htmlRoot, svgRoot }: { htmlRoot: HTMLDivElement; svgRoot?: SVGSVGElement }, limitedWidth: number = 375) {
    // @ts-ignore
    this.perfMark = this.constructor.类名 + '_' + this.id;
    performance.mark(this.perfMark);
    this.htmlRoot = htmlRoot;
    this.htmlRoot.style.textAlign = 'center';
    if (this.隐藏布局过程) {
      this.htmlRoot.style.visibility = 'hidden';
    }
    if (!svgRoot) {
      svgRoot = createSVGElement('aidSvgRoot');
      this.htmlRoot.innerHTML = '';
      this.htmlRoot.append(svgRoot);
    }
    this.svgRoot = svgRoot;
    this.svgRoot.setAttribute('xmlns', NS.SVG);
    this.svgRoot.style.fontSize = this.字体大小 + 'px';
    this.htmlContainer = document.createElement('div');
    this.htmlContainer.style.display = 'inline-block';
    this.htmlContainer.style.fontSize = this.字体大小 + 'px';
    this.htmlContainer.style.margin = '0 auto';
    this.htmlRoot.append(this.htmlContainer);

    // 设置背景
    const bg = createSVGNode('rect');
    bg.setAttribute('width', '100%');
    bg.setAttribute('height', '100%');
    bg.setAttribute('fill', 'none');
    if (this.主题 === 'dark') {
      bg.setAttribute('fill', '#353639');
    }
    this.svgRoot.append(bg);

    if (svgRoot && svgRoot.childNodes.length === 1) {
      // 在讲题板中需要创建g元素
      this.container = createSVGNode('g');
      this.container.classList.add('layer');
      this.svgRoot.append(this.container);
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
    } else if (typeof svgCanvas !== 'undefined') {
      // 在画图板中不需要创建g元素，但是要清空g.layer元素的内容，另外还要将g.layer置于背景图层上方
      this.container = svgCanvas.getCurrentDrawing().getCurrentLayer() as SVGGElement;
      this.container.innerHTML = '';
      this.svgRoot.insertBefore(bg, this.container);
    }

    // 设置前景容器
    this.frontContainer = createSVGNode('g');
    this.svgRoot.append(this.frontContainer);

    for (const 图元 of this.布局图元集) {
      await 图元.渲染(this.container);
    }

    const { dimensions } = await this.布局(limitedWidth);

    // 默认使用了最大可能（所有图元都出现）的布局，如果部分图元的缺席，就会达不到最佳渲染效果，所以还需要对内容进行对齐、对高度进行裁剪等操作，并不对所有图形适用，譬如计数器
    if (this.adjustY) {
      const bbox = this.container.getBBox();
      // 我们在布局时要考虑水平位置的平衡，最后只需调整垂直方向的对齐
      const matrix = getMatrix(this.container);
      const adjustY = (dimensions[1] - bbox.height) / 2 - bbox.y;
      this.container.setAttribute('transform', `translate(${matrix.e},${adjustY})`);
      this.frontContainer.setAttribute('transform', `translate(${matrix.e},${adjustY})`);
    }

    // svg画布大小设置
    this.svgRoot.style.width = dimensions[0] + 'px';
    this.svgRoot.style.height = dimensions[1] + 'px';
    this.svgRoot.setAttribute('viewBox', `0 0 ${dimensions[0]} ${dimensions[1]}`);

    setTimeout(() => {
      this.布局后处理();
    }, this.delay);

    // 让图形内容居中
    return dimensions;
  }

  // 不影响布局的元素可延迟渲染或者执行一些方法
  布局后处理() {
    this.htmlRoot.style.visibility = 'visible';
    performance.measure('渲染计时', this.perfMark);
    console.log(`${this.perfMark}---首次渲染时长：${(performance.now() - performance.getEntriesByName(this.perfMark)[0].startTime) / 1000}秒`);
  }

  查找图元(idOrName) {
    return this.图元集.find((图元) => 图元.id === idOrName) || this.图元集.find((图元) => 图元.name === idOrName);
  }

  查找图元集(clazz) {
    return this.图元集.filter((图元) => 图元.constructor === clazz);
  }

  async 播放图元动作() {
    for (const 动作 of this.图元动作序列) {
      const 目标图元 = this.查找图元(动作.目标);
      await 目标图元[动作.动作]();
    }
  }

  清空画布() {
    this.container.innerHTML = '';
    this.container.removeAttribute('transform');
  }

  toSVG() {
    return require('xml-formatter')(this.container.outerHTML);
  }

  toJSON(viewMode = isViewMode()) {
    // @ts-ignore
    const schema = viewMode ? this.constructor.viewSchema : this.constructor.dslSchema;
    const schemas = schema.$_terms.keys;
    const strippedValue = stripFromSchema(schema, { ...this });
    const res = {};
    schemas.forEach(({ key }) => {
      // 忽略空值
      if (strippedValue[key]) {
        if ((Array.isArray(strippedValue[key]) && strippedValue[key].length > 0) || (!Array.isArray(strippedValue[key]) && typeof strippedValue[key] !== 'undefined')) {
          res[key] = pruneEmpty(strippedValue[key]);
        }
      }
    });
    return res;
  }

  // 从dsl中提取一些视觉参数
  getViewParamsInDsl(dslJSON) {
    const keys = [];
    // @ts-ignore
    travseSchemaWithValues(this.constructor.dslSchema, dslJSON, null, (key, schema, value) => {
      if (schema.$_terms.metas.length && schema.$_terms.metas.find((item) => item.viewParam)) {
        keys.push(key);
      }
    });
    return keys;
  }

  // 从视觉参数中剖离schema已提供的默认值，这里返回objkey数组即可
  getKeysOfStrippedDefaultValue(values) {
    const keys = [];
    // @ts-ignore
    travseSchemaWithValues(this.constructor.viewSchema, values, null, (key, schema, value) => {
      if (schema._flags.default && (isString(schema._flags.default) || isNumber(schema._flags.default)) && schema._flags.default === value) {
        keys.push(key);
      }
    });
    return keys;
  }

  // 提取所有的视觉参数
  getViewParams() {
    const dslJSON = this.toJSON(false);
    const viewKeys = CompareValuesWithConflicts(dslJSON, this.图形参数初始值).concat(this.当前图形.getViewParamsInDsl(dslJSON));
    // 图形.getViewKeys(viewKeys);
    let view = {};
    // 提取视觉参数
    for (const key of viewKeys) {
      // TODO 无须设置和schema提供的默认值相同的键值对，这样可以节省存储空间
      set(view, key, get(this.图形参数初始值, key));
    }
    return view;
  }
}

export default 基本图形;
