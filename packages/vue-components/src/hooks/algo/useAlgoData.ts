/*
 * @Author: tan jia wen
 * @Date: 2022-06-28 16:11:06
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-16 14:08:44
 * @FilePath: \vue-components\src\hooks\algo\useAlgoData.ts
 */
import { ref, reactive } from 'vue';
import { IStance } from './types';
import { eventBus } from '@/utils';
const captured = ref(false);
const cameraLoaded = ref(false);
const stanceData = ref<Array<IStance>>();
const cameraError = ref(false);
const algoOn = ref(false);
const algoFn = reactive({
  webSocketFn: (...arg): void => { },
  bus: eventBus,
});
export function useAlgoData() {
  function resetCaptured() {
    captured.value = false;
    stanceData.value = undefined;
  }
  function resetCamera() {
    cameraError.value = false;
    cameraLoaded.value = false;
  }
  return {
    captured,
    stanceData,
    cameraError,
    cameraLoaded,
    algoOn,
    algoFn,
    resetCaptured,
    resetCamera,
  };
}
