/*
 * @Author: your name
 * @Date: 2022-01-05 18:53:50
 * @LastEditTime: 2022-07-04 10:10:25
 * @LastEditors: qinyadong
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \aea-client\src\common\constant\biz\index.ts
 */
export * from './enum';
export * from './event';
export const EVALUATION_STORAGE_KEY = 'AEA-evaluation';
export const EVALUATION_FACE_KEY = 'AEA-face-results';
export const EVALUATION_USER_KEY = 'AEA-user-list';
export const EVALUATION_CAMERAS_KEY = 'AEA-cameras';

export const actionNameSuffixReg = /(l|r)?-g/;

export const actionMatchMap = {
  '101-01': {
    name: '站立拍皮球',
    graphics: 'hand-action',
    matches: [],
  },
  '101-02': {
    name: '晃球',
    graphics: 'full-action',
    matches: [],
  },
  '101-03': {
    name: '花式甩球',
    graphics: 'full-action',
    matches: [],
  },
  '101-04': {
    name: '墩墩滑冰',
    graphics: 'full-action',
    matches: [],
  },
  '102-01': {
    name: '单起单落',
    graphics: 'full-action',
    matches: [],
  },
  '102-02': {
    name: '双起双落',
    graphics: 'full-action',
    matches: [],
  },

  '103-01': {
    name: '手脚协调',
    graphics: 'full-action',
    matches: [],
  },
  '103-02': {
    name: '后跳踢步',
    graphics: 'leg-action',
    matches: [],
  },
  '103-03': {
    name: '勾绷脚',
    graphics: 'leg-action',
    matches: [],
  },
  '105-01': {
    name: '芭蕾二位手',
    graphics: 'hand-action',
    matches: [],
  },
  '105-02': {
    name: '芭蕾三位手',
    graphics: 'hand-action',
    matches: [],
  },
  '105-03': {
    name: '芭蕾七位手',
    graphics: 'hand-action',
    matches: [],
  },
  '201-01': {
    name: '小双晃手',
    graphics: 'hand-action',
    matches: [],
  },
  '201-02': {
    name: '大双晃手',
    graphics: 'hand-action',
    matches: [],
  },
  '201-03': {
    name: '上穿手',
    graphics: 'hand-action',
    matches: [],
  },
  '201-04': {
    name: '摇臂',
    graphics: 'hand-action',
    matches: [],
  },
  '202-01': {
    name: '胸前小波浪',
    graphics: 'hand-action',
    matches: [],
  },
  '202-02': {
    name: '双手旁大波浪',
    graphics: 'hand-action',
    matches: [],
  },
  '202-03': {
    name: '蹦跳双手大波浪',
    graphics: 'hand-action',
    matches: [],
  },
  '202-04': {
    name: '海浪翻腾',
    graphics: 'full-action',
    matches: [],
  },
  '202-05': {
    name: '飞鸟造型',
    graphics: 'full-action',
    matches: [],
  },
  '203-01': {
    name: '握扇',
    graphics: 'hand-action',
    matches: [],
  },
  '203-02': {
    name: '开扇',
    graphics: 'hand-action',
    matches: [],
  },
  '203-03': {
    name: '抱扇',
    graphics: 'hand-action',
    matches: [],
  },
  '204-01': {
    name: '蓉宝持盖碗',
    graphics: 'hand-action',
    matches: [],
  },
  '204-02': {
    name: '侧滚翻',
    graphics: 'full-action',
    matches: [],
  },
  '204-03': {
    name: '仰卧控腿+勾绷脚',
    graphics: 'full-action',
    matches: [],
  },
};
