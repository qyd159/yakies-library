/*
 * @Author: qinyadong
 * @Date: 2022-06-20 19:55:12
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-06-20 20:10:57
 * @FilePath: \universal-vite-vue3\packages\api\src\node.ts
 */
import localStorage from 'localStorage';
global.localStorage = localStorage;

export * from './'