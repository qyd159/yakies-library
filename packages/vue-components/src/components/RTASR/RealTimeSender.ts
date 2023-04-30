import Recorder from 'recorder-core';
import 'recorder-core/src/engine/wav';
import './utils';

const testSampleRate = 8000;
const SendInterval = 300; // mp3 chunk数据会缓冲，当pcm的累积时长达到这个时长，就会传输发送。这个值在takeoffEncodeChunk实现下，使用0也不会有性能上的影响。
const testBitRate = 16;

// 重置环境
export const RealTimeSendTryReset = function (type) {
  realTimeSendTryType = type;
  realTimeSendTryTime = 0;
};

let realTimeSendTryType;
let realTimeSendTryEncBusy;
let realTimeSendTryTime = 0;
let realTimeSendTryNumber;
let transferUploadNumberMax;
let realTimeSendTryChunk: { data: Int16Array; index: number; sampleRate: number } | null;

// =====实时处理核心函数==========
export const RealTimeSendTry = function (rec, isClose, sendFunc) {
  const t1 = Date.now();
  if (realTimeSendTryTime == 0) {
    realTimeSendTryTime = t1;
    realTimeSendTryEncBusy = 0;
    realTimeSendTryNumber = 0;
    transferUploadNumberMax = 0;
    realTimeSendTryChunk = null;
  }
  if (!isClose && t1 - realTimeSendTryTime < SendInterval) {
    return; // 控制缓冲达到指定间隔才进行传输
  }
  realTimeSendTryTime = t1;
  const number = ++realTimeSendTryNumber;

  if (!rec.buffers) {
    TransferUpload(number, null, null, 0, null, isClose, sendFunc);
    return;
  }
  // 借用SampleData函数进行数据的连续处理，采样率转换是顺带的
  const chunk: { data: Int16Array; index: number; sampleRate: number } = Recorder.SampleData(
    rec.buffers,
    rec.srcSampleRate,
    testSampleRate,
    realTimeSendTryChunk,
    { frameType: isClose ? '' : realTimeSendTryType }
  );
  // 清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
  for (let i = realTimeSendTryChunk ? realTimeSendTryChunk.index : 0; i < chunk.index; i++) {
    rec.buffers[i] = null;
  }
  realTimeSendTryChunk = chunk;

  // 没有新数据，或结束时的数据量太小，不能进行mock转码
  if (chunk.data.length == 0 || (isClose && chunk.data.length < 2000)) {
    TransferUpload(number, null, null, 0, null, isClose, sendFunc);
    return;
  }

  // 实时编码队列阻塞处理
  if (!isClose) {
    if (realTimeSendTryEncBusy >= 2) {
      console.log('编码队列阻塞，已丢弃一帧', 1);
      return;
    }
  }
  realTimeSendTryEncBusy++;

  // 通过mock方法实时转码成mp3、wav
  const encStartTime = Date.now();
  const recMock = Recorder({
    type: realTimeSendTryType,
    sampleRate: testSampleRate, // 采样率
    bitRate: testBitRate, // 比特率
  });
  recMock.mock(chunk.data, chunk.sampleRate);
  recMock.stop(
    function (blob, _duration) {
      realTimeSendTryEncBusy && realTimeSendTryEncBusy--;
      blob.encTime = Date.now() - encStartTime;
      // 发送裸pcm和编码后的片段
      // @ts-ignore
      TransferUpload(number, new Blob([realTimeSendTryChunk.data]), blob, 0, null, isClose, sendFunc);
    },
    function (msg) {
      realTimeSendTryEncBusy && realTimeSendTryEncBusy--;

      // 转码错误？没想到什么时候会产生错误！
      console.log('不应该出现的错误:' + msg, 1);
    }
  );

  // if (testOutputWavLog && realTimeSendTryType == "mp3") {
  //   // 测试输出一份wav，方便对比数据
  //   const recMock2 = Recorder({
  //     type: "wav"
  //     , sampleRate: testSampleRate
  //     , bitRate: 16
  //   });
  //   recMock2.mock(chunk.data, chunk.sampleRate);
  //   recMock2.stop(function (blob, duration) {
  //     const logMsg = "No." + (number < 100 ? ("000" + number).substr(-3) : number);
  //     console.log(blob, duration, recMock2, logMsg);
  //   });
  // };
};

// =====数据传输函数==========
export const TransferUpload = function (number, blobOrNull, encodedBlob, duration, blobRec, isClose, sendFunc) {
  transferUploadNumberMax = Math.max(transferUploadNumberMax, number);
  if (blobOrNull) {
    const blob = blobOrNull;
    // const encTime = blob.encTime;

    // *********Read As Base64***************
    // var reader = new FileReader();
    // reader.onloadend = function () {
    //   var base64 = (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result) || [])[1];

    //   //可以实现
    //   //WebSocket send(base64) ...
    //   //WebRTC send(base64) ...
    //   //XMLHttpRequest send(base64) ...

    //   //这里啥也不干
    // };
    // reader.readAsDataURL(blob);

    // *********Blob***************
    // 可以实现
    // WebSocket send(blob) ...
    // WebRTC send(blob) ...
    // XMLHttpRequest send(blob) ...
    if (sendFunc) {
      sendFunc(blob, encodedBlob);
    }
    // 这里仅 console send 意思意思
    // const numberFail =
    //   number < transferUploadNumberMax ? '<span style="color:red">顺序错乱的数据，如果要求不高可以直接丢弃，或者调大SendInterval试试</span>' : '';
    // const logMsg = 'No.' + (number < 100 ? ('000' + number).substr(-3) : number) + numberFail;

    // console.log(blob, duration, blobRec, logMsg + "花" + ("___" + encTime).substr(-3) + "ms");
  } else {
    if (sendFunc) {
      sendFunc();
    }
  }

  if (isClose) {
    console.log('No.' + (number < 100 ? ('000' + number).substr(-3) : number) + ':已停止传输');
  }
};
