/*
 * @Author: tan jia wen
 * @Date: 2022-04-24 19:08:51
 * @LastEditors: tan jia wen
 * @LastEditTime: 2022-06-28 11:42:34
 * @FilePath: \pmh-aea-client\src\render\hooks\useAlgo\types.ts
 */
import { InjectionKey } from 'vue';

export const CONFIGURATION_FILE = {
  LIBRARY_PATH:
    'http://aicp-test.oss-cn-shenzhen.aliyuncs.com/dm-openlink/test_algo/library_SICNU.json', //动作库lib
  JOINT_SCHEME_PATH:
    'http://aicp-test.oss-cn-shenzhen.aliyuncs.com/dm-openlink/test_algo/joint2d_scheme_28kpts_v3.json', //2d标定点
  INTERVAL_PATH:
    'http://aicp-test.oss-cn-shenzhen.aliyuncs.com/dm-openlink/test_algo/101_interval.json', //帧间隙匹配匹配动作库规则文件，指定关键帧时间段才进行动作匹配，只返回这个时间段动作的最高分
};

/**
 * 开启算法
 */
export interface IStartAlgo {
  left?: number;
  right?: number;
  center?: number;
  [key: string]: any;
}

/**
 * 站位信息
 */
export interface IStance {
  id: number;
  face: string;
  position: 'left' | 'center' | 'right';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface IScore {
  action_score: number;
  activation: number;
  algo_dancer_path: string;
  algo_path: string;
  algo_spline_path: string;
  mp4_path: string;
  space_score: number;
}
