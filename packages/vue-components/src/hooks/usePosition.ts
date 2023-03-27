/*
 * @Author: tan jia wen
 * @Date: 2022-04-25 16:16:24
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-06-15 11:53:21
 * @FilePath: \aea-clientc:\projects\aea-algo-brige\packages\algo-client\src\hooks\usePosition.ts
 */
import { reactive, watch,type Ref } from 'vue';
import {StanceDataInfo} from './types';

enum Position {
  Left,
  Right,
  Center,
}

export function usePosition(stanceData:Ref<Array<StanceDataInfo>>) {
  const positions = reactive([
    { position: [240, 40], isOk: false },
    { position: [1080, 40], isOk: false },
  ]);
  const position = ['left', 'right'];
  const faceUrlList = reactive([{ faceUrl: '' }, { faceUrl: '' }]);

  watch(
    () => [...stanceData.value],
    () => {
      if (stanceData.value.length > 0) {
        faceUrlList.forEach((item, index) => {
          const matched = stanceData.value.find((it) => {
            return it.position === position[index];
          });
          if (matched) {
            item.faceUrl = matched.face;
            positions[index].isOk = true;
          } else {
            item.faceUrl = '';
            positions[index].isOk = false;
          }
        });
      } else {
        reset();
      }
    },
    {
      deep: true,
    },
  );
  function reset() {
    positions.forEach((it) => (it.isOk = false));
    faceUrlList.forEach((it) => (it.faceUrl = ''));
  }
  return {
    positions,
    faceUrlList,
  };
}
