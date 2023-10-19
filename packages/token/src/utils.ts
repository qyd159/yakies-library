export const _query = (url: string) => {
  const params:Record<string,string> = {};
  url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => {
    params[k] = v;
    return ''
  });
  return params;
};

/**
   * 环境判断
   */
export const getEnv = () => {
  const { origin } = window.location;
  if (origin.includes('local') || origin.includes('127.0.0')) return 'LOCAL';

  const originArr = origin.split('.');
  const isPro = originArr.length === 3;

  if (isPro) return 'PRO';

  return originArr[1].toUpperCase();
};

export const getDomain = () => {
  const { hostname } = window.location;
  const hostArr = hostname.split('.');
  const hostLen = hostArr.length;
  return `.${hostArr[hostLen - 2]}.${hostArr[hostLen - 1]}`;
};
