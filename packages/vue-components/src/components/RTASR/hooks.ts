import { recordConfig } from './config';
import Recorder from '@yakies/recorder';
// 可选的扩展
import '@yakies/recorder/src/extensions/lib.fft';
import '@yakies/recorder/src/extensions/frequency.histogram.view';
import { RealTimeSendTry, RealTimeSendTryReset } from './RealTimeSender';
import { mergeAudioBlobs } from './utils';
import PCMTransformWorker from './transformpcm.worker?raw';
import { useWebSocket } from '@vueuse/core';

const recorderWorker = new Worker(URL.createObjectURL(new Blob([PCMTransformWorker], { type: 'application/javascript' })));

const buffer: any[] = []
recorderWorker.onmessage = function (e) {
  buffer.push(...e.data.buffer)
}
// 屏蔽网站统计
Recorder.TrafficImgUrl = '';

// 输出原始的音频数据
Recorder.PerserveOriginalBuffer = true;

Recorder.CLog = () => { };

let status,send,close,open
async function connectWebsocket({ onOpen, onMessage, onClose, getUrlParams }: { onOpen: () => void, onMessage: (data) => void, onClose: () => void, getUrlParams: () => Promise<any> }) {
  if (open) { 
    open();
    return;
  }
  let url = 'wss://rtasr.xfyun.cn/v1/ws';
  const urlParam = await getUrlParams();
  url = `${url}${urlParam}`;
  const socketInst = useWebSocket(url)
  status = socketInst.status;
  send = socketInst.send;
  close = socketInst.close;
  open = socketInst.open;
  watch(socketInst.data, (data) => {
    const jsonData = JSON.parse(data);
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
  })
}

export function useRecorder({ waveView, callMode, userVoiceParsed, getUrlParams, waveColor }) {
  let t;
  const recording = ref(false);
  const rec = ref();
  let wave,
    // 保留录音数据
    takeoffChunks: any[] = [];
  const toSend: any = [],
    sent: any = [],
    logs: any = [];
  const pending = false;
  function handleEmit(message, powerLevel?) {
    // 表示发送普通json消息
    if (Object.prototype.toString.call(message) === '[object Object]') {
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
      onProcess(buffers, powerLevel, bufferDuration, bufferSampleRate, _newBufferIdx, _asyncEnd, originBuffer) {
        // RealTimeOnProcessClear(buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd); // 实时数据处理，清理内存
        powerLevel = powerLevel;
        wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate);
        if (!callMode) {
          RealTimeSendTry(buffers, bufferSampleRate, false, (blob) => {
            takeoffChunks.push(blob);
          }); // 推入实时处理，因为是unknown格式，这里简化函数调用，没有用到buffers和bufferSampleRate，因为这些数据和rec.buffers是完全相同的。
        }
        handleEmit(originBuffer)
      },
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
        send('{"end": true}');
        console.log('已录制:', '', {
          blob: blob,
          duration: duration,
          rec: rec,
        });
      },
      function (s) {
        recording.value = false;
        console.log('结束出错：' + s, 1);
        send('{"end": true}');
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
  }

  function _getTime() {
    const now = new Date();
    const t = ('0' + now.getHours()).substr(-2) + ':' + ('0' + now.getMinutes()).substr(-2) + ':' + ('0' + now.getSeconds()).substr(-2);
    return t;
  }

  async function connect() {
    if (open) {
      return;
    }
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
                  userVoiceParsed(str, base64[0]);
                  close();
                };
                reader.readAsDataURL(blob);
                takeoffChunks = [];
              } else if (i.cn.st.type === '1') {
                userVoiceParsed(str);
              }
            });
          },
          getUrlParams
        }
      );
    })
  }

  function uploadStream() {
    t = setInterval(() => {
      const audioData = buffer.splice(0, 1280)
      if (audioData.length > 0 && unref(status) === 1) {
        send(new Int8Array(audioData))
      }
    }, 40)
  }

  onMounted(() => {
    nextTick(recOpen);
  });
  return { recording, recStart, recStop, rec, reclog, connect, uploadStream };
}
