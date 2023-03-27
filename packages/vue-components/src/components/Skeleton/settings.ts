/*
 * @Author: qinyadong
 * @Date: 2022-05-11 17:04:41
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-16 15:57:58
 * @FilePath: \vue-components\src\components\Skeleton\settings.ts
 */
import skeletonSchemaPlayback from './skeleton_schema_playback';
import skeletonSchemaRealtime from './skeleton_schema_realtime';
import skeletonSchemaCognize from './skeleton_schema_cognize';

const colors = {
  1: 'rgba(0, 161, 255, 1)',
  0.5: 'rgba(128, 205, 255, 0.5)',
  0: 'rgba(255, 255, 255, 0)',
};

const palette = (function (palette) {
  let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 256, 0);
  canvas.width = 256;
  canvas.height = 1;
  for (let i in palette) {
    gradient.addColorStop(+i, palette[i]);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  return ctx.getImageData(0, 0, 256, 1).data;
});

export function getRGBForValue(value, MAX_VALUE) {
  let valueRelative = Math.min(Math.max(value / MAX_VALUE, 0), 1);
  // 计算value的颜色索引
  let paletteIndex = Math.floor(valueRelative * 256) * 4;
  const generatedColors = palette(colors)
  return [
    generatedColors[paletteIndex],
    generatedColors[paletteIndex + 1],
    generatedColors[paletteIndex + 2],
    generatedColors[paletteIndex + 3] / 256,
  ];
}

export function playbackSkeletonSettings() {
  return {
    lines: skeletonSchemaPlayback.data.lines,
    points: skeletonSchemaPlayback.data.points,
  };
}

export function realtimeSkeletonSettings() {
  return {
    lines: skeletonSchemaRealtime.data.lines,
    points: skeletonSchemaRealtime.data.points,
  };
}

export function cognizeSkeletonSettings() {
  return {
    lines: skeletonSchemaCognize.data.lines,
    points: skeletonSchemaCognize.data.points,
  };
}

export const parts = {
  arms: [
    [25, 24],
    [24, 23],
    [23, 22],
    [17, 18],
    [18, 19],
    [19, 20],
    [15, 13],
    [13, 12],
    [22, 21],
    [21, 16],
    [16, 17],
  ],
  body: [
    [15, 13],
    [13, 12],
    [12, 11],
    [11, 0],
    [22, 21],
    [21, 16],
    [16, 17],
    [6, 0],
    [0, 1],
  ],
  legs: [
    [6, 7],
    [7, 8],
    [8, 9],
    [1, 2],
    [2, 3],
    [3, 4],
    [6, 0],
    [0, 1],
  ],
  right_wrist: [
    [25, 24],
    [24, 23],
  ],
  left_wrist: [
    [20, 19],
    [19, 18],
  ],
  right_elbow: [
    [24, 23],
    [23, 22],
  ],
  left_elbow: [
    [19, 18],
    [18, 17],
  ],
  left_shoulder: [
    [16, 17],
    [17, 18],
  ],
  right_shoulder: [
    [23, 22],
    [22, 21],
  ],
  chest: [
    [13, 12],
    [12, 11],
  ],
  waist: [
    [12, 11],
    [11, 0],
  ],
  left_knee: [
    [1, 2],
    [2, 3],
  ],
  right_knee: [
    [6, 7],
    [7, 8],
  ],
  left_hip: [
    [0, 1],
    [1, 2],
  ],
  right_hip: [
    [0, 6],
    [6, 7],
  ],
  left_ankle: [
    [2, 3],
    [3, 4],
  ],
  right_ankle: [
    [7, 8],
    [8, 9],
  ],
};

export enum SkeletonType {
  playback,
  realtime,
  cognize,
}
