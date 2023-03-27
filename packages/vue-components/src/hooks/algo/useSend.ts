/*
 * @Author: tan jia wen
 * @Date: 2022-04-24 20:12:49
 * @LastEditors: tan jia wen
 * @LastEditTime: 2022-07-06 18:00:06
 * @FilePath: \pmh-aea-client\packages\vue-components\src\hooks\algo\useSend.ts
 */
import { EAlgoSendCommand } from './enum';
import { IStartAlgo, CONFIGURATION_FILE } from './types';
import { useAlgoData } from './useAlgoData';
import { applicationDeps } from '@/preload';
export function useSend() {
  const CONSOLE = applicationDeps.createScopeLog('use-send');
  const { algoFn } = useAlgoData();
  /**
   * 开启人脸检测
   */
  const startFace = (command: 'aeaa1_face' | 'aeac1_face') => {
    handleCommand(command, '开启人脸检测');
  };

  /**
   * 开启算法评测
   * @param {IStartAlgo} data 参数
   */
  const startAlgo = (
    command: 'aeac1_algo' | 'aeaa1_algo',
    data: IStartAlgo = {}
  ) => {
    handleCommand(command, '开启算法评测', {
      library_path: CONFIGURATION_FILE.LIBRARY_PATH,
      joint_scheme_path: CONFIGURATION_FILE.JOINT_SCHEME_PATH,
      interval_path: CONFIGURATION_FILE.INTERVAL_PATH,
      ...data,
    });
  };

  /**结束视频流 */
  const stopStream = () => {
    handleCommand(EAlgoSendCommand.Stop, '结束视频流');
  };

  /**销毁算法 */
  const destroy = () => {
    handleCommand(EAlgoSendCommand.Destroy, '销毁算法');
  };

  /**抓拍 */
  const capture = () => {
    handleCommand(EAlgoSendCommand.Capture, '抓拍');
  };

  /**算法服务日志 */
  const algoServiceLog = () => {
    handleCommand(EAlgoSendCommand.ServiceLog, '算法服务日志');
  };

  const handleCommand = (command: string, text: string, data = {}) => {
    try {
      const sendMsg = JSON.stringify({
        command,
        timestamp: Date.now(),
        data,
      });
      algoFn.webSocketFn(sendMsg);
      CONSOLE(`${text}：${sendMsg}`);
      return sendMsg;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    startFace,
    startAlgo,
    stopStream,
    capture,
    algoServiceLog,
    destroy,
  };
}
