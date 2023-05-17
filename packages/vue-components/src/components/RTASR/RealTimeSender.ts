import Recorder from 'recorder-core';
import 'recorder-core/src/engine/wav';
import './utils';

var testSampleRate = 16000;
var testBitRate = 16;

var SendFrameSize = 3200;/**** 每次发送指定二进制数据长度的数据帧，单位字节，16位pcm取值必须为2的整数倍，8位随意。
16位16khz的pcm 1秒有：16000hz*16位/8比特=32000字节的数据，默认配置3200字节每秒发送大约10次
******/

//重置环境，每次开始录音时必须先调用此方法，清理环境
export var RealTimeSendTryReset = function () {
  realTimeSendTryChunks = null;
};

var realTimeSendTryNumber;
var transferUploadNumberMax;
var realTimeSendTryChunk;
var realTimeSendTryChunks;

//=====实时处理核心函数==========
export var RealTimeSendTry = function (buffers, bufferSampleRate, isClose, frameCallback) {
  if (realTimeSendTryChunks == null) {
    realTimeSendTryNumber = 0;
    transferUploadNumberMax = 0;
    realTimeSendTryChunk = null;
    realTimeSendTryChunks = [];
  };
  //配置有效性检查
  if (testBitRate == 16 && SendFrameSize % 2 == 1) {
    console.log("16位pcm SendFrameSize 必须为2的整数倍", 1);
    return;
  };

  var pcm = [], pcmSampleRate = 0;
  if (buffers.length > 0) {
    //借用SampleData函数进行数据的连续处理，采样率转换是顺带的，得到新的pcm数据
    var chunk = Recorder.SampleData(buffers, bufferSampleRate, testSampleRate, realTimeSendTryChunk);

    //清理已处理完的缓冲数据，释放内存以支持长时间录音，最后完成录音时不能调用stop，因为数据已经被清掉了
    for (var i = realTimeSendTryChunk ? realTimeSendTryChunk.index : 0; i < chunk.index; i++) {
      buffers[i] = null;
    };
    realTimeSendTryChunk = chunk;//此时的chunk.data就是原始的音频16位pcm数据（小端LE），直接保存即为16位pcm文件、加个wav头即为wav文件、丢给mp3编码器转一下码即为mp3文件

    pcm = chunk.data;
    pcmSampleRate = chunk.sampleRate;

    if (pcmSampleRate != testSampleRate)//除非是onProcess给的bufferSampleRate低于testSampleRate
      throw new Error("不应该出现pcm采样率" + pcmSampleRate + "和需要的采样率" + testSampleRate + "不一致");
  };

  //将pcm数据丢进缓冲，凑够一帧发送，缓冲内的数据可能有多帧，循环切分发送
  if (pcm.length > 0) {
    realTimeSendTryChunks.push({ pcm: pcm, pcmSampleRate: pcmSampleRate });
  };

  //从缓冲中切出一帧数据
  var chunkSize = SendFrameSize / (testBitRate / 8);//8位时需要的采样数和帧大小一致，16位时采样数为帧大小的一半
  var pcmData = new Int16Array(chunkSize), pcmSampleRate = 0;
  var pcmOK = false, pcmLen = 0;
  for1: for (var i1 = 0; i1 < realTimeSendTryChunks.length; i1++) {
    var chunk = realTimeSendTryChunks[i1];
    pcmSampleRate = chunk.pcmSampleRate;

    for (var i2 = chunk.offset || 0; i2 < chunk.pcm.length; i2++) {
      pcmData[pcmLen] = chunk.pcm[i2];
      pcmLen++;

      //满一帧了，清除已消费掉的缓冲
      if (pcmLen == chunkSize) {
        pcmOK = true;
        chunk.offset = i2 + 1;
        for (var i3 = 0; i3 < i1; i3++) {
          realTimeSendTryChunks.splice(0, 1);
        };
        break for1;
      }
    }
  };

  //缓冲的数据不够一帧时，不发送 或者 是结束了
  if (!pcmOK) {
    if (isClose) {
      var number = ++realTimeSendTryNumber;
      TransferUpload(number, null, 0, null, isClose, frameCallback);
    };
    return;
  };

  //16位pcm格式可以不经过mock转码，直接发送new Blob([pcm.buffer],{type:"audio/pcm"}) 但8位的就必须转码，通用起见，均转码处理，pcm转码速度极快
  var number = ++realTimeSendTryNumber;
  var encStartTime = Date.now();
  var recMock = Recorder({
    type: "pcm"
    , sampleRate: testSampleRate //需要转换成的采样率
    , bitRate: testBitRate //需要转换成的比特率
  });
  recMock.mock(pcm, pcmSampleRate);
  recMock.stop(function (blob, duration) {
    blob.encTime = Date.now() - encStartTime;

    //转码好就推入传输
    TransferUpload(number, blob, duration, recMock, false, frameCallback);

    //循环调用，继续切分缓冲中的数据帧，直到不够一帧
    RealTimeSendTry([], 0, isClose, frameCallback);
  }, function (msg) {
    //转码错误？没想到什么时候会产生错误！
    console.log("不应该出现的错误:" + msg, 1);
  });
};



//=====数据传输函数==========
var TransferUpload = function (number, blobOrNull, duration, blobRec, isClose, frameCallback) {
  transferUploadNumberMax = Math.max(transferUploadNumberMax, number);
  if (blobOrNull) {
    var blob = blobOrNull;
    var encTime = blob.encTime;

    //*********发送方式一：Base64文本发送***************
    var reader = new FileReader();
    reader.onloadend = function () {
      frameCallback(new Float32Array(reader.result as ArrayBuffer), blob)
      //可以实现
      //WebSocket send(base64) ...
      //WebRTC send(base64) ...
      //XMLHttpRequest send(base64) ...

      //这里啥也不干
    };
    reader.readAsDataURL(blob);

    //*********发送方式二：Blob二进制发送***************
    //可以实现
    //WebSocket send(blob) ...
    //WebRTC send(blob) ...
    //XMLHttpRequest send(blob) ...


    //****这里仅 console.log一下 意思意思****
    var numberFail = number < transferUploadNumberMax ? '<span style="color:red">顺序错乱的数据，如果要求不高可以直接丢弃</span>' : "";
    var logMsg = "No." + (number < 100 ? ("000" + number).substr(-3) : number) + numberFail;

    console.log(blob, duration, blobRec, logMsg + "花" + ("___" + encTime).substr(-3) + "ms");

    if (true && number % 100 == 0) {//emmm....
      console.clear();
    };
  };

  if (isClose) {
    console.log("No." + (number < 100 ? ("000" + number).substr(-3) : number) + ":已停止传输");
  };
};








//=====pcm文件合并核心函数==========
Recorder.PCMMerge = function (fileBytesList, bitRate, sampleRate, True, False) {
  //计算所有文件总长度
  var size = 0;
  for (var i = 0; i < fileBytesList.length; i++) {
    size += fileBytesList[i].byteLength;
  };

  //全部直接拼接到一起
  var fileBytes = new Uint8Array(size);
  var pos = 0;
  for (var i = 0; i < fileBytesList.length; i++) {
    var bytes = fileBytesList[i];
    fileBytes.set(bytes, pos);
    pos += bytes.byteLength;
  };

  //计算合并后的总时长
  var duration = Math.round(size * 8 / bitRate / sampleRate * 1000);

  True(fileBytes, duration, { bitRate: bitRate, sampleRate: sampleRate });
};