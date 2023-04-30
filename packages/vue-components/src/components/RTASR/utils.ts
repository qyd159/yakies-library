import Recorder from 'recorder-core';

// =====wav文件合并核心函数==========
Recorder.WavMerge = function (fileBytesList, True, False) {
  const wavHead = new Uint8Array(fileBytesList[0].buffer.slice(0, 44));

  // 计算所有文件的长度、校验wav头
  let size = 0;
  let baseInfo;
  let info;
  for (let i = 0; i < fileBytesList.length; i++) {
    const file = fileBytesList[i];
    info = readWavInfo(file);
    if (!info) {
      False && False('第' + (i + 1) + '个文件不是单声道wav raw pcm格式音频，无法合并');
      return;
    }
    baseInfo || (baseInfo = info);
    if (baseInfo.sampleRate != info.sampleRate || baseInfo.bitRate != info.bitRate) {
      False && False('第' + (i + 1) + '个文件位数或采样率不一致');
      return;
    }

    size += file.byteLength - 44;
  }
  if (size > 50 * 1024 * 1024) {
    False && False('文件大小超过限制');
    return;
  }

  // 去掉wav头后全部拼接到一起
  const fileBytes = new Uint8Array(44 + size);
  let pos = 44;
  for (let i = 0; i < fileBytesList.length; i++) {
    const pcm = new Uint8Array(fileBytesList[i].buffer.slice(44));
    fileBytes.set(pcm, pos);
    pos += pcm.byteLength;
  }

  // 添加新的wav头，直接修改第一个的头就ok了
  write32(wavHead, 4, 36 + size);
  write32(wavHead, 40, size);
  fileBytes.set(wavHead, 0);

  // 计算合并后的总时长
  // @ts-ignore
  const duration = Math.round(((size / info.sampleRate) * 1000) / (info.bitRate == 16 ? 2 : 1));

  True(fileBytes, duration, baseInfo);
};
const write32 = function (bytes, pos, int32) {
  bytes[pos] = int32 & 0xff;
  bytes[pos + 1] = (int32 >> 8) & 0xff;
  bytes[pos + 2] = (int32 >> 16) & 0xff;
  bytes[pos + 3] = (int32 >> 24) & 0xff;
};
const readWavInfo = function (bytes) {
  // 检测wav文件头
  if (bytes.byteLength < 44) {
    return null;
  }
  const wavView = bytes;
  const eq = function (p, s) {
    for (let i = 0; i < s.length; i++) {
      if (wavView[p + i] != s.charCodeAt(i)) {
        return false;
      }
    }
    return true;
  };
  if (eq(0, 'RIFF') && eq(8, 'WAVEfmt ')) {
    if (wavView[20] == 1 && wavView[22] == 1) {
      // raw pcm 单声道
      const sampleRate = wavView[24] + (wavView[25] << 8) + (wavView[26] << 16) + (wavView[27] << 24);
      const bitRate = wavView[34] + (wavView[35] << 8);
      return {
        sampleRate: sampleRate,
        bitRate: bitRate,
      };
    }
  }
  return null;
};

// =====wav转其他格式核心函数==========
Recorder.Wav2PCM = function (wavBlob, True, False) {
  const reader = new FileReader();
  reader.onloadend = function () {
    // 检测wav文件头
    const wavView = new Uint8Array(reader.result as ArrayBuffer);
    const eq = function (p, s) {
      for (let i = 0; i < s.length; i++) {
        if (wavView[p + i] != s.charCodeAt(i)) {
          return false;
        }
      }
      return true;
    };
    let pcm;
    let sampleRate;
    if (eq(0, 'RIFF') && eq(8, 'WAVEfmt ')) {
      if (wavView[20] == 1 && wavView[22] == 1) {
        // raw pcm 单声道
        sampleRate = wavView[24] + (wavView[25] << 8) + (wavView[26] << 16) + (wavView[27] << 24);
        const bitRate = wavView[34] + (wavView[35] << 8);
        console.log('wav info', sampleRate, bitRate);
        if (bitRate == 16) {
          pcm = new Int16Array(wavView.buffer.slice(44));
        } else if (bitRate == 8) {
          pcm = new Int16Array(wavView.length - 44);
          // 8位转成16位
          for (let j = 44, d = 0; j < wavView.length; j++, d++) {
            const b = wavView[j];
            pcm[d] = (b - 128) << 8;
          }
        }
      }
    }
    if (!pcm) {
      False && False('非单声道wav raw pcm格式音频，无法转码');
      return;
    }

    True(pcm);
    // // 转其它格式
    // const rec = Recorder(newSet).mock(pcm, sampleRate);
    // rec.stop(function (blob, duration) {
    //   True(blob, duration, rec);
    // }, False);
  };
  reader.readAsArrayBuffer(wavBlob);
};
// =====END=========================

export async function mergeAudioBlobs(blobs) {
  const files: Uint8Array[] = [];
  const eArr = blobs[Symbol.iterator]();
  for (const blob of eArr) {
    await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        files.push(new Uint8Array(reader.result as ArrayBuffer));
        resolve(null);
      };
      reader.readAsArrayBuffer(blob);
    });
  }
  return await new Promise((resolve) => {
    Recorder.WavMerge(
      files,
      function (file, duration, info) {
        info.type = 'wav';
        resolve({ blob: new Blob([file.buffer], { type: 'audio/wav' }), duration });
      },
      function (msg) {
        console.log(msg + '，请清除日志后重试', 1);
      }
    );
  });
}

// =====END=========================
