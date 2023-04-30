/*
 * @Author: tan jia wen
 * @Date: 2022-04-24 10:12:59
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-18 11:11:30
 * @FilePath: \vue-components\src\hooks\algo\useAlgo.ts
 */
import {
  reactive,
  watch,
  unref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
} from 'vue';
import { useWebSocket } from '@vueuse/core';
import {
  EAlgoReceiveCommand,
  EAlgoSendCommand,
  ECode,
  EWebsocketStatus,
} from './enum';
import { useAlgoData } from './useAlgoData';
import { applicationDeps } from '@/preload';
/**
 *连接算法服务
 * @param server websocket 地址
 * @example
 * ```tsx
 * useAlgo('ws://localhost:8086')
 * ```
 * @returns
 */
export function useAlgo(server?: string) {
  const CONSOLE = applicationDeps.createScopeLog!('use-algo');
  const host = '127.0.0.1';
  const port = '8086';
  const state = reactive({
    server: server ? server : `ws://${host}:${port}`,
  });
  const { status, data, send, close, open } = useWebSocket(state.server, {
    autoReconnect: true,
    heartbeat: false,
  });
  const { captured, cameraLoaded, stanceData, cameraError, algoOn, algoFn } =
    useAlgoData();
  algoFn.webSocketFn = send;
  watch(
    () => unref(data),
    () => {
      if (unref(data)) {
        try {
          CONSOLE(`算法返回数据${unref(data)}`);
          const result = JSON.parse(unref(data));
          const { code, command, error_msg, data: algoData } = result;
          if (code === ECode.COMMAND_OK) {
            cameraError.value = false;
            switch (command) {
              // 摄像头已打开
              case EAlgoReceiveCommand.StreamStart:
                cameraLoaded.value = true;
                CONSOLE(`摄像头已打开`);
                break;
              // 站位成功
              case EAlgoReceiveCommand.Stance:
                CONSOLE('收到站位响应');
                if (unref(captured)) return;
                if (Array.isArray(algoData) && algoData.length > 0) {
                  captured.value = true;
                  stanceData.value = algoData;
                }
                break;
              // 算法已开启
              case EAlgoReceiveCommand.AlgoA1:
              case EAlgoReceiveCommand.AlgoC1:
                CONSOLE('算法开启成功');
                break;
              // 算法返回分数
              case EAlgoReceiveCommand.ScoreA1:
              case EAlgoReceiveCommand.ScoreC1:
                algoFn.bus.emit('score-data', algoData);
                CONSOLE(`算法返回分数:${unref(data)}`);
                break;
              default:
                // 其他指令业务处理
                algoFn.bus.emit('socket-data', { data: result });
                break;
            }
          } else if (code === ECode.CAMERA_ERROR) {
            CONSOLE.error!(`摄像头异常--CAMERA_ERROR--${error_msg}`);
            cameraError.value = true;
          }
        } catch (error) {
          cameraError.value = true;
          CONSOLE.error!(`websocket data解析错误`);
        }
      }
    }
  );
  watch(
    () => status.value,
    (status) => {
      if (status === EWebsocketStatus.Closed) {
        if (!unref(algoOn)) return;
        CONSOLE.error!('websocket已断开');
        algoOn.value = false;
      } else if (status === EWebsocketStatus.Open) {
        if (unref(algoOn)) return;
        CONSOLE('websocket已打开');
        algoOn.value = true;
      }
    }
  );

  onMounted(() => {
    open();
  });

  onBeforeUnmount(() => {
    send(
      JSON.stringify({
        command: EAlgoSendCommand.Destroy,
        timestamp: Date.now(),
      })
    );
  });

  onUnmounted(() => {
    close();
  });

  return {
    send,
    status,
    data,
  };
}
