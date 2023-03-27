import { meanBy, flatten } from 'lodash-es';
import smooth from 'smooth-polyline';
import { playbackSkeletonSettings, realtimeSkeletonSettings, cognizeSkeletonSettings, getRGBForValue, parts, SkeletonType } from './settings';
import Color from 'color';

const highlightLineStrokeColor = 'rgba(67, 222, 178, 0.25)';
const highligtPointStrokeColor = 'rgba(67, 222, 178, 1)';

function getSkeletonSetting(type: SkeletonType) {
  switch (type) {
    case SkeletonType.realtime:
      return realtimeSkeletonSettings();
    case SkeletonType.playback:
      return playbackSkeletonSettings();
    case SkeletonType.cognize:
      return cognizeSkeletonSettings();
  }
}

export function skeletonDraw({ type, canvasWidth, canvasHeight, centered, maxScale = 10 }: { type: SkeletonType; canvasWidth: number; canvasHeight: number; centered: boolean; maxScale?: number }) {
  const { lines, points } = getSkeletonSetting(type);
  const {
    indexes: { head, arms, legs },
  } = lines;
  const {
    indexes: { head: pointHead, arms: pointArms, legs: pointLegs },
  } = points;
  let scale = 1,
    centerPoint = [canvasHeight / 2, canvasHeight / 2];
  return (ctx: CanvasRenderingContext2D, [skeletonData, trajectoryData, actionData], part?: keyof typeof parts) => {
    if (skeletonData.length === 0) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const connections = part ? parts[part] : lines.connections;
    const usedPoints = part ? flatten(parts[part]) : flatten(lines.connections);

    if (centered) {
      // 先计算参考点(所有点的几何中心)，从而可以使用ctx.transform设置偏移量
      // 然后计算缩放值，使得骨骼图恰好撑满画布的高度
      const allpoints = flatten(
        skeletonData.map((points) => {
          if (part) {
            return points.filter((point, index) => usedPoints.indexOf(index) !== -1);
          } else {
            return points;
          }
        })
      );
      centerPoint = [meanBy(allpoints, (point) => point[0]), meanBy(allpoints, (point) => point[1])];
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
      scale = Math.min((canvasHeight - 100) / distanceY, (canvasWidth - 200) / distanceX, maxScale);
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.scale(scale, scale);
    }
    let idx = 0;
    for (const keypoints of skeletonData) {
      const action = actionData && actionData[idx]?.data;
      if (keypoints.length === 0) continue;
      ctx.lineWidth = lines.width;
      for (let i = 0; i < connections.length; i++) {
        const connection = connections[i];
        ctx.strokeStyle = Color.rgb(lines.color).alpha(0.5).hex();
        if (action && action.length > 0) {
          for (const match of action) {
            if (match.frame_match.action_name.indexOf('01') === 0 && head.indexOf(i) !== -1) {
              ctx.strokeStyle = highlightLineStrokeColor;
            } else if (match.frame_match.action_name.indexOf('02') === 0 && arms.indexOf(i) !== -1) {
              ctx.strokeStyle = highlightLineStrokeColor;
            } else if (match.frame_match.action_name.indexOf('03') === 0 && legs.indexOf(i) !== -1) {
              ctx.strokeStyle = highlightLineStrokeColor;
            } else if (match.frame_match.action_name.indexOf('04') === 0) {
              ctx.strokeStyle = highlightLineStrokeColor;
            }
          }
        }
        ctx.beginPath();
        ctx.moveTo(keypoints[connection[0]][0] - centerPoint[0], keypoints[connection[0]][1] - centerPoint[1]);
        ctx.lineTo(keypoints[connection[1]][0] - centerPoint[0], keypoints[connection[1]][1] - centerPoint[1]);
        ctx.stroke();
      }

      for (let i = 0; i < keypoints.length - 1; i++) {
        if (i === 0 && usedPoints.indexOf(i) !== -1) {
          ctx.beginPath();
          ctx.fillStyle = Color.rgb(points.color).hex();
          ctx.arc(keypoints[0][0] - centerPoint[0], keypoints[0][1] - centerPoint[1], points.width[0], 0, 2 * Math.PI);
          ctx.fill();
        }
        if (part && usedPoints.indexOf(i + 1) === -1) {
          continue;
        }

        const j = i + 1;
        ctx.beginPath();
        ctx.fillStyle = Color.rgb(points.color).hex();
        if (action && action.length > 0) {
          for (const match of action) {
            if (match.frame_match.action_name.indexOf('01') === 0 && pointHead.indexOf(i) !== -1) {
              ctx.fillStyle = highligtPointStrokeColor;
            } else if (match.frame_match.action_name.indexOf('02') === 0 && pointArms.indexOf(i) !== -1) {
              ctx.fillStyle = highligtPointStrokeColor;
            } else if (match.frame_match.action_name.indexOf('03') === 0 && pointLegs.indexOf(i) !== -1) {
              ctx.fillStyle = highligtPointStrokeColor;
            } else if (match.frame_match.action_name.indexOf('04') === 0) {
              ctx.fillStyle = highligtPointStrokeColor;
            }
          }
        }
        ctx.arc(keypoints[j][0] - centerPoint[0], keypoints[j][1] - centerPoint[1], points.width[j], 0, 2 * Math.PI);
        ctx.fill();
      }
      idx++;
    }
    for (let { trajectory_left, trajectory_right } of trajectoryData) {
      if (!trajectory_left || trajectory_left.length === 0 || !trajectory_right || trajectory_right.length === 0) continue;
      trajectory_left = smooth(trajectory_left.slice(-50));
      trajectory_right = smooth(trajectory_right.slice(-50));
      ctx.lineWidth = lines.width;
      ctx.lineCap = 'round'; // 配置圆形的结束线帽，保证线在转折处能够紧密结合
      let prevLeftPoint = trajectory_left[0],
        leftPointIndex = 0;
      for (const leftPoint of trajectory_left.slice(1)) {
        let gradient = ctx.createLinearGradient(prevLeftPoint[0] - centerPoint[0], prevLeftPoint[1] - centerPoint[1], leftPoint[0] - centerPoint[0], leftPoint[1] - centerPoint[1]);
        // 获取开始位置的颜色和结束位置的颜色
        let gradientStartRGB = getRGBForValue(leftPointIndex, trajectory_left.length);
        let gradientEndRGB = getRGBForValue(leftPointIndex + 1, trajectory_left.length);
        // ctx.globalAlpha = (gradientStartRGB[3] + gradientEndRGB[3]) / 2;
        gradient.addColorStop(0, 'rgba(' + gradientStartRGB.join(',') + ')');
        gradient.addColorStop(1, 'rgba(' + gradientEndRGB.join(',') + ')');
        // 绘制线
        ctx.strokeStyle = gradient;
        leftPointIndex++;
        ctx.beginPath();
        ctx.moveTo(prevLeftPoint[0] - centerPoint[0], prevLeftPoint[1] - centerPoint[1]);
        ctx.lineTo(leftPoint[0] - centerPoint[0], leftPoint[1] - centerPoint[0]);
        ctx.stroke();
        prevLeftPoint = leftPoint;
      }
      let prevRightPoint = trajectory_right[0],
        rightPointIndex = 0;
      for (const rightPoint of trajectory_right.slice(1)) {
        let gradient = ctx.createLinearGradient(prevRightPoint[0] - centerPoint[0], prevRightPoint[1] - centerPoint[1], rightPoint[0] - centerPoint[0], rightPoint[1] - centerPoint[1]);
        // 获取开始位置的颜色和结束位置的颜色
        let gradientStartRGB = getRGBForValue(rightPointIndex, trajectory_right.length);
        let gradientEndRGB = getRGBForValue(rightPointIndex + 1, trajectory_right.length);
        gradient.addColorStop(0, 'rgba(' + gradientStartRGB.join(',') + ')');
        gradient.addColorStop(1, 'rgba(' + gradientEndRGB.join(',') + ')');
        rightPointIndex++;
        // 绘制线
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(prevRightPoint[0] - centerPoint[0], prevRightPoint[1] - centerPoint[1]);
        ctx.lineTo(rightPoint[0] - centerPoint[0], rightPoint[1] - centerPoint[1]);
        ctx.stroke();
        prevRightPoint = rightPoint;
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}
