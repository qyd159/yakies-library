import * as 韦恩图视觉参数 from './viewParams.js';
import { isObject } from 'lodash-es';

function parseItem(item) {
  let 内容布局, 标签布局, 箭头布局;
  for (let key in item) {
    if (key.indexOf('内容') !== -1) {
      if (!内容布局) 内容布局 = {};
      内容布局[key.substring(2)] = item[key];
      if (key.substring(2) === '文本对齐') {
        内容布局[key.substring(2)] = item[key] === '左' ? 0 : item[key] === '居中' ? 50 : 100;
      }
    }
    if (key.indexOf('标签') !== -1) {
      if (!标签布局) 标签布局 = {};
      标签布局[key.substring(2)] = item[key];
      if (key.substring(2) === '文本对齐') {
        标签布局[key.substring(2)] = item[key] === '左' ? 0 : item[key] === '居中' ? 50 : 100;
      }
    }
    if (key.indexOf('箭头') !== -1) {
      if (!箭头布局) 箭头布局 = {};
      箭头布局[key.substring(2)] = item[key];
      if (key.substring(2) === '文本对齐') {
        箭头布局[key.substring(2)] = item[key] === '左' ? 0 : item[key] === '居中' ? 50 : 100;
      }
    }
  }
  return { 内容布局, 标签布局, 箭头布局 };
}

function traverseObject(obj: Object, callback: Function) {
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value) || isObject(value)) {
      if (callback(obj, key, value) !== false) traverseObject(value, callback);
    }
  });
}

traverseObject(韦恩图视觉参数, (obj, key, value) => {
  if (key === '原始集合' || key === '衍生集合') {
    obj[key] = value.map((item) => parseItem(item));
  }
});

traverseObject(韦恩图视觉参数.相交集.全集, (obj, key, value) => {
  if (key === '全集') {
    obj[key] = { 位置尺寸: value.位置尺寸, ...parseItem(value) };
  }
});

traverseObject(韦恩图视觉参数.包含集.全集, (obj, key, value) => {
  if (key === '全集') {
    obj[key] = { 位置尺寸: value.位置尺寸, ...parseItem(value) };
  }
});
