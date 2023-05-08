import { describe, expect, test, it, beforeAll } from 'vitest'
import { defHttp } from '../src/node'

let baota;

describe('测试百度网址', () => {
  it('访问www.baidu.com', async () => {
    const res = await defHttp.get({ url: 'https://www.baidu.com' })
    console.log(res)
  });
});
