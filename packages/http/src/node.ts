import localStorage from 'localStorage';
import defHttp from './'
global.localStorage = localStorage;

export default defHttp

export * from './'
