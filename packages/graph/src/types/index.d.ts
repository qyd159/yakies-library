// https://stackoverflow.com/questions/56018167/typescript-does-not-copy-d-ts-files-to-build
import { 基本图元 } from '../common/图元';
declare global {
  declare interface GraphNode {
    id?: string;
    name?: string;
    node?: 基本图元;
  }

  declare interface 单元格定义 extends GraphNode {
    colspan?: number;
    rowspan?: number;
    rowIndex?: number;
    colIndex?: number;
    dimensions?: [number, number];
    content: string;
    children?: 单元格定义[];
    width?: number;
    color?: string;
    是否表头?: boolean;
    是否强调?: boolean;
    动画?: boolean;
  }
  declare interface 表格定义 extends GraphNode {
    表头?: 单元格定义[];
    表体?: 单元格定义[][];
    行数?: number;
    列数?: number;
    单元格尺寸?: [number, number];
    内部虚线?: boolean;
    动画?: boolean;
    乘法?: boolean;
  }

  declare interface 时间 extends GraphNode {
    时: number;
    分: number;
    秒?: number;
    显示秒针: boolean;
    显示指针名: boolean;
    大刻度?: boolean;
    小刻度?: boolean;
    显示角?: Array<{ from: number; to: number; angleName: string; 辅助线?: Array<number>; longR?: boolean; 直角?: boolean }>;
    move?: { 时: number; 分: number; outside: boolean; inside: boolean };
  }

  declare interface 边框样式 {
    borderTop?: string;
    borderRight?: string;
    borderBottom?: string;
    borderLeft?: string;
  }
  declare interface TreeNode extends GraphNode {
    level: number;
    deep: number;
    children?: GraphNode[];
    isRoot: boolean;
  }

  declare interface position {
    x: number;
    y: number;
  }

  declare interface rect {
    x?: number;
    y?: number;
    width: number;
    height: number;
  }

  declare interface 标签内容样式 {
    竖排?: boolean;
    width?: number;
    color?: string;
    padding?: string;
  }

  declare const svgCanvas: any;

  declare const MathJax: any;
}
