import { recordConfig } from './config';
import Recorder from 'recorder-core';
// 可选的扩展
import 'recorder-core/src/extensions/lib.fft';
import 'recorder-core/src/extensions/frequency.histogram.view';
import { RealTimeSendTry, RealTimeSendTryReset } from './RealTimeSender';
import { mergeAudioBlobs } from './utils';
import PCMTransformWorker from './transformpcm.worker?raw';

const recorderWorker = new Worker(URL.createObjectURL(new Blob([PCMTransformWorker], { type: 'application/javascript' })));

const buffer: any[] = []
recorderWorker.onmessage = function (e) {
  buffer.push(...e.data.buffer)
}
// 屏蔽网站统计
Recorder.TrafficImgUrl = '';

async function connectWebsocket({ onOpen, onMessage, onClose, getUrlParams }: { onOpen: () => void, onMessage: (data) => void, onClose: () => void, getUrlParams: () => Promise<any> }) {
  let url = 'wss://rtasr.xfyun.cn/v1/ws';
  const urlParam = await getUrlParams();
  url = `${url}${urlParam}`;
  const ws = new WebSocket(url);
  ws.onopen = (_e) => {
    console.log('连接已建立');
  };
  ws.onmessage = (e) => {
    const jsonData = JSON.parse(e.data);
    if (jsonData.action == 'started') {
      // 握手成功
      console.log('握手成功');
      onOpen();
    } else if (jsonData.action == 'result') {
      // 转写结果
      onMessage(jsonData.data);
    } else if (jsonData.action == 'error') {
      // 连接发生错误
      console.log('出错了:', jsonData);
    }
  };
  ws.onerror = (_e) => {
    onClose()
    console.log('关闭连接ws.onerror');
  };
  ws.onclose = (_e) => {
    onClose()
    console.log('关闭连接ws.onclose');
  };
  return ws;
}

export function useRecorder({ waveView, callMode, userVoiceParsed, getUrlParams, waveColor }) {
  let t;
  const recording = ref(false);
  const rec = ref();
  let wave,
    // 保留录音数据
    takeoffChunks: any[] = [];
  // 建立socket连接
  const socket = ref();
  const toSend: any = [],
    sent: any = [],
    logs: any = [];
  const pending = false;
  function handleEmit(message, powerLevel) {
    // 表示发送普通json消息
    if (Object.prototype.toString.call(message) === '[object Object]') {
      message = JSON.stringify(message);
      unref(socket).emit(['command', message]);
      return;
    }

    // powerLevel大于零表示发送语音片段，message为Blob类型
    if (powerLevel > -1) {
      if (toSend.length > 2) {
        toSend.shift();
      }
      toSend.push({
        powerLevel,
        message,
      });
    }

    if (pending && powerLevel > -1) return;
    recorderWorker.postMessage({
      command: 'transform',
      buffer: message
    })
    if (powerLevel > -1) {
      if (sent.length > 2) {
        sent.shift();
      }
      sent.push({
        message,
        powerLevel,
      });
    }
  }

  function recOpen() {
    const { type, bitRate, sampleRate } = recordConfig;
    rec.value = Recorder({
      type,
      bitRate,
      sampleRate,
      onProcess(buffers, powerLevel, bufferDuration, bufferSampleRate, _newBufferIdx, _asyncEnd) {
        // RealTimeOnProcessClear(buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd); // 实时数据处理，清理内存
        powerLevel = powerLevel;
        wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
        RealTimeSendTry(buffers, bufferSampleRate, false, (buffer, blob) => {
          if (!callMode) {
            takeoffChunks.push(blob);
          }
          handleEmit(buffer, powerLevel);
        }); // 推入实时处理，因为是unknown格式，这里简化函数调用，没有用到buffers和bufferSampleRate，因为这些数据和rec.buffers是完全相同的。
      },
      // takeoffEncodeChunk: function(chunkBytes) {
      //   // 保留原始的录音数据可直接播放
      //   takeoffChunks.push(chunkBytes);
      //   // 接管实时转码，推入实时处理
      //   // RealTimeSendTry(chunkBytes, false, blob => {
      //   //   that.eventStub.emit(blob);
      //   // });
      // },
    });
    unref(rec).open(
      function () {
        if (waveView) {
          wave = Recorder.FrequencyHistogramView({ ...recordConfig.waveViewOptions, ...waveColor ? { linear: [0, waveColor, 0.5, waveColor, 1, waveColor] } : {} });
          unref(waveView).appendChild(wave.elem);
        }
        reclog('已打开:' + type + ' ' + sampleRate + 'hz ' + bitRate + 'kbps', 2);
      },
      function (msg, isUserNotAllow) {
        reclog((isUserNotAllow ? 'UserNotAllow，' : '') + '打开失败：' + msg, 1);
      }
    );
  }
  function recStart(callback?) {
    unref(rec).open(() => {
      RealTimeSendTryReset(); // 重置
      unref(rec).start();
      const set = unref(rec).set;
      reclog('录制中：' + set.type + ' ' + set.sampleRate + 'hz ' + set.bitRate + 'kbps');
      callback && callback();
    });
  }
  function recStop() {
    if (!unref(rec)) {
      reclog('未打开录音', 1);
      return;
    }
    unref(rec).stop(
      function (blob, duration) {
        recording.value = false;
        unref(socket).send('{"end": true}');
        console.log('已录制:', '', {
          blob: blob,
          duration: duration,
          rec: rec,
        });
      },
      function (s) {
        recording.value = false;
        console.log('结束出错：' + s, 1);
        unref(socket).send('{"end": true}');
      },
      true
    ); // 自动close
  }

  function reclog(msg, color?, res?) {
    logs.splice(0, 0, {
      idx: logs.length,
      msg: msg,
      color: color,
      res: res,

      playMsg: '',
      down: 0,
      down64Val: '',
    });
    // console.log(msg, res);
  }

  function _getTime() {
    const now = new Date();
    const t = ('0' + now.getHours()).substr(-2) + ':' + ('0' + now.getMinutes()).substr(-2) + ':' + ('0' + now.getSeconds()).substr(-2);
    return t;
  }

  async function connect() {
    await new Promise((resolve) => {
      connectWebsocket(
        {
          onOpen() {
            resolve(null);
            uploadStream()
          },
          onClose() {
            clearInterval(t)
          },
          onMessage(data) {
            data = JSON.parse(data);
            const rtasrResult: any = [];
            rtasrResult[data.seg_id] = data;
            rtasrResult.forEach(async (i) => {
              let str = '';
              // str += i.cn.st.type == 0 ? '【最终】识别结果：' : '【中间】识别结果：';
              i.cn.st.rt.forEach((j) => {
                j.ws.forEach((k) => {
                  k.cw.forEach((l) => {
                    str += l.w;
                  });
                });
              });
              if (i.cn.st.type === '0' && takeoffChunks.length > 0) {
                // @ts-ignore
                const { blob } = await mergeAudioBlobs(takeoffChunks);
                const reader = new FileReader();
                reader.onloadend = function () {
                  const base64 = /.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result as string) || [];
                  userVoiceParsed(base64[0], str);
                  unref(socket).close();
                };
                reader.readAsDataURL(blob);
                takeoffChunks = [];
              }
            });
          },
          getUrlParams
        }
      ).then((ws) => (socket.value = ws));
    })
  }

  function uploadStream() {
    t = setInterval(() => {
      const audioData = buffer.splice(0, 1280)
      console.log(buffer, audioData)
      if (audioData.length > 0) {
        unref(socket).send(new Int8Array(audioData))
      }
    }, 40)
  }

  onMounted(() => {
    nextTick(recOpen);
  });
  return { recording, recStart, recStop, socket, rec, reclog, connect, uploadStream };
}
