/******************
《【教程】实时转码并上传-mp3专版》
作者：高坚果
时间：2020-5-16 16:58:48

mp3编码器实现了实时转码，能做到边录音边转码；通过takeoffEncodeChunk回调选项，可以实时接收到mp3转码二进制片段结果，将所有片段拼接到一起即为一个完整的mp3。

如果不需要获得最终结果，可实时清理缓冲数据（需延迟清理），避免占用过多内存，想录多久就录多久。

本方法和《【教程】实时转码并上传-通用版》的onProcess+mock实现有本质上的区别，onProcess+mock是实时将pcm片段转成一个mp3文件（会有首尾静默，导致拼接的完整mp3存在停顿杂音），takeoffEncodeChunk是直接得到pcm片段编码生成的mp3数据，因此不会引入停顿杂音影响到mp3的音质。

但takeoffEncodeChunk选项的使用条件比较苛刻，只有环境支持实时特性时才能正常进行录音，否则rec.open会走fail回调。
******************/
import Recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine';

const testOutputWavLog = false; // 顺带打一份wav的log，录音后执行mp3、wav合并的demo代码可对比音质
const testSampleRate = 16000;
const testBitRate = 16;

const SendInterval = 300; // mp3 chunk数据会缓冲，当pcm的累积时长达到这个时长，就会传输发送。这个值在takeoffEncodeChunk实现下，使用0也不会有性能上的影响。

// 重置环境
const RealTimeSendTryReset = function () {
  realTimeSendTryTime = 0;
};

let realTimeSendTryTime = 0;
let realTimeSendTryNumber;
let transferUploadNumberMax;
let realTimeSendTryBytesChunks;
let realTimeSendTryClearPrevBufferIdx;
let realTimeSendTryWavTestBuffers;
let realTimeSendTryWavTestSampleRate;

// =====实时处理核心函数==========
const RealTimeSendTry = function (chunkBytes, isClose, sendFunc) {
  if (chunkBytes) {
    // 推入缓冲再说
    realTimeSendTryBytesChunks.push(chunkBytes);
  }

  const t1 = Date.now();
  if ((!isClose && t1 - realTimeSendTryTime < SendInterval) || !realTimeSendTryBytesChunks) {
    return; // 控制缓冲达到指定间隔才进行传输
  }
  realTimeSendTryTime = t1;
  const number = ++realTimeSendTryNumber;

  // mp3缓冲的chunk拼接成一个更长点的mp3
  let len = 0;
  for (let i = 0; i < realTimeSendTryBytesChunks.length; i++) {
    len += realTimeSendTryBytesChunks[i].length;
  }
  const chunkData = new Uint8Array(len);
  for (let i = 0, idx = 0; i < realTimeSendTryBytesChunks.length; i++) {
    const chunk = realTimeSendTryBytesChunks[i];
    chunkData.set(chunk, idx);
    idx += chunk.length;
  }
  realTimeSendTryBytesChunks = [];

  // 推入传输
  let blob: Blob | null = null;
  let meta: any = {};
  if (chunkData.length > 0) {
    // mp3不是空的
    blob = new Blob([chunkData], { type: 'audio/mp3' });
    meta = Recorder.mp3ReadMeta([chunkData.buffer], chunkData.length) || {}; // 读取出这个mp3片段信息
  }
  TransferUpload(
    number,
    blob,
    meta.duration || 0,
    {
      set: {
        type: 'mp3',
        sampleRate: meta.sampleRate,
        bitRate: meta.bitRate,
      },
    },
    isClose,
    sendFunc
  );

  if (testOutputWavLog) {
    // 测试输出一份wav，方便对比数据
    const recMock2 = Recorder({
      type: 'wav',
      sampleRate: testSampleRate,
      bitRate: testBitRate,
    });
    const chunk = Recorder.SampleData(realTimeSendTryWavTestBuffers, realTimeSendTryWavTestSampleRate, realTimeSendTryWavTestSampleRate);
    recMock2.mock(chunk.data, realTimeSendTryWavTestSampleRate);
    recMock2.stop(function (blob, duration) {
      const logMsg = 'No.' + (number < 100 ? ('000' + number).substr(-3) : number);
      // console.log(blob, duration, recMock2, logMsg);
    });
  }
  realTimeSendTryWavTestBuffers = [];
};

// =====实时处理时清理一下内存（延迟清理），本方法先于RealTimeSendTry执行======
const RealTimeOnProcessClear = function (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
  if (realTimeSendTryTime == 0) {
    realTimeSendTryTime = Date.now();
    realTimeSendTryNumber = 0;
    transferUploadNumberMax = 0;
    realTimeSendTryBytesChunks = [];
    realTimeSendTryClearPrevBufferIdx = 0;
    realTimeSendTryWavTestBuffers = [];
    realTimeSendTryWavTestSampleRate = 0;
  }

  // 清理PCM缓冲数据，最后完成录音时不能调用stop，因为数据已经被清掉了
  // 这里进行了延迟操作（必须要的操作），只清理上次到现在的buffer
  for (let i = realTimeSendTryClearPrevBufferIdx; i < newBufferIdx; i++) {
    buffers[i] = null;
  }
  realTimeSendTryClearPrevBufferIdx = newBufferIdx;

  // 备份一下方便后面生成测试wav
  for (let i = newBufferIdx; i < buffers.length; i++) {
    realTimeSendTryWavTestBuffers.push(buffers[i]);
  }
  realTimeSendTryWavTestSampleRate = bufferSampleRate;
};

// =====数据传输函数==========
const TransferUpload = function (number, blobOrNull, duration, blobRec, isClose, sendFunc) {
  transferUploadNumberMax = Math.max(transferUploadNumberMax, number);
  if (blobOrNull) {
    const blob = blobOrNull;

    // *********Read As Base64***************
    // const reader = new FileReader();
    // reader.onloadend = function () {
    //   const base64 = (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result as string) || [])[1];
    //   // 可以实现
    //   // WebSocket send(base64) ...
    //   // WebRTC send(base64) ...
    //   // XMLHttpRequest send(base64) ...
    //   // 这里啥也不干
    // };
    // reader.readAsDataURL(blob);

    // *********Blob***************
    // 可以实现
    // WebSocket send(blob) ...
    // WebRTC send(blob) ...
    // XMLHttpRequest send(blob) ...
    if (sendFunc) {
      sendFunc(blob);
    }
    // 这里仅 console send 意思意思
    const numberFail =
      number < transferUploadNumberMax ? '<span style="color:red">顺序错乱的数据，如果要求不高可以直接丢弃，或者调大SendInterval试试</span>' : '';
    const logMsg = 'No.' + (number < 100 ? ('000' + number).substr(-3) : number) + numberFail;
    // console.log(blob, duration, blobRec, logMsg);
    if (true && number % 100 == 0) {
      // emmm....
      // Runtime.LogClear();
    }
  } else {
    if (sendFunc) {
      sendFunc();
    }
  }

  if (isClose) {
    console.log('No.' + (number < 100 ? ('000' + number).substr(-3) : number) + ':已停止传输');
  }
};

export { RealTimeSendTry, RealTimeOnProcessClear, TransferUpload, RealTimeSendTryReset };
