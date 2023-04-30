import Player from './player';
import { setPlaybackInfo, playbackAckReady, playbackStart } from '@/utils/MP4Demuxer';
import { eventBus } from '@/utils'
class VideoWorker {
  player: Player;
  decoder!: VideoDecoder;
  offscreen!: HTMLCanvasElement;
  config: any;
  firstFrameIndex = 0;
  displayFrameOffset = 0;
  receivedFrames = 0;
  decodedFrames = 0;
  isSeeking = false;
  initialized = false;
  constructor() {
    const player = (this.player = new Player());

    eventBus.on('playback-ready', (config: any) => {
      // 准备播放
      this.offscreen.height = config.codedHeight;
      this.offscreen.width = config.codedWidth;
      self.postMessage({ type: 'info', data: config });
      player.init(this.endCallback);
      player.setDuration(config.duration);
      player.setTimescale(config.timescale / 1000);
      player.totalFrames = config.samples
      // player.setTimestamps(range(0, config.duration * 1e6, config.duration * 1e6 / config.samples))
      this.config = config;
      this.createDecoder();
      playbackAckReady();
      playbackStart({ seek: true })
    });

    eventBus.on('playback-end', () => {
      // do something
    });

    eventBus.on<any>('playback-start', ({ data: [firstFrame, displayFrameOffset] }) => {
      this.player.reset();
      this.player.setFrameIndex(firstFrame, displayFrameOffset);
      this.firstFrameIndex = firstFrame - 1;
      this.displayFrameOffset = displayFrameOffset;
      this.receivedFrames = 0;
    });

    eventBus.on('playback-frame', (data: any) => {
      if (!this.isSeeking) {
        this.decoder.decode(new EncodedVideoChunk(data));
      } else if (this.displayFrameOffset >= this.receivedFrames) {
        // 获取一帧一帧的数据并渲染
        this.decoder.decode(new EncodedVideoChunk(data));
      } else if (this.displayFrameOffset + 1 === this.receivedFrames) {
        this.decoder.decode(new EncodedVideoChunk(data));
      }
      this.receivedFrames++;
    });

    self.addEventListener('message', ({ data }) => {
      switch (data.type) {
        case 'init':
          this.offscreen = data.canvas;
          setPlaybackInfo({ url: data.info.url })
          break;
        case 'start':
          // 真正开始播放了
          this.isSeeking = false;
          this.createDecoder();
          playbackStart(Object.assign(data, { seek: false }))
          self.postMessage({
            type: 'start',
          });
          break;
        case 'seek':
          this.isSeeking = true;
          this.createDecoder();
          playbackStart(Object.assign(data, { seek: true }))
          break;
        case 'pause':
          if (this.decoder && this.decoder.state !== 'closed') {
            this.decoder.close();
          }
          this.player.close();
          self.postMessage({ type: 'pause' });
          break;
        case 'timestamps':
          player.setTimestamps(data.info);
          break;
      }
    });
  }
  endCallback(videoDuration) {
    self.postMessage({ type: 'end', videoDuration });
  }
  createDecoder() {
    this.decodedFrames = 0;
    let ctx = this.offscreen.getContext('2d');
    if (this.decoder && this.decoder.state !== 'closed') {
      this.decoder.close();
    }
    this.player.close();
    this.decoder = new VideoDecoder({
      output: (frame) => {
        if (++this.decodedFrames < this.displayFrameOffset) {
          frame.close();
        } else {
          this.player.handleFrame(
            {
              frame,
              timestamp: frame.timestamp! * 1e3 / this.player.timescale
              // this.player.timestamps[this.firstFrameIndex + this.decodedFrames],
            },
            ctx
          );
          if (this.isSeeking) {
            this.player.render_frame(ctx);
          }
          if (!this.initialized) {
            this.decoder.close();
            this.initialized = true;
          }
        }
      },
      error: (e) => console.error(e),
    });
    this.decoder.configure(this.config);
  }
}

new VideoWorker()
