import { describe, expect, test, it, beforeAll } from 'vitest'
import { defHttp } from '../src/node'
const BaoTa = require('baota');

let baota;

describe('测试宝塔面板接口', () => {
  beforeAll(() => {
    const config = {
      host: 'http://192.168.31.119:8888',       // 请修改成自己宝塔面板地址
      key: 'smUoD0TejMxTOhkXw4Ya0pI1pLT5sdQ3',                // 在 面板设置 里查看
      // proxy: 'http://127.0.0.1:9999',    // 代理，如不需代理，请勿填写
    }
    baota = new BaoTa(config);
  })
  it('获取系统基础统计', async () => {
    await new Promise<void>((resolve, reject) => {
      baota.getSystemTotal((err, data) => {
        console.log(data)
        resolve()
      })
    });
  });

  it('执行定时任务', async () => {
    const md5 = require('md5');
    let request_time = new Date().getTime();
    let request_token = md5(String(request_time) + md5("smUoD0TejMxTOhkXw4Ya0pI1pLT5sdQ3"));
    console.log(await defHttp.post({ url: `http://192.168.31.220:8888/crontab?action=StartTask&request_time=${request_time}&request_token=${request_token}&id=6` }, { isTransformResponse: false }))
  })
});
