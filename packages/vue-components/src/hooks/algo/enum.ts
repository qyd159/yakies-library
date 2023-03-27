/*
 * @Author: tan jia wen
 * @Date: 2022-06-28 11:20:17
 * @LastEditors: tan jia wen
 * @LastEditTime: 2022-07-06 18:02:02
 * @FilePath: \pmh-aea-client\packages\vue-components\src\hooks\algo\enum.ts
 */

export enum ECode {
  ERROR_COMMAND = -255, // 无效指令
  MEMORY_ERROR = -254, // 内存异常
  AEA_C1_RESULT_ERROR = -3, // 获取分数异常
  STANCE_ID_ERROR = -2, // 站位ID异常
  CAMERA_ERROR = -1, // 摄像头异常
  COMMAND_OK = 0, // 指令正常
}

/**
 * 算法发送指令
 */
export enum EAlgoSendCommand {
  FaceA1 = 'aeaa1_face', // 测评人脸站位识别
  AlgoA1 = 'aeaa1_algo', // 开启测评算法测评
  FaceC1 = 'aeac1_face', // 测评人脸站位识别
  AlgoC1 = 'aeac1_algo', // 开启测评算法测评
  Stop = 'stop', // 结束视频流
  Destroy = 'destroy', // 退出整个应用
  Capture = 'ui_capture', // 手动抓拍
  ServiceLog = 'service_log', // 日志
}

/**
 * 算法接收指令
 */
export enum EAlgoReceiveCommand {
  StreamStart = 'stream_start',
  StreamStop = 'stream_stop',
  AlgoA1 = 'aeaa1_algo', // 开启算法测评
  AlgoC1 = 'aeac1_algo', // 开启算法测评
  ScoreA1 = 'aeaa1_score', // 测评分数
  ScoreC1 = 'aeac1_score', // 测评分数
  Stance = 'stance', // 站位成功
}

/**
 * websocket 状态
 */
export enum EWebsocketStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
}
