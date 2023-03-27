import { 基本图元, 单元格 } from '../图元';
import { createSVGElement } from '../../utils';

const 虚线边框显示样式 = '1px dashed #51a0ff';
const 虚线边框隐藏样式 = '1px dashed #51a0ff00';

export class 表格 extends 基本图元 {
  data: 表格定义;
  // 单元格的基准尺寸，为0则表示自适应
  单元格尺寸: [number, number];
  表头?: 单元格[];
  表体: 单元格[][] = [];
  行数: number = 0;
  列数: number = 0;
  表头容器?: HTMLElement;
  表体容器: HTMLElement;
  element: HTMLDivElement;
  内部虚线: boolean;

  constructor(data: 表格定义, 图形) {
    super(data, 图形);
    if (data.单元格尺寸) {
      this.单元格尺寸 = data.单元格尺寸;
    }
    if (data.内部虚线) {
      this.内部虚线 = true;
    }
    // 如果定义了行列数，则应初始化表格
    if (data.行数 && data.列数) {
      data.表体 = new Array(data.行数).fill('').map(() => {
        const 行 = [];
        行.push(...new Array(data.列数).fill({ content: '' }));
        return 行;
      });
    }
  }

  async 渲染() {
    this.element = document.createElement('div') as HTMLDivElement;
    const tableElement = document.createElement('table');
    this.element.append(tableElement);
    this.element.classList.add('aid-table');
    const { 表头, 表体 = [] } = this.data;
    if (表头) {
      this.表头 = [];
      this.表头容器 = document.createElement('thead');
      // 第一层表头
      const firstTR = document.createElement('tr');
      表头.forEach((cell) => {
        const th = document.createElement('th');
        if (cell.children && cell.children.length > 1) {
          th.colSpan = cell.children.length;
        }
        firstTR.append(th);
        cell.是否表头 = true;
        this.表头.push(new 单元格(cell, this.图形, { container: th, size: this.单元格尺寸 }));
      });
      this.表头容器.append(firstTR);
      // 第二层表头, 暂时只支持到二层表头
      const 有二层表头 = 表头.some((cell) => cell.children && cell.children.length > 0);
      if (有二层表头) {
        const secondTR = document.createElement('tr');
        表头.forEach((cell, index) => {
          const 单元格 = this.表头[index];
          if (cell.children?.length === 1) {
            单元格.children[0].container = document.createElement('th');
            secondTR.appendChild(单元格.children[0].container);
          } else if (cell.children?.length > 1) {
            cell.children.forEach((secondLevelCell, index) => {
              单元格.children[index].container = document.createElement('th');
              secondTR.appendChild(单元格.children[index].container);
            });
          }
        });
        this.表头容器.append(secondTR);
      }

      this.列数 = 表头.reduce((res, item) => {
        if (item.children && item.children.length > 1) {
          res += item.children.length;
        } else {
          res += 1;
        }
        return res;
      }, 0);
      tableElement.append(this.表头容器);
    } else if (表体.length > 0) {
      this.列数 = 表体[0].length;
    }
    this.表体容器 = document.createElement('tbody');
    this.行数 = 表体.length;
    表体.forEach((cells, rowIndex) => {
      const row = document.createElement('tr');
      if (!this.表体[rowIndex]) this.表体[rowIndex] = [];
      cells.forEach((cell, colIndex) => {
        const td = document.createElement('td');
        row.append(td);
        cell.动画 = this.data.动画 ? true : false;
        this.表体[rowIndex].push(
          new 单元格({ ...cell, colIndex, rowIndex }, this.图形, {
            container: td,
            size: this.单元格尺寸,
            ...(this.内部虚线 ? { 边框样式: this.获取虚线边框样式(rowIndex, colIndex) } : null),
          })
        );
      });
      this.表体容器.append(row);
    });
    tableElement.append(this.表体容器);
    this.图形.htmlContainer.append(this.element);
    if (this.表头) {
      for (const 表头 of this.表头) {
        await 表头.渲染();
        if (表头.children?.length > 0) {
          for (const child of 表头.children) {
            await child.渲染();
          }
        }
      }
    }
    for (const 表体行 of this.表体) {
      for (const 表体 of 表体行) {
        await 表体.渲染();
      }
    }
    // if(this.data.动画) this.element.style.opacity = '0';
    return this;
  }

  获取虚线边框样式(rowIndex, colIndex) {
    const rowTotalIndex = this.行数 - 1;
    const colTotalIndex = this.列数 - 1;
    let 虚线边框样式 = this.data.乘法 ? 虚线边框隐藏样式 : 虚线边框显示样式;
    if (rowIndex === 0 && colIndex === 0) {
      if (this.行数 === 1 && this.列数 === 1) {
        return {};
      }
      if (this.行数 === 1) {
        return { borderRight: 虚线边框样式 };
      }
      if (this.列数 === 1) {
        return { borderBottom: 虚线边框样式 };
      }
      return { borderRight: 虚线边框样式, borderBottom: 虚线边框样式 };
    } else if (rowIndex === 0 && colIndex < colTotalIndex) {
      if (this.行数 === 1) {
        return { borderRight: 虚线边框样式, borderLeft: 虚线边框样式 };
      }
      return { borderRight: 虚线边框样式, borderBottom: 虚线边框样式, borderLeft: 虚线边框样式 };
    } else if (rowIndex === 0 && colIndex === colTotalIndex) {
      if (this.行数 === 1) {
        return { borderLeft: 虚线边框样式 };
      }
      return { borderBottom: 虚线边框样式, borderLeft: 虚线边框样式 };
    } else if (rowIndex > 0 && colIndex === 0 && rowIndex < rowTotalIndex) {
      if (this.列数 === 1) {
        return { borderBottom: 虚线边框样式, borderTop: 虚线边框样式 };
      }
      return { borderRight: 虚线边框样式, borderBottom: 虚线边框样式, borderTop: 虚线边框样式 };
    } else if (colIndex === 0 && rowIndex === rowTotalIndex) {
      if (this.列数 === 1) {
        return { borderTop: 虚线边框样式 };
      }
      return { borderRight: 虚线边框样式, borderTop: 虚线边框样式 };
    } else if (colIndex > 0 && rowIndex === rowTotalIndex && colIndex < colTotalIndex) {
      return { borderRight: 虚线边框样式, borderTop: 虚线边框样式, borderLeft: 虚线边框样式 };
    } else if (colIndex === colTotalIndex && rowIndex === rowTotalIndex) {
      return { borderLeft: 虚线边框样式, borderTop: 虚线边框样式 };
    } else if (colIndex === colTotalIndex && rowIndex > 0) {
      return { borderLeft: 虚线边框样式, borderBottom: 虚线边框样式, borderTop: 虚线边框样式 };
    } else {
      return { borderLeft: 虚线边框样式, borderTop: 虚线边框样式, borderBottom: 虚线边框样式, borderRight: 虚线边框样式 };
    }
  }

  定位(x, y) {
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
  }
}
