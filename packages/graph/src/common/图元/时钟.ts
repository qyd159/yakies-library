import { 基本图元 } from '../图元';
import { 表盘类, 时针类, 分针类, 秒针类, 时钟中心点类, 角名类, 刻度类, 内轨迹类, 外轨迹类 } from './时钟集';
import { createSVGNode, getScale, getCanvasOffset, getMoveTime, getNumberOfTurns } from '../../utils';
import { getSvgClock } from '../../assets/时钟素材.js';
import { merge } from 'lodash-es';

// 时钟包括表盘、刻度、时针、分针、秒针，一般来说，它们是一体的，不可分割，所以我们将它看作一个图元。
class 时钟 extends 基本图元 {
    表盘: 表盘类;
    时针: 时针类;
    分针: 分针类;
    秒针?: 秒针类;
    时钟中心点: 时钟中心点类;
    角名?: Array<角名类> = [];
    内轨迹?: 内轨迹类;
    外轨迹?: 外轨迹类;
    刻度?: 刻度类;
    时: number;
    分: number;
    秒: number;
    显示秒针: boolean = false;
    显示指针名: boolean = false;
    显示角: Array<{ from: number; to: number; angleName: string; longR?: boolean; 辅助线?: Array<number>; 直角?: boolean }> = [];
    move?: { 时: number; 分: number; outside: boolean; inside: boolean };
    大刻度?: boolean = false;
    小刻度?: boolean = false;

    constructor(data, 图形?) {
        super(data, 图形);
        const { 时, 分, 秒, 显示秒针, 显示指针名, 大刻度, 小刻度, 显示角, move } = data;
        merge(this, { 时, 分, 秒, 显示秒针, 显示指针名, 大刻度, 小刻度, 显示角, move });
        let 圈 = undefined;
        let time = undefined;
        if (this.move.outside || this.move.inside) {
            圈 = getNumberOfTurns(时, 分, move.时, move.分);
            time = getMoveTime(圈);
            this.内轨迹 = new 内轨迹类({ 时: 时, 分: 分, move: move, time: time }, 图形);
            this.外轨迹 = new 外轨迹类({ 时: 时, 分: 分, move: move, time: time, 圈: 圈 }, 图形);
        }
        this.表盘 = new 表盘类({ x: 42, y: 42 }, 图形);
        this.时针 = new 时针类({ angle: this.时, needleName: this.显示指针名, time: time, move: move }, 图形);
        this.分针 = new 分针类({ angle: this.分, needleName: this.显示指针名, time: time, move: move, 圈: 圈 }, 图形);
        if (this.显示秒针) this.秒针 = new 秒针类({ angle: this.秒, needleName: this.显示指针名 }, 图形);
        this.时钟中心点 = new 时钟中心点类({}, 图形);
        this.显示角.forEach((item) => {
            this.角名.push(new 角名类(item, 图形));
        });
        this.刻度 = new 刻度类({ 小刻度: this.小刻度, 大刻度: this.大刻度, 分: this.分 }, 图形);
    }
    async 渲染(container = this.图形.container) {
        if (this.move.outside || this.move.inside) {
            this.内轨迹.渲染();
            this.外轨迹.渲染();
        }
        this.表盘.渲染();
        this.刻度.渲染();
        this.角名.forEach((item) => {
            item.渲染();
        });
        this.分针.渲染();
        this.时针.渲染();
        if (this.显示秒针) this.秒针.渲染();
        this.时钟中心点.渲染();
        return super.渲染(container);
    }

    解析表盘() {
        const newDoc = new DOMParser().parseFromString(getSvgClock(this.时, this.分, this.秒, this.显示秒针), 'text/xml');
        return document.importNode(newDoc.documentElement, true);
    }
    start() {
        this.时针.start();
        this.分针.start();
        this.内轨迹.start();
        this.外轨迹.start();
    }
}
export default 时钟;
