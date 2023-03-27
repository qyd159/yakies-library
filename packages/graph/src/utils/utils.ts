import { NS } from '../consts/namespaces';
import 基本图形 from '../common/图形';
import { 点 } from '../common/图元';
import { forOwn, isUndefined, isNull, isNaN, isString, isEmpty, isArray, pull, cloneDeep, merge, mergeWith } from 'lodash-es';
import { Position, TextAlign } from '../consts/enums';

const idPrefix = 'aid_';
const releasedIds = [];

export function getNextId() {
  const nextId = idPrefix + releasedIds.length;
  releasedIds.push(nextId);
  return nextId;
}

export function batchCreate(clazz, num: number, func, ...data) {
  const ins = [];
  for (let i = 0; i < num; i++) {
    const addedData = typeof func === 'function' ? func(i) : {};
    if (data.length) Object.assign(data[0], addedData);
    ins.push(new clazz(...data));
  }
  return ins;
}

export function countTextLines(ele) {
  var styles = window.getComputedStyle(ele, null);
  var lh = parseInt(styles.lineHeight, 10);
  var h = parseInt(styles.height, 10);
  var lc = Math.round(h / lh);
  return lc;
}

export function pruneEmpty(obj) {
  function emptyClause(value) {
    return isUndefined(value) || isNull(value) || isNaN(value) || (isString(value) && isEmpty(value)) || (typeof value === 'object' && isEmpty(prune(value)));
  }
  function prune(current) {
    forOwn(current, function (value, key) {
      if (emptyClause(value)) {
        delete current[key];
      }
    });
    // remove any leftover undefined values from the delete
    // operation on an array
    if (isArray(current)) pull(current, undefined);

    return current;
  }
  return prune(cloneDeep(obj));
  // Do not modify the original object, create a clone instead
}

export function getEnumKey(enumObj, val) {
  for (const key in enumObj) {
    if (enumObj[key] === val) {
      return key;
    }
  }
  return null;
}

export function normalizeEnum(enumObj) {
  const res = {};
  for (const key in enumObj) {
    if (typeof enumObj[key] === 'number') {
      res[key] = enumObj[key];
    }
  }
  return res;
}

let viewModeVal = false;
export function isViewMode() {
  return viewModeVal;
}
export function setViewMode(viewMode: boolean) {
  viewModeVal = viewMode;
}

let 图形val: 基本图形;
export function 获取当前图形() {
  return 图形val;
}

export function 设定当前图形(图形: 基本图形) {
  图形val = 图形;
}

// 表示韦恩图中的椭圆圆心的取样点分布方向，默认是x轴方向，也可能是y轴方向
let 取样方向: 'x' | 'y' = 'x';

export function 获取取样方向() {
  return 取样方向;
}

export function 设定取样方向(val: 'x' | 'y') {
  取样方向 = val;
}

export function 设置文本对齐锚点(point, position, textAlign, boundingBoxWidth, synckey?, objkey?) {
  if (typeof point === 'string') {
    point = point.split(',').map((a) => +a);
  }

  objkey &&
    new 点({ x: point[0], y: point[1] }, 获取当前图形(), { color: 'red' }).渲染().then(({ element }) => {
      element.dataset.objkey = objkey;
    });
  if (synckey) {
    switch (position) {
      case Position.topCenter:
      case Position.bottomCenter:
        point[0] -= boundingBoxWidth / 2;
        break;
      case Position.topRight:
      case Position.bottomRight:
        point[0] -= boundingBoxWidth;
        break;
      default:
        break;
    }
    const x = point[0] + (textAlign * boundingBoxWidth) / 100;
    new 点({ x, y: point[1] - 8 }, 获取当前图形()).渲染().then(({ element }) => {
      element.dataset.synckey = synckey;
      element.dataset.position = position;
      element.dataset.width = boundingBoxWidth;
      element.dataset.oldX = ((textAlign * boundingBoxWidth) / 100).toString();
    });
  }
}

/**
 * lodash的merge方法不能满足业务需求，对数组的合并需要有不同的规则
 * example: ourMerge({a:['b','c']},{a:['d','e','f']} 期望输出：{a:['d','e']}
 * 目前主要应用于视觉参数的合并
 *  */
export function ourMerge(object, ...sources) {
  return mergeWith(object, ...sources, function (objValue, srcValue, key, object, source, stack) {
    if (isArray(objValue) && isArray(srcValue)) {
      return merge(objValue, srcValue.slice(0, objValue.length));
    }
  });
}

/**
 * 将形如'topCenter'的字符串转换为['top','center']的数组
 * @param 定位参数
 * @returns [number, number]
 */
export function parsePositionStrings(定位参数: keyof typeof Position) {
  const parsed = 定位参数.replace(/[A-Z]/, function ($0) {
    return ',' + $0.toLowerCase();
  });
  return parsed.split(',');
}

export function getNameCoordinate(angle: number) {
  //将角度乘以 0.017453293 （2PI/360）即可转换为弧度。
  let x = 160 + Math.cos((90 - angle) * 0.017453293) * 131;
  let y = 160 - Math.sin((90 - angle) * 0.017453293) * 131;
  if (angle === 0 || angle === 360) {
    x = x - 14;
    y = y - 5;
  } else if (angle > 0 && angle < 30) {
    x = x - 10;
    y = y;
  } else if (angle >= 30 && angle < 90) {
    x = x;
    y = y;
  } else if (angle === 90) {
    y = y + 5;
  } else if (angle > 90 && angle < 180) {
    x = x + 2;
    y = y + 8;
  } else if (angle === 180) {
    x = x - 14;
    y = y + 12;
  } else if (angle > 180 && angle < 270) {
    x = x - 19;
    y = y + 13;
  } else if (angle === 270) {
    x = x - 23;
    y = y + 5;
  } else if (angle > 270 && angle < 360) {
    x = x - 28;
    y = y + 5;
  }

  return [x.toString(), y.toString()];
}

export function getMoveTime(圈: number) {
  let time = 0;

  if (圈 > 0 && 圈 <= 3) {
    time = 圈 * 3;
  } else if (圈 > 3 && 圈 <= 6) {
    time = 圈 * 3 * 0.7;
  } else if (圈 > 6 && 圈 <= 9) {
    time = 圈 * 3 * 0.6;
  } else if (圈 > 9 && 圈 <= 12) {
    time = 圈 * 3 * 0.5;
  }
  return time + 's';
}

export function getNumberOfTurns(时: number, 分: number, 时2: number, 分2: number) {
  时 = Math.floor(时 / 30);
  时2 = Math.floor(时2 / 30);
  分 = Math.floor(分 / 6);
  分2 = Math.floor(分2 / 6);
  let 时间差 = 0;
  if (时 > 时2) {
    //时间跨过了12时
    时间差 = (12 - 时 + 时2) * 60 + 分2 - 分;
  } else {
    时间差 = (时2 - 时) * 60 + 分2 - 分;
  }
  let 圈 = 时间差 / 60;
  return 圈;
}
