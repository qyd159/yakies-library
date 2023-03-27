export enum AlgoSendCommand {
  Face = 'aeac1_face', // 开启人脸站位识别
  Algo = 'aeac1_algo', // 开启算法测评

  Result = 'aeac1_result', // 获取测评结果参数
  Stop = 'stop', // 结束视频流
  Destroy = 'destroy', // 退出整个应用
  Capture = 'ui_capture', // 手动抓拍
  ServiceLog = 'service_log', // 日志
}

export enum AlgoReceiveCommand {
  StreamStart = 'stream_start',
  StreamStop = 'stream_stop',
  Algo = 'aeac1_algo', // 开启算法测评
  Score = 'aeac1_score', // 测评分数
  Stance = 'stance', // 站位成功
}

export interface StanceDataInfo {
  id: number;
  face: string;
  position: 'left' | 'center' | 'right';
  x: number;
  y: number;
  w: number;
  h: number;
}
