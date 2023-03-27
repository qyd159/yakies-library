import 基本图形 from '../../common/图形';
import { createSVGNode } from '../../utils';
import { 椭圆, 标签, 基本图元 } from '../../common/图元';
import { ourMerge as merge } from '../../utils';
import view from '../../consts/韦恩图/view';
import 子图布局Mixin from './子图布局';
import { dslSchema, viewSchema } from '../../schemas/韦恩图';
import { flatten } from 'lodash-es';

const { 相交集: 相交集视觉参数, 包含集: 包含集视觉参数, 离散集: 离散集视觉参数 } = view;
const themes = {
  light: {
    文本: 'rgba(0, 0, 0, 0.85)',
    文本强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(0, 0, 0, 0.45)',
    线框强调: 'rgba(81, 160, 255, 1)',
    箭头文本: 'rgba(0,0,0,0.45)',
  },
  dark: {
    文本: '#fff',
    强调: 'rgba(81, 160, 255, 1)',
    线框: 'rgba(255, 255, 255, 0.45)',
    线框强调: 'rgba(81, 160, 255, 1)',
    箭头文本: 'rgba(255,255,255,0.65)',
  },
};
export default class 韦恩图图形 extends 子图布局Mixin(基本图形) {
  static 类名 = '韦恩图图形';
  constructor(data, viewParams?) {
    super(data);
    // 数据处理，基本图元初始化构造，没有布局
    const 目标集 = this[this.韦恩图类型];
    const 椭圆集 = [];
    switch (this.韦恩图类型) {
      case '相交集':
        const 三相交视觉参数 = this.全集.是否显示 ? 相交集视觉参数.全集.三相交 : { 相交集: 相交集视觉参数.三相交 };
        const 二相交视觉参数 = this.全集.是否显示 ? 相交集视觉参数.全集.二相交 : { 相交集: 相交集视觉参数.二相交 };
        // merge视觉参数，viewParams变量表示dsl中提取的视觉参数
        merge(this, 目标集.原始集合.length === 3 ? 三相交视觉参数 : 二相交视觉参数, viewParams);
        目标集.原始集合.forEach((集合) => {
          椭圆集.push(new 椭圆({ ...集合 }, this));
        });
        this.椭圆集.push(椭圆集);
        break;
      case '包含集':
        let 视觉参数;
        const 包含集 = this.获取韦恩图视觉参数(目标集[0], 包含集视觉参数);
        if (目标集.length === 2) {
          视觉参数 = 包含集视觉参数.两个包含集.框架布局;
        } else if (this.全集.是否显示) {
          视觉参数 = merge({}, 包含集视觉参数.全集, { 包含集 });
        } else {
          视觉参数 = { 包含集: [merge({}, 包含集视觉参数.框架布局, 包含集)] };
        }
        if (目标集.length === 2) {
          目标集.forEach((目标) => {
            merge(目标, this.获取韦恩图视觉参数(目标, 包含集视觉参数.两个包含集));
          });
          // 特殊处理
        } else if (目标集[0].类型 === '三层包含') {
          merge(视觉参数, { 包含集: [包含集视觉参数.三层包含.框架布局] });
        }
        merge(this, 视觉参数, viewParams);
        目标集.forEach((目标) => {
          const 椭圆集 = [];
          let size = 3;
          if (目标.类型 === '一层包含' && 目标.一层包含.类型 === '单子集') {
            size = 2;
          }
          if (目标.类型 === '三层包含') {
            size = 4;
          }
          目标.原始集合.slice(0, size).forEach((集合) => {
            椭圆集.push(new 椭圆({ ...集合 }, this));
          });
          this.椭圆集.push(椭圆集);
        });
        break;
      case '离散集':
        merge(this, 目标集.原始集合.length === 1 ? (this.全集.是否显示 ? 离散集视觉参数.全集 : { 离散集: 离散集视觉参数.单集 }) : { 离散集: 离散集视觉参数.多集 }, viewParams);
        目标集.原始集合.forEach((集合) => {
          椭圆集.push(new 椭圆({ ...集合 }, this));
          if (集合.标签) {
            this.标签集.set(集合.id, new 标签({ name: 集合.标签 }, this, { width: 集合.标签布局.宽度, lineClamp: 集合.标签布局.文本行数 }));
          }
        });
        this.椭圆集.push(椭圆集);
        break;
    }
  }
  static dslSchema = dslSchema;
  static viewSchema = viewSchema;
  椭圆集: 椭圆[][] = [];

  标签集: Map<string, 标签> = new Map();

  集合容器: SVGGraphicsElement[] = [];

  get 布局图元集() {
    return (flatten(this.椭圆集) as 基本图元[]).concat([...this.标签集.values()]);
  }

  get theme() {
    return themes[this.主题];
  }

  获取韦恩图视觉参数(目标, 视觉参数) {
    let target = 目标[目标.类型];
    if (目标.类型 === '一层包含') {
      if (target.类型 === '单子集') {
        return 视觉参数[目标.类型][target.类型][目标.布局方向];
      } else {
        const source = 视觉参数[目标.类型][target.类型];
        target = target[target.类型];
        return source[target.类型][目标.布局方向];
      }
    } else {
      return 视觉参数[目标.类型][目标.布局方向];
    }
  }

  async 布局(limitedWidth) {
    const 布局字典 = this.生成布局字典();

    // 定位标签
    if (this.韦恩图类型 === '相交集') {
      const { data, 集合容器 } = 布局字典[0];
      集合容器.dataset.objkey = `相交集.定位`;
      const 原生集合 = data.filter((item) => item.sets.length === 1);
      const 衍生集合 = data.filter((item) => item.sets.length > 1);
      this.container.append(集合容器);
      if (原生集合.length === 2) {
        /**
         * 两个相交集合的位置计算
         * 两个标题和三个标注
         *  */
        原生集合.map((set) => {
          if (set.label) {
            this.创建标签(set, `相交集.原始集合[${set.index}]`);
          }
          if (set.arrow) {
            this.创建箭头及文本(set, `相交集.原始集合[${set.index}]`, true);
          }
        });
        衍生集合.map((set) => {
          if (set.arrow) {
            this.创建箭头及文本(set, `相交集.衍生集合[${set.index}]`);
          }
        });
      }
      if (原生集合.length === 3) {
        原生集合.forEach((set) => {
          if (set.label) {
            this.创建标签(set, `相交集.原始集合[${set.index}]`);
          }

          if (set.arrow) {
            this.创建箭头及文本(set, `相交集.原始集合[${set.index}]`, set.index < 2);
          }
        });
        衍生集合.forEach((set) => {
          if (set.arrow) {
            this.创建箭头及文本(set, `相交集.衍生集合[${set.index}]`);
          }
        });
      }
    }

    if (this.韦恩图类型 === '包含集') {
      布局字典.forEach(({ 集合容器 }, index) => {
        集合容器.dataset.objkey = `包含集[${index}].定位`;
      });
    }

    if (this.韦恩图类型 === '离散集') {
      const { 集合容器 } = 布局字典[0];
      集合容器.dataset.objkey = `离散集.定位`;
    }

    // 如果有两个包含集，需要额外绘制一个大椭圆包住这两个包含集
    if (this.韦恩图类型 === '包含集' && 布局字典.length === 2) {
      new 椭圆({ x: 188, y: 136, radius: 140 }, this).渲染().then(({ element }) => {
        this.container.insertBefore(element, this.container.firstChild);
      });
      // 如果是离散集，只有单集情况下可能会出现全集
    } else if (this.全集.是否显示 && (this.韦恩图类型 !== '离散集' || (this.韦恩图类型 === '离散集' && this.离散集.原始集合.length === 1))) {
      const 全集 = createSVGNode('rect');
      全集.classList.add('aid-container');
      全集.dataset.objkey = '全集.位置尺寸';
      this.container.insertBefore(全集, this.container.childNodes[0] || null);
      const 位置尺寸 = this.全集.位置尺寸.split(',').map((a) => +a);
      全集.setAttribute('x', 位置尺寸[0]);
      全集.setAttribute('y', 位置尺寸[1]);
      全集.setAttribute('width', 位置尺寸[2]);
      全集.setAttribute('height', 位置尺寸[3]);
      全集.setAttribute('fill', 'rgba(81, 160, 255, 0.65)');
      全集.setAttribute('stroke-width', '2');
      全集.setAttribute('stroke', 'rgba(81, 160, 255, 1)');
      const set = this.集合设置(null, 0, this.全集);
      if (set.content) {
        this.创建内容(set, `全集`);
        this.创建标签(set, `全集`);
      }
      // 包含集没有箭头
      if (this.韦恩图类型 !== '包含集') {
        if (set.arrow) {
          this.创建箭头及文本(set, `全集`);
        }
      }
    }

    const { height } = this.container.getBBox();

    return {
      dimensions: [limitedWidth, height + 40],
    };
  }
}
