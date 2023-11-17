import { describe, expect, test, it, beforeAll } from 'vitest'
import defHttp from '../src/node'

describe('测试宝塔面板接口', () => {
  it('执行定时任务', async () => {
    const md5 = require('md5');
    let request_time = new Date().getTime();
    let request_token = md5(String(request_time) + md5("9bt09cNSk2CzNBAEBEJmWR5PRhBxGa7V"));
    console.log(await defHttp.post({ url: `http://192.168.31.119:8888/crontab?action=StartTask&request_time=${request_time}&request_token=${request_token}&id=13` }, { isTransformResponse: false }))
  })
});
