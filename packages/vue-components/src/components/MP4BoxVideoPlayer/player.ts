import { CancelablePromise } from 'cancelable-promise';

interface FrameItem {
  frame: VideoFrame;
  timestamp: number;
}
export default class Player {
  duration: number;
  marker: string = 'playback';
  timestamps: number[];
  timescale: 1;
  endCallback: Function;
  ready_frames: FrameItem[] = [];
  render_frames: FrameItem[] = [];
  totalFrames = 100;
  delays = [];
  underflow = true;
  time_base = 0;
  frame_index = 0;
  prevFrame = null;
  init(endCallback) {
    this.reset();
    this.endCallback = endCallback;
  }
  reset() {
    this.time_base = 0;
    this.frame_index = 0;
    this.delays = [];
    this.render_frames = [];
    this.ready_frames = [];
    this.underflow = true;
    performance.clearMarks();
    performance.clearMeasures();
  }
  setFrameIndex(index: number, offset: number) {
    this.frame_index = index + offset;
  }
  setTimescale(timescale) {
    this.timescale = timescale;
  }
  setDuration(duration: number) {
    this.duration = duration;
  }
  setTimestamps(timestamps) {
    this.timestamps = timestamps;
  }
  sort(frame: FrameItem) {
    // 需要保证时间有序
    let prevtime =
      this.ready_frames.length > 0
        ? this.ready_frames[this.ready_frames.length - 1].timestamp
        : 0;
    const popFrames = [];
    while (frame.timestamp < prevtime && this.ready_frames.length > 0) {
      popFrames.unshift(this.ready_frames.pop());
      if (this.ready_frames.length === 0) {
        prevtime = 0;
        break;
      } else {
        prevtime = this.ready_frames[this.ready_frames.length - 1].timestamp;
      }
    }
    return popFrames;
  }
  handleFrame(frame: FrameItem, ctx) {
    const popFrames = this.sort(frame);
    this.ready_frames.push(frame);
    if (popFrames.length > 0) this.ready_frames.push(...popFrames);
    if (this.underflow) {
      requestAnimationFrame(() => this.render_frame(ctx));
    }
  }

  close() {
    for (const delay of this.delays) {
      delay.cancel();
    }
    for (const frame of this.render_frames) {
      frame.frame.close();
    }
    this.delays = [];
    this.render_frames = [];
  }

  calculateTimeTillNextFrame(timestamp) {
    if (this.time_base == 0) {
      performance.mark(this.marker);
      this.time_base = timestamp;
    }
    let media_time =
      timestamp -
      this.time_base -
      performance.measure('帧时间', this.marker).duration;
    return Math.max(0, media_time);
  }

  async render_frame(ctx) {
    if (this.ready_frames.length == 0) {
      this.underflow = true;
      return;
    }
    this.prevFrame && this.prevFrame.frame.close();
    let frame = this.ready_frames.shift();
    this.underflow = false;

    // Based on the frame's timestamp calculate how much of real time waiting
    // is needed before showing the next frame.
    let time_till_next_frame = this.calculateTimeTillNextFrame(
      frame.timestamp / 1000
    );
    const delay = new CancelablePromise((resolve) =>
      setTimeout(resolve, time_till_next_frame)
    );
    this.delays.push(delay);
    this.render_frames.push(frame);
    await delay;
    this.delays.shift();
    ctx.drawImage(frame.frame, 0, 0);
    self.postMessage({
      type: 'progress',
      progress: ((this.frame_index + 1) / this.totalFrames) * 100,
      index: this.frame_index,
    });
    this.prevFrame = this.render_frames.shift();
    if (this.frame_index++ + 5 === this.totalFrames) {
      // 最后5帧必须在0.5秒内播完
      setTimeout(() => {
        this.reset();
        this.endCallback && this.endCallback(this.duration / 1e3);
      }, 500);
    }
    // Immediately schedule rendering of the next frame
    requestAnimationFrame(() => this.render_frame(ctx));
  }
}
