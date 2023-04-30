import MP4Box from 'mp4box';
import { eventBus } from '@/utils';
import { Downloader } from '@/utils/blockDownloader';

class MP4Source {
  url: string;
  file: any;
  info: any;
  _info_resolver: any;
  _onChunk: Function;
  _onEnd: Function;
  track: any;
  seeking: boolean = false;
  keySampleNumber = 0;

  constructor(url, onChunk, onEnd, onReady) {
    this.url = url;
    this.file = MP4Box.createFile();
    this.file.onError = console.error.bind(console);
    this.file.onReady = this.onReady.bind(this);
    this.file.onSamples = this.onSamples.bind(this);
    this._onChunk = onChunk && onChunk.bind(this);
    this._onEnd = onEnd && onEnd.bind(this);

    // 先下载视频，目前是在electron内部使用，是本地下载，会很快。现在需要下载完整个视频才能播放，如果是网络视频的话，这个逻辑就不太好了，以后看看怎么实现边下边播。
    const downloader = new Downloader(this.url);
    downloader.setCallback((buff, eof) => {
      this.file.appendBuffer(buff);
      if (eof) {
        this.file.flush()
        onReady && onReady()
      }
    })
    downloader.getFile()
  }

  getExtradata(avccBox) {
    let i;
    let size = 7;
    for (i = 0; i < avccBox.SPS.length; i++) {
      // nalu length is encoded as a uint16.
      size += 2 + avccBox.SPS[i].length;
    }
    for (i = 0; i < avccBox.PPS.length; i++) {
      // nalu length is encoded as a uint16.
      size += 2 + avccBox.PPS[i].length;
    }

    const writer = new Writer(size);

    writer.writeUint8(avccBox.configurationVersion);
    writer.writeUint8(avccBox.AVCProfileIndication);
    writer.writeUint8(avccBox.profile_compatibility);
    writer.writeUint8(avccBox.AVCLevelIndication);
    writer.writeUint8(avccBox.lengthSizeMinusOne + (63 << 2));

    writer.writeUint8(avccBox.nb_SPS_nalus + (7 << 5));
    for (i = 0; i < avccBox.SPS.length; i++) {
      writer.writeUint16(avccBox.SPS[i].length);
      writer.writeUint8Array(avccBox.SPS[i].nalu);
    }

    writer.writeUint8(avccBox.nb_PPS_nalus);
    for (i = 0; i < avccBox.PPS.length; i++) {
      writer.writeUint16(avccBox.PPS[i].length);
      writer.writeUint8Array(avccBox.PPS[i].nalu);
    }

    return writer.getData();
  }

  async getConfig() {
    const info: any = await this.getInfo.call(this);
    this.track = info.videoTracks[0];
    this.file.setExtractionOptions(this.track.id);
    const extradata = this.getExtradata(this.getAvccBox());
    const config = {
      codec: this.track.codec,
      codedHeight: this.track.track_height,
      codedWidth: this.track.track_width,
      duration: this.track.samples_duration / this.track.timescale,
      // track里面获取的视频时长似乎不准，改用ffprobe来获取也不对
      // duration:
      //   +(await new Promise<any>((resolve, reject) => {
      //     ffmpeg.ffprobe(this.source.filepath, (err, data) => {
      //       if (err) {
      //         reject(err.stack);
      //         return;
      //       }
      //       resolve(data.streams[0].duration);
      //     });
      //   })) * 1e6,
      timescale: this.track.timescale,
      description: extradata,
      samples: this.track.nb_samples,
    };
    return config;
  }

  onReady(info) {
    // TODO: Generate configuration changes.
    this.info = info;

    if (this._info_resolver) {
      this._info_resolver(info);
      this._info_resolver = null;
    }
  }

  getInfo() {
    if (this.info) return Promise.resolve(this.info);

    return new Promise((resolver) => {
      this._info_resolver = resolver;
    });
  }

  getAvccBox() {
    // TODO: make sure this is coming from the right track.
    return this.file.moov.traks[0].mdia.minf.stbl.stsd.entries[0].avcC;
  }

  start() {
    this.file.start();
  }

  seek(time, seeking) {
    this.seeking = seeking;
    this.keySampleNumber = 0;
    return this.file.seek(time, true);
  }

  onSamples(track_id, ref, samples) {
    // seeking模式下需要发送第一个关键帧到下一个关键帧之间的chunk,如果只发送一个chunk，webcodecs无法解析出图像
    if (this.seeking && this.keySampleNumber > 1) {
      return;
    }
    for (const sample of samples) {
      if (this.seeking && this.keySampleNumber > 1) {
        return;
      }
      const type = sample.is_sync ? 'key' : 'delta';
      if (this.seeking && type === 'key') {
        // seeking模式下，找到关键帧了
        this.keySampleNumber++;
      }
      this._onChunk({
        type: type,
        timestamp: sample.cts,
        duration: sample.duration,
        frames: sample.number,
        data: sample.data,
      });
      if (sample.number + 1 === this.track.nb_samples) {
        this._onEnd && this._onEnd();
      }
    }
  }
}

class Writer {
  data: Uint8Array;
  idx: number;
  size: number;

  constructor(size) {
    this.data = new Uint8Array(size);
    this.idx = 0;
    this.size = size;
  }

  getData() {
    if (this.idx != this.size) throw 'Mismatch between size reserved and sized used';

    return this.data.slice(0, this.idx);
  }

  writeUint8(value) {
    this.data.set([value], this.idx);
    this.idx++;
  }

  writeUint16(value) {
    // TODO: find a more elegant solution to endianess.
    const arr = new Uint16Array(1);
    arr[0] = value;
    const buffer = new Uint8Array(arr.buffer);
    this.data.set([buffer[1], buffer[0]], this.idx);
    this.idx += 2;
  }

  writeUint8Array(value) {
    this.data.set(value, this.idx);
    this.idx += value.length;
  }
}

export class MP4Demuxer {
  source: MP4Source;

  constructor(uri, onReady?, onChunk?, onEnd?) {
    this.source = new MP4Source(uri, onChunk, onEnd, onReady);
  }

  async getConfig() {
    return this.source.getConfig();
  }

  start() {
    this.source.start();
  }

  seek(time, seek) {
    return this.source.seek(time, seek);
  }

  stop() {
    this.source.file.stop();
  }

  flush() {
    this.source.file.flush();
  }
}


// 视频播放解码应用层实现
let demuxer: MP4Demuxer,
  canPlay = false,
  chunks: any[] = [],
  firstFrame = 0,
  displayFrameOffset = 0,
  gotFirstFrame = false,
  gotFirstDisplayFrame = false,
  startTime = 0,
  videoConfig;

function sendChunks(chunk) {
  eventBus.emit('playback-frame', chunk);
  const nextChunk = chunks.shift();
  if (nextChunk) {
    sendChunks(nextChunk);
  }
}


export async function setPlaybackInfo({ url }) {
  demuxer && demuxer.flush();
  demuxer = new MP4Demuxer(
    url,
    async () => {
      videoConfig = await demuxer.getConfig();
      eventBus.emit('playback-ready', videoConfig);
    },
    (chunk) => {
      if (!gotFirstFrame) {
        gotFirstFrame = true;
        firstFrame = chunk.frames;
      }
      if (!gotFirstDisplayFrame) {
        if (chunk.timestamp >= startTime) {
          eventBus.emit('playback-start', { data: [firstFrame, displayFrameOffset] });
          gotFirstDisplayFrame = true;
        }
        displayFrameOffset++;
        chunks.push(chunk);
      } else if (chunks.length > 0) {
        sendChunks(chunks.shift());
        eventBus.emit('playback-frame', chunk);
      } else {
        eventBus.emit('playback-frame', chunk);
      }
    },
    () => {
      // sendChunks(client, chunks.shift());
    }
  );

}

export function playbackAckReady() {
  canPlay = true;
};

export function playbackStart(data: { startTime?: number, seek: boolean }) {
  if (!canPlay) {
    return;
  }
  demuxer.stop();
  startTime = data.startTime ?? 0;
  demuxer.seek(startTime, data.seek);
  startTime *= videoConfig.timescale;
  firstFrame = 0;
  displayFrameOffset = 0;
  gotFirstFrame = false;
  gotFirstDisplayFrame = false;
  demuxer.start();
}
