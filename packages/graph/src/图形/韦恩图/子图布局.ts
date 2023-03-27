import { 椭圆, 填充区域, 点, 标签, 箭头, 可竖排文本 as 竖排文本 } from '../../common/图元';
import { getNextId, 设定取样方向, createSVGNode, 设置文本对齐锚点 } from '../../utils';
import { venn, lossFunction, computeTextCentres, getIntersectedEllipsesAreas } from '../../布局/韦恩图';
import { intersectionAreaPath, intersectionIsolatedAreaPath, intersectionPairsAreaPath, scaleSolution } from '../../utils/ellipseintersection';
import { ellipticity } from '../../consts/geometry';
import * as Yoga from 'yoga-layout-prebuilt';
import { map, merge, defaultsDeep, chunk } from 'lodash-es';
import { Combination, Permutation } from 'js-combinatorics';
import { Position } from '../../consts/enums';
import debug from 'debug';
const log = debug('韦恩图-子图布局');

const 子图布局Mixin = <T extends new (...a: any[]) => any>(Base: T): T =>
  class extends Base {
    constructor(...data) {
      super(...data);
    }

    集合设置(sets, size, 设置对象) {
      return {
        id: 设置对象 && 设置对象.id,
        sets,
        size,
        index: 设置对象 && 设置对象.index,
        fill: 设置对象 && 设置对象.填充颜色,
        content: 设置对象 && 设置对象.内容,
        contentHighlight: 设置对象 && 设置对象.强调内容,
        ...(设置对象 && 设置对象.内容布局
          ? {
              contentPosition: 设置对象.内容布局.文本位置,
              contentWidth: 设置对象 && 设置对象.内容布局.宽度,
              contentLineClamp: 设置对象 && 设置对象.内容布局.文本行数,
              contentPositionAlign: 设置对象 && 设置对象.内容布局.文本定位 ? Position[设置对象.内容布局.文本定位] : Position.topLeft,
              contentTextAlign: 设置对象 && 设置对象.内容布局.文本对齐,
            }
          : null),
        label: 设置对象 && 设置对象.标签,
        ...(设置对象 && 设置对象.标签布局
          ? {
              labelWidth: 设置对象 && 设置对象.标签布局.宽度,
              labelLineClamp: 设置对象 && 设置对象.标签布局.文本行数,
              labelPosition: 设置对象 && 设置对象.标签布局.文本位置,
              labelPositionAlign: 设置对象 && 设置对象.标签布局.文本定位 ? Position[设置对象.标签布局.文本定位] : Position.topLeft,
              labelTextAlign: 设置对象 && 设置对象.标签布局.文本对齐,
            }
          : null),
        arrow: 设置对象 && 设置对象.箭头文本,
        ...(设置对象 && 设置对象.箭头布局
          ? {
              arrowWidth: 设置对象 && 设置对象.箭头布局.宽度,
              arrowLineClamp: 设置对象 && 设置对象.箭头布局.文本行数,
              arrowTextPosition: 设置对象 && 设置对象.箭头布局.文本位置,
              arrowLinePosition:
                设置对象 &&
                设置对象.箭头布局.连线位置 &&
                chunk(
                  设置对象.箭头布局.连线位置.split(',').map((a) => +a),
                  2
                ).map((item) => ({ x: item[0], y: item[1] })),
              arrowPositionAlign: 设置对象 && 设置对象.箭头布局.文本定位 ? Position[设置对象.箭头布局.文本定位] : Position.topLeft,
              arrowTextAlign: 设置对象 && 设置对象.箭头布局.文本对齐,
            }
          : null),
      };
    }

    创建内容(set, 集合key: boolean | string = false, container = this.container) {
      const { content, contentWidth, contentLineClamp, contentPosition, contentPositionAlign, contentTextAlign, contentHighlight } = set;
      new 标签({ name: content }, this, { width: contentWidth, lineClamp: contentLineClamp, position: contentPositionAlign, textAlign: contentTextAlign, fontSize: contentHighlight ? 14 : 12 }).渲染(container).then((图元) => {
        图元.定位(contentPosition);
        if (log.enabled && 集合key) {
          设置文本对齐锚点(contentPosition, contentPositionAlign, contentTextAlign, contentWidth, `${集合key}.内容布局.文本对齐`, `${集合key}.内容布局.文本位置`);
        }
      });
    }

    创建标签(set, 集合key) {
      const { label, labelWidth, labelPosition, labelPositionAlign, labelTextAlign, labelLineClamp } = set;
      const container = createSVGNode('g');
      this.container.append(container);
      new 标签({ name: label }, this, { width: labelWidth, position: labelPositionAlign, textAlign: labelTextAlign, lineClamp: labelLineClamp, fontSize: 14 }).渲染(container).then((图元) => {
        图元.定位(labelPosition);
        if (log.enabled) {
          设置文本对齐锚点(labelPosition, labelPositionAlign, labelTextAlign, labelWidth, `${集合key}.标签布局.文本对齐`, `${集合key}.标签布局.文本位置`);
        }
      });
    }

    创建箭头及文本(set, 集合key, 是否竖排文本 = false) {
      const { arrow, arrowWidth, arrowLineClamp, arrowTextPosition, arrowLinePosition, arrowPositionAlign, arrowTextAlign } = set;
      const container = createSVGNode('g');
      this.container.append(container);
      new 箭头({ start: arrowLinePosition[0], end: arrowLinePosition[1] }, this).渲染(container).then(({ element }) => {
        element.dataset.objkey = `${集合key}.箭头布局.连线位置`;
      });
      是否竖排文本
        ? new 竖排文本({ name: arrow }, this, { position: arrowPositionAlign, color: this.theme.箭头文本, 竖排: true }).渲染(container).then((图元) => {
            图元.定位(arrowTextPosition);
          })
        : new 标签({ name: arrow }, this, { width: arrowWidth, lineClamp: arrowLineClamp, position: arrowPositionAlign, textAlign: arrowTextAlign, color: this.theme.箭头文本 }).渲染(container).then((图元) => {
            图元.定位(arrowTextPosition);
          });
      if (log.enabled) {
        设置文本对齐锚点(arrowTextPosition, arrowPositionAlign, arrowTextAlign, 0, `${集合key}.箭头布局.文本对齐`, `${集合key}.箭头布局.文本位置`);
      }
    }

    生成布局字典() {
      const 目标集 = this[this.韦恩图类型];
      const 布局字典 = [];
      let 原生集合;
      switch (this.韦恩图类型) {
        case '相交集':
          设定取样方向('x');
          原生集合 = 目标集.原始集合.map((集合, index) => {
            return this.集合设置([集合.name], 10, { index, ...集合 });
          });

          const 衍生集合 = [];

          if (原生集合.length === 2) {
            const sets = 目标集.原始集合.map((集合) => 集合.name);
            const index = 目标集.衍生集合.findIndex((集合) => 集合.name === sets.join('∩'));
            index > -1 && 衍生集合.push(this.集合设置(sets, 4, { index, ...目标集.衍生集合[index] }));
          }

          if (原生集合.length === 3) {
            const 名称集 = getIntersectedEllipsesAreas(原生集合.map((集合) => 集合.sets.join('')));
            名称集.forEach((name) => {
              const index = 目标集.衍生集合.findIndex((集合) => 集合.name && 集合.name === name);
              let size = 4;
              const sets = name.split('∩');
              if (sets.length === 3) {
                size = 2;
              }
              index > -1 && 衍生集合.push(this.集合设置(sets, size, { index, ...目标集.衍生集合[index] }));
            });
          }

          布局字典.push(this.子图布局(原生集合.concat(衍生集合), this.椭圆集[0].slice(0, 3), false, '相交集', 目标集.子图宽度, 目标集.定位));
          break;
        case '包含集':
          布局字典.push(
            ...目标集.map((目标, index) => {
              let 椭圆集 = this.椭圆集[index];
              if (目标.布局方向 === '横向') {
                设定取样方向('x');
              } else {
                设定取样方向('y');
              }

              const 衍生集合 = [];
              if (目标.类型 === '一层包含') {
                if (目标.一层包含.类型 === '单子集') {
                  原生集合 = 目标.原始集合.slice(0, 2).map((集合, index) => {
                    let size = 3.5;
                    if (index === 0) {
                      size = 16;
                    }
                    return this.集合设置([集合.name], size, 集合);
                  });
                  const sets = [目标.原始集合[0].name, 目标.原始集合[1].name];
                  const 设置对象 = 目标.衍生集合.find((集合) => 集合.name === sets.join('∩'));
                  衍生集合.push(this.集合设置(sets, 4, 设置对象));
                  椭圆集 = 椭圆集.slice(0, 2);
                }
                if (目标.一层包含.类型 === '双子集') {
                  if (目标.一层包含.双子集.类型 === '子集分离') {
                    原生集合 = 目标.原始集合.slice(0, 3).map((集合, index) => {
                      let size = 目标.布局方向 === '横向' ? 2 : 2.7;
                      if (index === 0) {
                        size = 16;
                      }
                      return this.集合设置([集合.name], size, 集合);
                    });
                    const 名称集 = getIntersectedEllipsesAreas(原生集合.map((集合) => 集合.sets.join(''))).filter((item) => item.indexOf('-') === -1 && item.split('∩').length === 2);
                    衍生集合.push(
                      ...名称集.map((name) => {
                        const 设置对象 = 目标.衍生集合 && 目标.衍生集合.find((集合) => 集合.name === name);
                        let label = '';
                        if (设置对象) {
                          label = 设置对象.文本标签;
                        }
                        let size = 0;
                        const sets = name.split('∩');
                        if (sets.length === 2 && sets.includes(目标.原始集合[0].name)) {
                          size = Math.min(...原生集合.map((集合) => 集合.size));
                        }
                        sets.sort();
                        return this.集合设置(sets, size, 设置对象);
                      })
                    );
                  } else {
                    原生集合 = 目标.原始集合.slice(0, 3).map((集合, index) => {
                      let size = 4.2;
                      if (index === 0) {
                        size = 16;
                      }
                      return this.集合设置([集合.name], size, 集合);
                    });
                    const 名称集 = getIntersectedEllipsesAreas(原生集合.map((集合) => 集合.sets.join(''))).filter((item) => item.indexOf('-') === -1 && item.split('∩').length === 2);
                    衍生集合.push(
                      ...名称集.map((name) => {
                        const 设置对象 = 目标.衍生集合 && 目标.衍生集合.find((集合) => 集合.name === name);
                        let size = 1.3;
                        const sets = name.split('∩');
                        if (sets.length === 2 && sets.includes(目标.原始集合[0].name)) {
                          size = 4.2;
                        }
                        sets.sort();
                        return this.集合设置(sets, size, 设置对象);
                      })
                    );
                  }
                  椭圆集 = 椭圆集.slice(0, 3);
                }
              }
              if (目标.类型 === '二层包含') {
                原生集合 = 目标.原始集合.slice(0, 3).map((集合, index) => {
                  let size = 4;
                  if (index === 0) {
                    size = 16;
                  } else if (index === 1) {
                    size = 9;
                  }
                  return this.集合设置([集合.name], size, 集合);
                });
                const 名称集 = getIntersectedEllipsesAreas(原生集合.map((集合) => 集合.sets.join(''))).filter((item) => item.indexOf('-') === -1 && item.split('∩').length === 2);
                衍生集合.push(
                  ...名称集.map((name) => {
                    const 设置对象 = 目标.衍生集合 && 目标.衍生集合.find((集合) => 集合.name === name);
                    let label = '';
                    if (设置对象) {
                      label = 设置对象.文本标签;
                    }
                    const sets = name.split('∩');
                    const set1 = 原生集合.find((集合) => 集合.sets.join('') === sets[0]);
                    const set2 = 原生集合.find((集合) => 集合.sets.join('') === sets[1]);
                    return this.集合设置(sets, Math.min(set1.size, set2.size), 设置对象);
                  })
                );
                椭圆集 = 椭圆集.slice(0, 3);
              }
              if (目标.类型 === '三层包含') {
                原生集合 = 目标.原始集合.slice(0, 4).map((集合, index) => {
                  let size = 4;
                  if (index === 0) {
                    size = 27;
                  } else if (index === 1) {
                    size = 16;
                  } else if (index === 2) {
                    size = 8;
                  }

                  return this.集合设置([集合.name], size, 集合);
                });
                const 名称集 = getIntersectedEllipsesAreas(原生集合.map((集合) => 集合.sets.join(''))).filter((item) => item.indexOf('-') === -1 && item.split('∩').length === 2);
                衍生集合.push(
                  ...名称集.map((name) => {
                    const 设置对象 = 目标.衍生集合 && 目标.衍生集合.find((集合) => 集合.name === name);
                    const sets = name.split('∩');
                    const set1 = 原生集合.find((集合) => 集合.sets.join('') === sets[0]);
                    const set2 = 原生集合.find((集合) => 集合.sets.join('') === sets[1]);
                    return this.集合设置(sets, Math.min(set1.size, set2.size), 设置对象);
                  })
                );
                椭圆集 = 椭圆集.slice(0, 4);
              }
              this.当前布局子图 = 目标;
              return this.子图布局(原生集合.concat(衍生集合), 椭圆集, true, 目标.类型 === '一层包含' ? 目标.类型 + '-' + 目标.一层包含.类型 : 目标.类型, 目标.子图宽度, 目标.定位);
            })
          );
          break;
        case '离散集':
          原生集合 = 目标集.原始集合.map((集合) => {
            return this.集合设置([集合.name], 10, 集合);
          });

          布局字典.push(this.子图布局(原生集合, this.椭圆集[0], false, '离散集', 目标集.子图宽度, 目标集.定位));
          break;
      }
      return 布局字典;
    }

    当前布局子图;

    相交集包含集集合椭圆及内容布局(data, 椭圆集, overlaped, 类型, 子图宽度, 集合容器) {
      const solution = venn(
        data.filter((item) => !item.sets.some((set) => set.indexOf('-') !== -1)),
        { lossFunction },
        overlaped,
        类型
      );
      const { scaled: ellipses } = scaleSolution(solution, 子图宽度);

      椭圆集.forEach((椭圆) => {
        const 设置对象 = data.find((item) => item.sets.join('') === 椭圆.name);
        椭圆.element.setAttribute('cx', ellipses[椭圆.name].x);
        椭圆.element.setAttribute('cy', ellipses[椭圆.name].y);
        椭圆.element.setAttribute('rx', ellipses[椭圆.name].radius);
        椭圆.element.setAttribute('ry', ellipses[椭圆.name].radius * ellipticity);
        if (类型 !== '相交集') {
          椭圆.element.setAttribute('fill', 设置对象 && 设置对象.fill);
        }
        设置对象.element = 椭圆.element;
        集合容器.append(椭圆.element);
      });
      const ellipseArr = map(ellipses, (ellipse, key) => {
        return { ...ellipse, key };
      });
      ellipseArr.forEach(async (ellipse) => {
        new 椭圆({ ...ellipse, fill: this.主题 === 'light' ? 'white' : 'transparent', placeBottom: true }, this).渲染(集合容器);
      });
      const { pathD, stats } = intersectionAreaPath(ellipseArr);
      if (stats.innerPoints.length > 1) {
        // 相交集
        const intersectArea = data.find((item) => item.sets.length === 3);
        intersectArea && intersectArea.fill && new 填充区域({ pathD, fill: intersectArea.fill }, this).渲染(集合容器); // 这是所有椭圆相交的区域
        /**
         * 还要计算出其它所有的区域，ps.根据需求，只考虑有3个椭圆相交的情况，否则就会异常复杂
         * 1、各个椭圆不与其它椭圆相交的区域
         * 需要定位3个相交点，然后计算出svgpath。解析：一个点在目标椭圆的内部、另外两个点是目标椭圆和第二个椭圆的交点，但该点不在第三个椭圆上
         * 2、任意两椭圆之间相交的区域
         * 这个好计算，使用intersectionAreaPath方法直接计算
         * 3、任意两椭圆相交的区域减去三个椭圆共同相交的区域后剩下的区域
         * 同样需要定位3个相交点。解析：一个点是这两个椭圆的相交点，但这个相交点不在第三个椭圆内部、另外两个点在三个椭圆的相交区域上，过滤掉在第三个椭圆内部的那个点
         *  */
        const isolatedAreas = intersectionIsolatedAreaPath(类型 === '一层包含-双子集' ? ellipseArr.slice(1, 3) : ellipseArr, stats);
        isolatedAreas.forEach((isolatedArea) => {
          const area = data.find((item) => item.sets.join(',') === isolatedArea.ellipse.key);
          area && area.fill && new 填充区域({ pathD: isolatedArea.path, fill: area.fill }, this).渲染(集合容器);
        });

        const pairsAreas = intersectionPairsAreaPath(ellipseArr, stats);
        pairsAreas.forEach((pairArea) => {
          const ellipse3key = Object.keys(ellipses).find((key) => !pairArea.ellipses.some((ellipse) => ellipse.key === key));
          const key =
            pairArea.ellipses
              .map((ellipse) => ellipse.key)
              .sort()
              .join(',') +
            '-' +
            ellipse3key;
          const area = data.find((item) => item.sets.join(',') === key);
          area && area.fill && new 填充区域({ pathD: pairArea.path, fill: area.fill }, this).渲染(集合容器);
        });

        [...new Combination(ellipseArr, 2)].forEach((ellipses) => {
          const { pathD, stats } = intersectionAreaPath(ellipses);
          // @ts-ignore
          const key = ellipses
            .map((ellipse) => ellipse.key)
            .sort()
            .join(',');
          const area = data.find((item) => item.sets.join(',') === key);
          area && area.fill && new 填充区域({ pathD, fill: area.fill }, this).渲染(集合容器);
        });
      }
      // 此时渲染文本标签
      const points: any = computeTextCentres(
        ellipses,
        data.filter((item) => !item.sets.some((set) => set.indexOf('-') !== -1)),
        类型
      );
      map(points, (point, key) => {
        return { point, key };
      }).forEach((文本布局对象) => {
        const set = data.find((item) => item.sets.join(',') === 文本布局对象.key);
        if (set && set.content) {
          set.contentPosition = 文本布局对象.point.x + ',' + 文本布局对象.point.y;
          set.contentPositionAlign = Position.middleCenter;
          this.创建内容(set, false, 集合容器);
        }
      });
    }

    // 多个孤立的集合，不会有全集
    离散集多个集合布局(data, 子图宽度, 椭圆集, 集合容器) {
      if (data.length === 4) {
        data = [...data.slice(2, 4), ...data.slice(0, 2)];
      }
      if (data.length === 3) {
        data = [...data.slice(1, 3), ...data.slice(0, 1)];
      }
      const { Node } = Yoga;
      const root = Node.create();
      root.setWidth(子图宽度);
      root.setHeightAuto();
      root.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
      root.setFlexWrap(data.length < 3 ? Yoga.WRAP_NO_WRAP : Yoga.WRAP_WRAP_REVERSE);
      root.setJustifyContent(Yoga.JUSTIFY_CENTER);
      root.setAlignItems(data.length > 2 ? Yoga.ALIGN_FLEX_START : Yoga.ALIGN_FLEX_END);
      const 标题集 = {};
      data.forEach((item) => {
        const child = Node.create();
        child.setWidth(子图宽度 / 2 - 20);
        // child.setHeightAuto();
        child.setFlexDirection(Yoga.FLEX_DIRECTION_COLUMN);
        child.setJustifyContent(Yoga.JUSTIFY_FLEX_END);
        child.setAlignItems(Yoga.ALIGN_CENTER);
        if (data.length > 1) {
          child.setMargin(Yoga.EDGE_BOTTOM, 20);
          child.setMargin(Yoga.EDGE_RIGHT, 20);
        }
        const ellipse = Node.create();
        ellipse.setWidth(子图宽度 / 2 - 20);
        ellipse.setHeight((子图宽度 / 2 - 20) * ellipticity);
        let boxHeight = ellipse.getHeight().value;
        if (item.label) {
          const title = Node.create();
          const { element } = this.标签集.get(item.id);
          集合容器.append(element);
          标题集[item.sets.join('')] = element;
          const { width, height } = element.getBBox();
          title.setWidth(width);
          title.setHeight(height);
          title.setMargin(Yoga.EDGE_BOTTOM, 4);
          child.insertChild(title, child.getChildCount());
          boxHeight += height + 4;
        }
        child.setHeight(boxHeight);
        child.insertChild(ellipse, child.getChildCount());
        root.insertChild(child, root.getChildCount());
      });
      root.calculateLayout();
      椭圆集.forEach((ellipse, index) => {
        const set = data[index];
        const child = root.getChild(index);
        const { left, top, width, height } = child.getComputedLayout();
        let i = 0;
        const container = createSVGNode('g');
        if (data.length > 1) {
          container.setAttribute('transform', `translate(${left},${top - (data.length > 2 ? 20 : 0)})`);
        }
        if (set.content && set.label) {
          const layout = child.getChild(i).getComputedLayout();
          i++;
          const element = 标题集[set.sets.join('')];
          element.setAttribute('transform', `translate(${layout.left},${layout.top})`);
          container.append(element);
        }
        const radius = (子图宽度 / 2 - 20) / 2;
        const ellipseLayout = child.getChild(i).getComputedLayout();
        const ellipseX = ellipseLayout.left + ellipseLayout.width / 2;
        const ellipseY = ellipseLayout.top + ellipseLayout.height / 2;
        ellipse.element.setAttribute('cx', ellipseX);
        ellipse.element.setAttribute('cy', ellipseY);
        ellipse.element.setAttribute('rx', radius);
        ellipse.element.setAttribute('ry', radius * ellipticity);
        ellipse.element.setAttribute('fill', set.fill);
        container.append(ellipse.element);
        集合容器.append(container);
        new 椭圆({ x: ellipseX, y: ellipseY, radius, fill: this.主题 === 'light' ? 'white' : 'transparent', placeBottom: true }, this).渲染(container).then(({ element }) => {
          container.insertBefore(element, container.childNodes[0]);
        });
        if (set.content) {
          set.contentPosition = ellipseX + ',' + ellipseY;
          set.contentPositionAlign = Position.middleCenter;
          this.创建内容(set, false, container);
        }
      });
    }

    // 只有一个孤立的集合，可能有全集
    离散集单个集合布局(data, 椭圆集, 集合容器) {
      椭圆集[0].element.remove();
      const set = data[0];
      const { index = 0 } = set;
      const 椭圆参数 = this.全集.是否显示 ? { x: 50, y: 41, radius: 50, fill: set.fill } : { x: 110, y: 90, radius: 110, fill: set.fill };
      // 先添加一个白底
      new 椭圆({ ...椭圆参数, fill: 'white' }, this).渲染(集合容器);
      new 椭圆(椭圆参数, this).渲染(集合容器);
      if (set.content) {
        set.contentPosition = 椭圆参数.x + ',' + 椭圆参数.y;
        set.contentPositionAlign = Position.middleCenter;
        this.创建内容(set, false, 集合容器);
      }
      if (set.label) {
        this.创建标签(set, `离散集.原始集合[${index}]`);
      }
      if (set.arrow && this.全集.是否显示) {
        this.创建箭头及文本(set, `离散集.原始集合[${index}]`, true);
      }
    }

    子图布局(data, 椭圆集, overlaped, 类型, 子图宽度, 子图定位) {
      const 集合容器 = createSVGNode('g');
      集合容器.classList.add('aid-container');
      集合容器.setAttribute('transform', `translate(${子图定位})`);
      this.集合容器.push(集合容器);
      this.container.append(集合容器);
      if (类型 !== '离散集') {
        this.相交集包含集集合椭圆及内容布局(data, 椭圆集, overlaped, 类型, 子图宽度, 集合容器);
      } else if (data.length > 1) {
        this.离散集多个集合布局(data, 子图宽度, 椭圆集, 集合容器);
      } else if (data.length === 1) {
        this.离散集单个集合布局(data, 椭圆集, 集合容器);
      }

      const { width, height } = 集合容器.getBBox();

      return {
        dimensions: [width, height],
        集合容器,
        data,
      };
    }
  };

export default 子图布局Mixin;
