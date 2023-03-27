/*
 * @Author: qinyadong
 * @Date: 2022-05-11 15:20:29
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-07-02 18:23:35
 * @FilePath: \aea-client\src\render\components\Skeleton\skeleton.ts
 */

import { meanBy, flatten } from 'lodash';
import smooth from 'smooth-polyline';
import {
  playbackSkeletonSettings,
  realtimeSkeletonSettings,
  cognizeSkeletonSettings,
  getRGBForValue,
  parts,
  SkeletonType,
} from './settings';
import Color from 'color';

const highlightLineStrokeColor = 'rgba(67, 222, 178, 0.25)';
const highligtPointStrokeColor = 'rgba(67, 222, 178, 1)';

type SkeletonSetting = DeepPartial<
  ReturnType<typeof realtimeSkeletonSettings> &
    ReturnType<typeof playbackSkeletonSettings> &
    ReturnType<typeof cognizeSkeletonSettings>
>;

function getSkeletonSetting(type: SkeletonType): SkeletonSetting {
  switch (type) {
    case SkeletonType.realtime:
      return realtimeSkeletonSettings();
    case SkeletonType.playback:
      return playbackSkeletonSettings();
    case SkeletonType.cognize:
      return cognizeSkeletonSettings();
  }
}

export function skeletonDraw({
  type,
  canvasWidth,
  canvasHeight,
  centered,
  canvasScale,
  maxScale = 5,
}: {
  type: SkeletonType;
  canvasWidth: number;
  canvasHeight: number;
  centered: boolean;
  canvasScale: number;
  maxScale?: number;
}) {
  const { lines, points } = getSkeletonSetting(type);
  const {
    indexes: { head, arms, legs },
  } = lines;
  const {
    indexes: { head: pointHead, arms: pointArms, legs: pointLegs },
  } = points;
  let scale = 1,
    // 居中的情况下才会使用centerPoint,所以默认设置为0
    centerPoint = [0, 0];
  return (
    ctx: CanvasRenderingContext2D,
    [skeletonData, trajectoryData, actionData],
    part?: keyof typeof parts
  ) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (skeletonData.length === 0 || skeletonData[0].length === 0) return;
    const connections = part ? parts[part] : lines.connections;
    const usedPoints = part ? flatten(parts[part]) : flatten(lines.connections);
    let pointsWidth = points.width;
    let linesWidth = lines.width;
    if (centered) {
      centerPoint = [canvasWidth / 2, canvasHeight / 2];
      // 先计算参考点(所有点的几何中心)，从而可以使用ctx.transform设置偏移量
      // 然后计算缩放值，使得骨骼图恰好撑满画布的高度
      const allpoints = flatten(
        skeletonData.map((points) => {
          if (part) {
            return points.filter(
              (point, index) => usedPoints.indexOf(index) !== -1
            );
          } else {
            return points;
          }
        })
      );
      centerPoint = [
        meanBy(allpoints, (point) => point[0]),
        meanBy(allpoints, (point) => point[1]),
      ];
      const rangeY = [allpoints[0][1], allpoints[1][1]];
      const rangeX = [allpoints[0][0], allpoints[1][0]];
      allpoints.forEach((point) => {
        if (point[0] < rangeX[0]) {
          rangeX[0] = point[0];
        } else if (point[0] > rangeX[1]) {
          rangeX[1] = point[0];
        }
        if (point[1] < rangeY[0]) {
          rangeY[0] = point[1];
        } else if (point[1] > rangeY[1]) {
          rangeY[1] = point[1];
        }
      });
      const distanceX = rangeX[1] - rangeX[0];
      const distanceY = rangeY[1] - rangeY[0];
      scale = Math.min(
        (canvasHeight - 200) / distanceY,
        (canvasWidth - 200) / distanceX,
        maxScale
      );
      pointsWidth = points.width.map((item) => item / (canvasScale * scale));
      linesWidth = linesWidth / (canvasScale * scale);
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.scale(scale, scale);
    }
    let idx = 0;
    for (const keypoints of skeletonData) {
      const action = actionData && actionData[idx]?.data;
      if (keypoints.length === 0) continue;
      ctx.lineWidth = linesWidth;

      // 画线
      for (let i = 0; i < connections.length; i++) {
        const connection = connections[i];
        ctx.strokeStyle = lines.alpha
          ? `rgba(${lines.color.join(',')},${lines.alpha})`
          : `rgb(${lines.color.join(',')})`;
        if (action && action.length > 0) {
          for (const match of action) {
            if (
              match.frame_match.action_name.indexOf('01') === 0 &&
              head.indexOf(i) !== -1
            ) {
              ctx.strokeStyle = highlightLineStrokeColor;
            } else if (
              match.frame_match.action_name.indexOf('02') === 0 &&
              arms.indexOf(i) !== -1
            ) {
              ctx.strokeStyle = highlightLineStrokeColor;
            } else if (
              match.frame_match.action_name.indexOf('03') === 0 &&
              legs.indexOf(i) !== -1
            ) {
              ctx.strokeStyle = highlightLineStrokeColor;
            } else if (match.frame_match.action_name.indexOf('04') === 0) {
              ctx.strokeStyle = highlightLineStrokeColor;
            }
          }
        }
        ctx.beginPath();
        ctx.moveTo(
          keypoints[connection[0]][0] - centerPoint[0],
          keypoints[connection[0]][1] - centerPoint[1]
        );
        ctx.lineTo(
          keypoints[connection[1]][0] - centerPoint[0],
          keypoints[connection[1]][1] - centerPoint[1]
        );
        ctx.stroke();
      }

      // 画点
      for (let i = 0; i < keypoints.length - 1; i++) {
        if (i === 0 && usedPoints.indexOf(i) !== -1) {
          ctx.beginPath();
          ctx.fillStyle = Color.rgb(points.color).hex();
          ctx.arc(
            keypoints[0][0] - centerPoint[0],
            keypoints[0][1] - centerPoint[1],
            pointsWidth[0],
            0,
            2 * Math.PI
          );
          ctx.fill();
          if (type === SkeletonType.realtime) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${points.color.join(',')}, 0.3)`;
            ctx.arc(
              keypoints[0][0] - centerPoint[0],
              keypoints[0][1] - centerPoint[1],
              pointsWidth[0] * 2,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }
        if (part && usedPoints.indexOf(i + 1) === -1) {
          continue;
        }

        const j = i + 1;
        // 以鼻子为中心点，绘制圆环，代表头部
        if (j === 14 && type === SkeletonType.realtime) {
          // ctx.fillStyle = `rgba(${points.color.join(',')}, 0.5)`;
          // ctx.beginPath();
          // const R1 = 80;
          // const R2 = 50;
          // ctx.arc(keypoints[j][0], keypoints[j][1], R1, 0, Math.PI * 2);
          // // ctx.moveTo(WIDTH / 2 + R2, HEIGHT / 2);
          // ctx.arc(keypoints[j][0], keypoints[j][1], R2, 0, Math.PI * 2, true);
          // ctx.fill();
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = Color.rgb(points.color).hex();
        if (action && action.length > 0) {
          for (const match of action) {
            if (
              match.frame_match.action_name.indexOf('01') === 0 &&
              pointHead.indexOf(i) !== -1
            ) {
              ctx.fillStyle = highligtPointStrokeColor;
            } else if (
              match.frame_match.action_name.indexOf('02') === 0 &&
              pointArms.indexOf(i) !== -1
            ) {
              ctx.fillStyle = highligtPointStrokeColor;
            } else if (
              match.frame_match.action_name.indexOf('03') === 0 &&
              pointLegs.indexOf(i) !== -1
            ) {
              ctx.fillStyle = highligtPointStrokeColor;
            } else if (match.frame_match.action_name.indexOf('04') === 0) {
              ctx.fillStyle = highligtPointStrokeColor;
            }
          }
        }
        ctx.arc(
          keypoints[j][0] - centerPoint[0],
          keypoints[j][1] - centerPoint[1],
          pointsWidth[j],
          0,
          2 * Math.PI
        );
        ctx.fill();
        if (type === SkeletonType.realtime) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${points.color.join(',')}, 0.3)`;
          ctx.arc(
            keypoints[j][0] - centerPoint[0],
            keypoints[j][1] - centerPoint[1],
            pointsWidth[j] * 2,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
      idx++;
    }
    for (let { trajectory_left, trajectory_right } of trajectoryData) {
      if (
        !trajectory_left ||
        trajectory_left.length === 0 ||
        !trajectory_right ||
        trajectory_right.length === 0
      )
        continue;
      trajectory_left = smooth(trajectory_left.slice(-50));
      trajectory_right = smooth(trajectory_right.slice(-50));
      ctx.lineWidth = linesWidth;
      ctx.lineCap = 'round'; // 配置圆形的结束线帽，保证线在转折处能够紧密结合
      let prevLeftPoint = trajectory_left[0],
        leftPointIndex = 0;
      for (const leftPoint of trajectory_left.slice(1)) {
        let gradient = ctx.createLinearGradient(
          prevLeftPoint[0] - centerPoint[0],
          prevLeftPoint[1] - centerPoint[1],
          leftPoint[0] - centerPoint[0],
          leftPoint[1] - centerPoint[1]
        );
        // 获取开始位置的颜色和结束位置的颜色
        let gradientStartRGB = getRGBForValue(
          leftPointIndex,
          trajectory_left.length
        );
        let gradientEndRGB = getRGBForValue(
          leftPointIndex + 1,
          trajectory_left.length
        );
        // ctx.globalAlpha = (gradientStartRGB[3] + gradientEndRGB[3]) / 2;
        gradient.addColorStop(0, 'rgba(' + gradientStartRGB.join(',') + ')');
        gradient.addColorStop(1, 'rgba(' + gradientEndRGB.join(',') + ')');
        // 绘制线
        ctx.strokeStyle = gradient;
        leftPointIndex++;
        ctx.beginPath();
        ctx.moveTo(
          prevLeftPoint[0] - centerPoint[0],
          prevLeftPoint[1] - centerPoint[1]
        );
        ctx.lineTo(
          leftPoint[0] - centerPoint[0],
          leftPoint[1] - centerPoint[1]
        );
        ctx.stroke();
        prevLeftPoint = leftPoint;
      }
      let prevRightPoint = trajectory_right[0],
        rightPointIndex = 0;
      for (const rightPoint of trajectory_right.slice(1)) {
        let gradient = ctx.createLinearGradient(
          prevRightPoint[0] - centerPoint[0],
          prevRightPoint[1] - centerPoint[1],
          rightPoint[0] - centerPoint[0],
          rightPoint[1] - centerPoint[1]
        );
        // 获取开始位置的颜色和结束位置的颜色
        let gradientStartRGB = getRGBForValue(
          rightPointIndex,
          trajectory_right.length
        );
        let gradientEndRGB = getRGBForValue(
          rightPointIndex + 1,
          trajectory_right.length
        );
        gradient.addColorStop(0, 'rgba(' + gradientStartRGB.join(',') + ')');
        gradient.addColorStop(1, 'rgba(' + gradientEndRGB.join(',') + ')');
        rightPointIndex++;
        // 绘制线
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(
          prevRightPoint[0] - centerPoint[0],
          prevRightPoint[1] - centerPoint[1]
        );
        ctx.lineTo(
          rightPoint[0] - centerPoint[0],
          rightPoint[1] - centerPoint[1]
        );
        ctx.stroke();
        prevRightPoint = rightPoint;
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}
