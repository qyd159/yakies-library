import defHttp from '../src';

describe('测试百度网址', () => {
  it('访问www.baidu.com', async () => {
    console.log(await defHttp.get({ url: 'https://www.baidu.com' }, { isTransformResponse: false }));
  });
});
