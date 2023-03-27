import 基本图形 from '../common/图形';
import { dslSchema, viewSchema } from '../schemas/分数展示器';
import { 表格, 概括, 概括定义 } from '../common/组合图元';
import { 单元格, 可竖排文本 as 标签 } from '../common/图元';
import { flatten } from 'lodash-es';
import { Position } from '..';

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

interface 强调区域 {
  弱强调区域: [number, number, number, number];
  高强调区域: [number, number, number, number];
}
interface 动画组件 {
  概括1?: 概括;
  概括2?: 概括;
  概括3?: 概括;
  moveBox?: HTMLDivElement;
  宽度1?: number; //概括1的宽度
  偏移1?: number; //概括1的偏移
  宽度2?: number; //概括2的宽度
  偏移2?: number; //概括2的偏移
}

enum 位置 {
  上 = '上',
  下 = '下',
  左 = '左',
  右 = '右',
}

export default class 分数展示器图形 extends 基本图形 {
  static 类名 = '分数展示器图形';
  static dslSchema = dslSchema;
  static viewSchema = viewSchema;
  adjustY = true;
  隐藏布局过程 = true;
  网格集: 表格[] = [];
  强调区域集: 强调区域[] = [];
  全局概括图元: 概括[] = [];
  概括集;
  概括图元集: Map<string, 概括> = new Map();
  网格定位: Map<string, rect> = new Map();
  网格概括绑定: Map<概括, 表格> = new Map();
  算式: 标签[] = [];
  动画组件: 动画组件 = {};
  time = 0;

  constructor(data) {
    super(data);
    // 先求出最大行数、列数，以便定位单元格尺寸，有一个前提条件，所有表格的大小是一样的
    let 最大行数 = 0,
      最大列数 = 0;
    this.分数表格.forEach((表格参数) => {
      const { 行数, 列数 } = 表格参数;
      最大行数 = Math.max(最大行数, 行数);
      最大列数 = Math.max(最大列数, 列数);
    });

    this.分数表格.forEach((表格参数) => {
      const { 行数, 列数 } = 表格参数;
      表格参数.单元格尺寸 = {
        宽: (最大列数 * 30) / 列数,
        高: (最大行数 * 30) / 行数,
      };
    });

    this.分数表格.forEach((表格参数) => {
      const { 行数, 列数, 单元格尺寸, 弱强调区域, 高强调区域 } = 表格参数;
      // @ts-ignore
      this.网格集.push(new 表格({ 行数, 列数, 单元格尺寸: [单元格尺寸.宽, 单元格尺寸.高], 内部虚线: true, 动画: this.动画?.动画, 乘法: this.动画?.type === 3 }, this));
      // @ts-ignore
      this.强调区域集.push({
        弱强调区域: 弱强调区域?.map((区域) => 区域.开始位置.split(',').concat(区域.结束位置.split(','))),
        高强调区域: 高强调区域?.map((区域) => 区域.开始位置.split(',').concat(区域.结束位置.split(','))),
      });
    });
  }

  get theme() {
    return themes[this.主题];
  }

  get 布局图元集() {
    return [...this.网格集];
  }

  get 图元集() {
    return [...this.网格集];
  }

  计算概括属性(概括定义, 单元格尺寸) {
    const { 偏移, 宽度, 位置: 概括位置, 前缀 } = 概括定义;
    switch (概括位置) {
      case 位置.上:
        return {
          位置: 位置.上,
          前缀,
          起点: { x: 偏移 * 单元格尺寸[0], y: 0 },
          终点: { x: (偏移 + 宽度) * 单元格尺寸[0], y: 0 },
        };
      case 位置.左:
        return {
          位置: 位置.左,
          起点: { x: 0, y: 偏移 * 单元格尺寸[1] },
          终点: { x: 0, y: (偏移 + 宽度) * 单元格尺寸[1] },
        };
      case 位置.右:
        return {
          位置: 位置.右,
          起点: { x: 0, y: 偏移 * 单元格尺寸[1] },
          终点: { x: 0, y: (偏移 + 宽度) * 单元格尺寸[1] },
        };
      case 位置.下:
        return {
          位置: 位置.下,
          前缀,
          起点: { x: 偏移 * 单元格尺寸[0], y: 0 },
          终点: { x: (偏移 + 宽度) * 单元格尺寸[0], y: 0 },
        };
    }
  }

  生成概括(概括定义, 表格) {
    const { 内容富文本, 内容, 隐藏, 前缀, 位置: 概括位置, formula } = 概括定义;
    // @ts-ignore
    const 概括图元 = new 概括(Object.assign(this.计算概括属性(概括定义, 表格.单元格尺寸), { 内容: 内容富文本 ? 内容富文本 : 内容, 隐藏: this.动画?.动画 ? true : false, 动画: this.动画?.动画, formula: formula }), this, {
      hidden: !!隐藏,
      textHeight: 前缀 === '=' ? 24 : null,
      竖排文本: 概括位置 === 位置.左 || 概括位置 === 位置.右,
    });
    this.概括图元集.set(概括图元.id, 概括图元);
    this.网格概括绑定.set(概括图元, 表格);
    return 概括图元;
  }

  生成概括集(概括集 = [], 表格) {
    return 概括集.map((概括定义) => {
      return this.生成概括(概括定义, 表格);
    });
  }

  async 布局(limitedWidth: number) {
    /**
     * 布局方案：
     * 1、先找到所有并排的网格在上边的所有概括，并计算所有概括中的最大高度，从而计算出网格在竖直方向的偏移量，如果没有则补充一个占位的概括（占位的概括不会显示出来）
     * 2、再找到第一个网格左边的概括（如果没有则补充一个占位的概括），计算所有概括中的最大宽度，从而计算出网格整体在水平方向的偏移量
     * 3、添加第一个网格
     * 4、定位第一个网格是否有右边的概括，有则处理，无则继续
     * 5、看第二个网格是否有左边的概括，有则处理，无则继续
     * 6、添加第二个网格
     * 7、看第二个网格是否有右边的概括，有则处理，无则继续，如果是最后一个网格且没有右边的概括，则同样需要补充一个占位的概括
     * 8、重复5-7步，直到所有的网格添加完
     * 9、添加剩余的所有概括并完成所有概括的定位，如果没有向下的概括，则也需要补充一个占位的概括
     * 10、添加分数加法中的符号图元
     * 11、添加全局概括图元
     * 12、从svg图层获取画布的宽高，即完成布局
     *  */
    const 上概括图元集: 概括[] = flatten(
      this.分数表格.map((表格参数, index) => {
        const { 概括集 } = 表格参数;
        return this.生成概括集(
          概括集?.filter((概括) => 概括.位置 === 位置.上),
          this.网格集[index]
        );
      })
    );
    if (上概括图元集.length === 0) {
      上概括图元集.push(this.生成概括({ 偏移: 0, 宽度: 1, 位置: 位置.上, 隐藏: true }, this.网格集[0]));
    }

    let offsetX = 0,
      offsetY = 0;
    for (const 图元 of 上概括图元集) {
      await 图元.渲染();
      offsetY = Math.max(图元.element.getBBox().height, offsetY);
    }
    // 第一个网格的左概括图元集
    const 左概括图元集 = this.生成概括集(
      this.分数表格[0].概括集?.filter((概括) => 概括.位置 === 位置.左),
      this.网格集[0]
    );

    if (左概括图元集.length === 0) {
      左概括图元集.push(this.生成概括({ 偏移: 0, 宽度: 1, 位置: 位置.左, 隐藏: true }, this.网格集[0]));
    }

    for (const 图元 of 左概括图元集) {
      await 图元.渲染();
      offsetX = Math.max(图元.element.getBBox().width, offsetX);
    }

    const { width, height } = this.网格集[0].element.getBoundingClientRect();
    this.网格定位.set(this.网格集[0].id, { x: offsetX, y: offsetY, width, height });

    offsetX = await this.分数表格.slice(0, this.分数表格.length - 1).reduce(async (offsetX, { 概括集 = [] }, index) => {
      offsetX = await offsetX;
      const 右概括图元集 = this.生成概括集(
        概括集.filter((概括) => 概括.位置 === 位置.右),
        this.网格集[index]
      );
      offsetX = offsetX + this.网格集[index].element.getBoundingClientRect().width;
      let offsetXIncrement = 0;
      for (const 图元 of 右概括图元集) {
        await 图元.渲染();
        offsetXIncrement = Math.max(图元.element.getBBox().width, offsetXIncrement);
      }
      offsetX += offsetXIncrement + 6;
      const 下一个网格 = this.分数表格[index + 1];
      const 左概括图元集 = this.生成概括集(
        下一个网格.概括集?.filter((概括) => 概括.位置 === 位置.左),
        this.网格集[index + 1]
      );
      offsetXIncrement = 0;
      for (const 图元 of 左概括图元集) {
        await 图元.渲染();
        offsetXIncrement = Math.max(图元.element.getBBox().width, offsetXIncrement);
      }
      offsetX += offsetXIncrement;
      const { width, height } = this.网格集[index + 1].element.getBoundingClientRect();
      this.网格定位.set(this.网格集[index + 1].id, { x: offsetX, y: offsetY, width, height });
      return offsetX;
    }, offsetX);

    //添加剩余的概括
    const 剩余概括图元集 = this.分数表格.reduce((概括图元集, { 概括集 = [] }, index) => {
      概括图元集.push(
        ...概括集.reduce((概括集, 概括定义) => {
          let 概括图元 = this.概括图元集.get(概括定义.id);
          if (!概括图元) {
            概括图元 = this.生成概括(概括定义, this.网格集[index]);
            概括集.push(概括图元);
          }
          return 概括集;
        }, [])
      );
      return 概括图元集;
    }, []);

    if (!剩余概括图元集.some((图元) => 图元.data.位置 === 位置.下)) {
      剩余概括图元集.push(this.生成概括({ 偏移: 0, 宽度: 1, 位置: 位置.下, 隐藏: true }, this.网格集[0]));
    }

    if (!this.分数表格[this.分数表格.length - 1].概括集?.some((概括) => 概括.位置 === 位置.右)) {
      剩余概括图元集.push(this.生成概括({ 偏移: 0, 宽度: 1, 位置: 位置.右, 隐藏: true }, this.网格集[this.网格集.length - 1]));
    }

    for (const 图元 of 剩余概括图元集) {
      await 图元.渲染();
    }

    for (const 概括 of this.概括图元集.values()) {
      this.定位概括(概括);
      if ((概括.data.位置 === 位置.下 || 概括.data.位置 === 位置.上) && 概括.data.前缀) {
        const 表格 = this.网格概括绑定.get(概括);
        const 表格索引 = this.网格集.findIndex((图元) => 图元 === 表格);
        if (表格索引 > 0) {
          const 上一个表格 = this.网格集[表格索引 - 1];
          // 补充间隔符号 动画都是一个表格，不会有间隔符号图元不用隐藏处理
          const 间隔符号图元 = await new 标签({ name: 概括.data.前缀 }, this).渲染();
          const { x: x1, width: width1, y: y1, height: height1 } = this.网格定位.get(上一个表格.id);
          const { x: x2 } = this.网格定位.get(表格.id);
          间隔符号图元.定位((x1 + width1 + x2) / 2, y1 + height1 + 18);
        }
      }
    }

    if (this.分数表格.length > 1 && this.全局概括 && this.全局概括.length > 0) {
      for (const 全局概括 of this.全局概括) {
        const 全局概括定义: Partial<概括定义> = { 位置: 全局概括.位置, 内容: 全局概括.内容富文本 || 全局概括.内容 };
        const 起始 = this.网格定位.get(this.网格集[0].id);
        const 终止 = this.网格定位.get(this.网格集[this.网格集.length - 1].id);
        if (全局概括.位置 === 位置.上) {
          全局概括定义.起点 = { x: 起始.x + 2, y: 起始.y };
          全局概括定义.终点 = { x: 终止.x - 2 + 终止.width, y: 终止.y };
        }
        if (全局概括.位置 === 位置.下) {
          全局概括定义.起点 = { x: 起始.x + 2, y: 起始.y + 起始.height };
          全局概括定义.终点 = { x: 终止.x - 2 + 终止.width, y: 终止.y + 终止.height };
        }
        // 全局概括是概括几个表格的，动画也不用隐藏处理
        this.全局概括图元.push(await new 概括(全局概括定义 as 概括定义, this).渲染());
      }
    }
    if (this.动画?.动画) {
      for (let value of this.概括图元集.values()) {
        //存概括
        if (value.data.formula) {
          this.动画组件['概括' + value.data.formula] = value;
        }
      }
      const 表布局 = this.网格定位.get(this.网格集[0].id); //算式占位
      let 下概括: 概括;
      let 左概括: 概括;
      for (let value of this.概括图元集.values()) {
        if (value.data.位置 === '下') {
          下概括 = 下概括 && 下概括.element.getBoundingClientRect().height > value.element.getBoundingClientRect().height ? 下概括 : value;
        }
        if (value.data.位置 === '左') {
          左概括 = value;
        }
      }
      this.算式.push(await new 标签({ name: this.动画?.算式 }, this, { isMathml: this.动画?.动画, 竖排: false }).渲染());
      this.算式[0].element.setAttribute('transform', `translate(0,${表布局.y + 表布局.height + 下概括.element.getBoundingClientRect().height + 12})`);
      this.算式[0].element.getElementsByTagName('p')[0].style.margin = '0px';
      this.算式[0].element.style.opacity = '0';

      if (this.动画组件.概括3) {
        this.动画组件.概括3.element.children[0];
        let textele = this.动画组件.概括3.element.children[0];
        let transform = textele.attributes['transform'] ? textele.attributes['transform'].value.split(',') : ['translate(0', '0)'];
        let x, y;
        x = Number(transform[0].substring(transform[0].indexOf('(') + 1, transform[0].length));
        y = Number(transform[1].substring(0, transform[1].length - 1)) + 30;
        textele.setAttribute('transform', `translate(${x},${y})`);
      }
    }
    const { width: 画布宽度, height: 画布高度 } = this.container.getBBox();

    return {
      dimensions: [画布宽度, 画布高度 + 40],
    };
  }

  定位概括(概括: 概括) {
    const 表格 = this.网格概括绑定.get(概括);
    const { width: 表格宽度, height: 表格高度 } = 表格.element.getBoundingClientRect();
    const { width: 概括宽度 } = 概括.element.getBoundingClientRect();
    const 表格定位 = this.网格定位.get(表格.id);
    switch (概括.data.位置) {
      case 位置.上:
        概括.定位(表格定位.x + 2, 表格定位.y, Position.topLeft);
        break;
      case 位置.下:
        概括.定位(表格定位.x + 2, 表格定位.y + 表格高度 - 4, Position.topLeft);
        break;
      case 位置.左:
        概括.定位(表格定位.x + 概括宽度, 表格定位.y + 2, Position.topRight);
        break;
      case 位置.右:
        概括.定位(表格定位.x + 表格宽度, 表格定位.y + 2, Position.topLeft);
        break;
    }
  }

  async 布局后处理() {
    this.网格集.forEach((表格) => {
      表格.element.style.position = 'absolute';
    });
    this.htmlRoot.style.position = 'relative';
    const { top: rTop, left: rLeft } = this.htmlRoot.getBoundingClientRect();
    const { top, left } = this.container.getBoundingClientRect();
    for (const 表格 of this.网格集) {
      const 表格位置 = this.网格定位.get(表格.id);
      表格.定位(
        表格位置.x + left - rLeft,
        表格位置.y + top - rTop + (this.全局概括图元.length > 0 && this.全局概括图元.some((图元) => 图元.data.位置 === 位置.上) ? this.全局概括图元.find((图元) => 图元.data.位置 === 位置.上).element.getBoundingClientRect().height - 12 : 0)
      );
    }
    if (this.动画?.动画) {
      this.网格集[0].element.style.opacity = '0';
      for (let value of this.概括图元集.values()) {
        value.element.style.opacity = '0';
      }
      if (this.动画.type === 2) {
        //创建减法需要宽变小的那个div
        let 起点 = this.动画组件.概括2.data.起点.x;
        let 终点 = this.动画组件.概括2.data.终点.x;
        this.动画组件.偏移2 = 起点 / this.网格集[0].data.单元格尺寸[0];
        this.动画组件.宽度2 = (终点 - 起点) / this.网格集[0].data.单元格尺寸[0];
        let tablesize = this.网格集[0].data.单元格尺寸;
        let moveBox = document.createElement('div') as HTMLDivElement;
        this.动画组件.moveBox = moveBox;
        moveBox.style.width = String(this.动画组件.宽度2 * tablesize[0] + 1) + 'px';
        moveBox.style.height = String(1 * tablesize[1]) + 'px';
        moveBox.style.backgroundColor = 'rgba(81, 160, 255, 0.64)';
        moveBox.style.opacity = '0';
        moveBox.style.position = 'absolute';
        moveBox.style.margin = '2px 0';
        moveBox.style.left = String(Number(this.网格集[0].element.style.left.replace('px', '')) + this.动画组件.偏移2 * tablesize[0] + this.动画组件.偏移2) + 'px';
        moveBox.style.top = this.网格集[0].element.style.top;
        this.htmlContainer.append(moveBox);
      }
    }
    super.布局后处理();
  }

  /**
   * 返回强调级别
   * @param 单元格
   * @return 0,1,2 分别表示强调级别：不强调、弱强调、高强调
   */
  强调级别(单元格: 单元格) {
    if (this.动画?.动画) return 0;
    const { rowIndex, colIndex } = 单元格.data;
    const index = this.网格集.findIndex((网格) => flatten(网格.表体).includes(单元格));
    const { 弱强调区域 = [], 高强调区域 = [] } = this.强调区域集[index];
    for (const 区域 of 弱强调区域) {
      if (rowIndex >= 区域[0] && colIndex >= 区域[1] && rowIndex <= 区域[2] && colIndex <= 区域[3]) {
        return 1;
      }
    }

    for (const 区域 of 高强调区域) {
      if (rowIndex >= 区域[0] && colIndex >= 区域[1] && rowIndex <= 区域[2] && colIndex <= 区域[3]) {
        return 2;
      }
    }

    return 0;
  }

  //加法 addition 减法 subtraction 乘法 multiplication 取第一个单词作为特定方法, 共用的方法带有前缀same

  //公共方法
  setMoveTransition(element: any, xlength: number, ylength: number, wait: string, notransition: string = 'all', opacity: string = '0') {
    //设置元素在x轴或者y轴的移动动画
    let textele = element;
    let transform = textele.attributes['transform'] ? textele.attributes['transform'].value.split(',') : ['translate(0', '0)'];
    let x, y;
    x = Number(transform[0].substring(transform[0].indexOf('(') + 1, transform[0].length)) + xlength;
    y = Number(transform[1].substring(0, transform[1].length - 1)) + ylength;

    textele.setAttribute('transform', `translate(${x},${y})`);
    textele.style['opacity'] = opacity;
    textele.style['transition'] = `${notransition} 0.6s ease-in-out ${wait}`;
  }
  opacityto1(el: any, duration: string, delay: string) {
    //渐显
    el.style.opacity = '1';
    el.style['transition'] = `opacity ${duration} ease-in-out ${delay}`;
  }
  texttoblack(el: any, duration: string, delay: string) {
    //文字转黑色
    let text = el.children[0].children[0].children[0];
    let path = el.children[1];
    for (let item of text.children) {
      item.style.color = 'rgba(0, 0, 0, 0.85)';
      item.style['transition'] = `color ${duration} ease-in-out ${delay}`;
    }
    path.setAttribute('stroke', 'rgba(196, 196, 196, 1)');
    path.style['transition'] = `stroke ${duration} ease-in-out ${delay}`;
  }
  ashowparameter(概括: 概括) {
    let 起点 = 概括.data.起点;
    let 终点 = 概括.data.终点;
    let 宽度 = (终点.x - 起点.x) / this.网格集[0].data.单元格尺寸[0];
    let 偏移 = 起点.x / this.网格集[0].data.单元格尺寸[0];
    let wait = 0.3;
    if (概括 === this.动画组件.概括2) {
      wait = 0.6;
    }
    概括.element.style.opacity = '1';
    概括.element.style['transition'] = `opacity 0.6s ease-in-out ${wait + 0.3}s`;
    for (let i = 偏移; i <= 偏移 + 宽度 - 1; i++) {
      let el = this.网格集[0].表体[0][i].container;
      el.style['background-color'] = 'rgba(81, 160, 255, 0.64)';
      el.style['transition'] = `background-color 0.6s ease-in-out ${wait}s`;
    }
  }

  sameShowBaseTable() {
    //显示基本表格
    if (this.分数表格[0].行数 > 1) {
      let 表体 = this.网格集[0].表体;
      let key1 = 'border-bottom';
      let key2 = 'border-top';
      if (this.动画组件.概括1.data.位置 === '上' || this.动画组件.概括1.data.位置 === '下') {
        key1 = 'border-left';
        key2 = 'border-right';
      }
      表体.map((items, index) => {
        items.map((item, index) => {
          const color = '1px dashed rgb(81, 160, 255)';
          let a = item.container;
          let value = item.container.attributes[0].value;
          if (value.indexOf(key1) > -1) {
            a.style[key1] = color;
          }
          if (value.indexOf(key2) > -1) {
            a.style[key2] = color;
          }
          if (value.indexOf('border-style: dashed') > -1) {
            a.style[key1] = color;
            a.style[key2] = color;
          }
        });
      });
      this.opacityto1(this.网格集[0].element, '0.6s', '0s');
    } else {
      this.opacityto1(this.网格集[0].element, '0.6s', '0s');
    }
  }

  sameShowFirstNumber() {
    //显示第一个参数
    if (this.动画.type === 1) {
      //加
      this.ashowparameter(this.动画组件.概括1);
    } else if (this.动画.type === 2) {
      //减
      let 起点 = this.动画组件.概括3.data.起点;
      let 终点 = this.动画组件.概括3.data.终点;
      let 宽度 = (终点.x - 起点.x) / this.网格集[0].data.单元格尺寸[0];
      let 偏移 = 起点.x / this.网格集[0].data.单元格尺寸[0];
      this.动画组件.概括1.element.style.opacity = '1';
      this.动画组件.概括1.element.style['transition'] = 'opacity 0.6s ease-in-out 0.6s';
      for (let i = 偏移; i <= 偏移 + 宽度 - 1; i++) {
        let el = this.网格集[0].表体[0][i].container;
        el.style['background-color'] = 'rgba(81, 160, 255, 0.64)';
        el.style['transition'] = 'background-color 0.6s ease-in-out 0.3s';
      }
      this.动画组件.moveBox.style.opacity = '1';
      this.动画组件.moveBox.style.transition = 'opacity 0.6s ease-in-out 0.3s';
    } else {
      //乘
      let isy = this.动画组件.概括1.data.位置 === '左' || this.动画组件.概括1.data.位置 === '右';
      let 起点 = isy ? this.动画组件.概括1.data.起点.y : this.动画组件.概括1.data.起点.x;
      let 终点 = isy ? this.动画组件.概括1.data.终点.y : this.动画组件.概括1.data.终点.x;
      let 宽度 = (终点 - 起点) / this.网格集[0].data.单元格尺寸[0];
      let 偏移 = 起点 / this.网格集[0].data.单元格尺寸[0];
      this.动画组件.宽度1 = 宽度;
      this.动画组件.偏移1 = 偏移;
      let inum = isy ? 偏移 + 宽度 - 1 : this.网格集[0].data.行数 - 1;
      let jnum = isy ? this.网格集[0].data.列数 - 1 : 偏移 + 宽度 - 1;
      let i = isy ? 偏移 : 0;
      let jstart = isy ? 0 : 偏移;
      for (; i <= inum; i++) {
        console.log('i', i);
        for (let j = jstart; j <= jnum; j++) {
          console.log('j' + j);
          let el = this.网格集[0].表体[i][j].container;
          el.style['background-color'] = 'rgba(81, 160, 255, 0.2)';
          el.style['transition'] = 'background-color 0.6s ease-in-out 0.3s';
        }
      }
      this.动画组件.概括1.element.style.opacity = '1';
      this.动画组件.概括1.element.style['transition'] = 'opacity 0.6s ease-in-out 0.6s';
    }
  }

  sameEndOne() {
    //结尾1，概括3变黑色
    if (this.动画.type === 3) {
      this.texttoblack(this.动画组件.概括2.element, '0.6s', '0.3s');
    } else {
      this.texttoblack(this.动画组件.概括3.element, '0.6s', '0.3s');
    }
  }
  sameEndTwo() {
    //结尾2，出现算式,减法间隔0.3，乘法间隔0.6
    if (this.动画.type === 3) {
      this.opacityto1(this.算式[0].element, '0.6s', '1.5s');
    } else if (this.动画.type === 2) {
      this.opacityto1(this.算式[0].element, '0.6s', '1.2s');
    } else {
      this.opacityto1(this.算式[0].element, '0.6s', '0.3s');
    }
  }
  //加法
  aShowSecondNumber() {
    this.ashowparameter(this.动画组件.概括2);
  }
  aMove() {
    //加法的移动方法
    this.setMoveTransition(this.动画组件.概括3.内容.element, 0, -28, '0.9s', 'transform', '1');
    this.opacityto1(this.动画组件.概括3.element, '0.6s', '0.9s');
    this.动画组件.概括1.element.style.opacity = '0';
    this.动画组件.概括2.element.style.opacity = '0';
    let middle = (this.动画组件.概括3.data.终点.x + this.动画组件.概括3.data.起点.x) / 2 + this.动画组件.概括3.data.起点.x;
    this.setMoveTransition(this.动画组件.概括1.element, middle - (this.动画组件.概括1.data.终点.x + this.动画组件.概括1.data.起点.x) / 2, 0, '0.6s');
    this.setMoveTransition(this.动画组件.概括2.element, middle - (this.动画组件.概括2.data.终点.x + this.动画组件.概括2.data.起点.x) / 2, 0, '0.6s');
  }
  //减法
  sShowSecondNumber() {
    this.texttoblack(this.动画组件.概括1.element, '0.6s', '0.3s');

    this.动画组件.moveBox.style.width = '0px';
    this.动画组件.moveBox.style.transition = 'width 0.6s ease-in-out 1.5s';
    for (let i = this.动画组件.偏移2; i <= this.动画组件.偏移2 + this.动画组件.宽度2 - 1; i++) {
      let el = this.网格集[0].表体[0][i].container;
      el.style['background-color'] = 'rgba(81, 160, 255, 0.2)';
      el.style['transition'] = 'background-color 0.6s ease-in-out 1.8s';
    }

    this.动画组件.概括2.element.style.opacity = '1';
    this.动画组件.概括2.element.style['transition'] = 'opacity 0.6s ease-in-out 2.1s';
  }
  sSecondToBlack() {
    this.texttoblack(this.动画组件.概括2.element, '0.6s', '0.3s');
  }
  sMove() {
    //减法的移动方法
    this.动画组件.概括3.element.style.opacity = '1';
    this.setMoveTransition(this.动画组件.概括3.内容.element, 0, -28, '0.6s', 'all', '1');
    this.动画组件.概括3.element.style['transition'] = 'opacity 0.6s ease-in-out 0.6s';

    this.动画组件.概括1.element.style.opacity = '0';
    this.动画组件.概括2.element.style.opacity = '0';
    let middle = (this.动画组件.概括3.data.终点.x + this.动画组件.概括3.data.起点.x) / 2 + this.动画组件.概括3.data.起点.x;
    this.setMoveTransition(this.动画组件.概括1.element, middle - (this.动画组件.概括1.data.终点.x + this.动画组件.概括1.data.起点.x) / 2, 0, '0.3s');
    this.setMoveTransition(this.动画组件.概括2.element.children[1], middle - (this.动画组件.概括2.data.终点.x + this.动画组件.概括2.data.起点.x) / 2, this.动画组件.概括2.element.children[1].getBoundingClientRect().height + 34, '0.3s');
    this.setMoveTransition(
      this.动画组件.概括2.element.children[0],
      middle - (this.动画组件.概括2.data.终点.x + this.动画组件.概括2.data.起点.x) / 2,
      this.动画组件.概括2.element.getBoundingClientRect().height + this.动画组件.概括2.element.children[1].getBoundingClientRect().height + 34,
      '0.3s',
      'all'
    );
    for (let i = this.动画组件.偏移2; i <= this.动画组件.偏移2 + this.动画组件.宽度2 - 1; i++) {
      let el = this.网格集[0].表体[0][i].container;
      el.style['background-color'] = 'rgba(81, 160, 255, 0)';
      el.style['transition'] = 'background-color 0.6s ease-in-out 0.3s';
    }
  }
  sEnd() {
    //减法法的结尾是直接间隔0.6s来调用结尾1和结尾2
    this.sameEndOne();
    this.sameEndTwo();
  }
  //乘法
  mShowAllTable() {
    //第三步显示全部表格边框
    this.texttoblack(this.动画组件.概括1.element, '0.6s', '0.3s');
    let 表体 = this.网格集[0].表体;
    let key1 = 'border-left';
    let key2 = 'border-right';
    if (this.动画组件.概括2.data.位置 === '左' || this.动画组件.概括2.data.位置 === '右') {
      key1 = 'border-bottom';
      key2 = 'border-top';
    }
    表体.map((items, index) => {
      items.map((item, index) => {
        const color = '1px dashed rgb(81, 160, 255)';
        let a = item.container;
        let value = item.container.attributes[0].value;
        if (value.indexOf(key1) > -1) {
          a.style[key1] = color;
        }
        if (value.indexOf(key2) > -1) {
          a.style[key2] = color;
        }
        if (value.indexOf('border-style: dashed') > -1) {
          a.style[key1] = color;
          a.style[key2] = color;
        }
        a.style['transition'] = 'border 0.6s ease-in-out 1.5s';
      });
    });
  }
  mShowSecondNumber() {
    //显示第二个参数
    this.opacityto1(this.动画组件.概括2.element, '0.6s', '0.6s');
    let isx = this.动画组件.概括2.data.位置 === '上' || this.动画组件.概括2.data.位置 === '下';
    let 起点 = isx ? this.动画组件.概括2.data.起点.x : this.动画组件.概括2.data.起点.y;
    let 终点 = isx ? this.动画组件.概括2.data.终点.x : this.动画组件.概括2.data.终点.y;
    let 宽度 = (终点 - 起点) / this.网格集[0].data.单元格尺寸[0];
    let 偏移 = 起点 / this.网格集[0].data.单元格尺寸[0];
    let { 宽度1, 偏移1 } = this.动画组件;
    let inum = isx ? 偏移1 + 宽度1 - 1 : 偏移 + 宽度 - 1;
    let jnum = isx ? 偏移 + 宽度 - 1 : 偏移1 + 宽度1 - 1;
    let i = isx ? 偏移1 : 偏移;
    let jstart = isx ? 偏移 : 偏移1;
    for (; i <= inum; i++) {
      for (let j = jstart; j <= jnum; j++) {
        let el = this.网格集[0].表体[i][j].container;
        el.style['background-color'] = 'rgba(81, 160, 255, 0.64)';
        el.style['transition'] = 'background-color 0.6s ease-in-out 0.3s';
      }
    }
  }
  mEnd() {
    //乘法的结尾是直接间隔0.6s来调用结尾1和结尾2
    this.sameEndOne();
    this.sameEndTwo();
  }

  分数加法() {
    this.time = this.time + 1;
    if (this.time === 1) {
      this.sameShowBaseTable();
    }
    if (this.time === 2) {
      this.sameShowFirstNumber();
    }
    if (this.time === 3) {
      this.aShowSecondNumber();
    }
    if (this.time === 4) {
      this.aMove();
    }
    if (this.time === 5) {
      this.sameEndOne();
    }
    if (this.time === 6) {
      this.sameEndTwo();
    }
  }

  分数减法() {
    this.time = this.time + 1;
    if (this.time === 1) {
      this.sameShowBaseTable();
    }
    if (this.time === 2) {
      this.sameShowFirstNumber();
    }
    if (this.time === 3) {
      this.sShowSecondNumber();
    }
    if (this.time === 4) {
      //this.texttoblack(this.动画组件.概括2.element, '0.6s', '0.3s')
      this.sSecondToBlack();
    }
    if (this.time === 5) {
      this.sMove();
    }
    if (this.time === 6) {
      this.sEnd();
    }
  }

  // 分数乘法的动画比较简单，不需要单独实现
  分数乘法() {
    this.time = this.time + 1;
    if (this.time === 1) {
      this.sameShowBaseTable();
    }
    if (this.time === 2) {
      this.sameShowFirstNumber();
    }
    if (this.time === 3) {
      this.mShowAllTable();
    }
    if (this.time === 4) {
      this.mShowSecondNumber();
    }
    if (this.time === 5) {
      this.mEnd();
    }
  }
}
