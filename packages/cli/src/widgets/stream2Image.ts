import { spawn } from 'child_process';
import { Transform } from 'stream';
import sharp from 'sharp';

class JPEGTransform extends Transform {
  _buff: Buffer;
  _SOI: Buffer;
  _EOI: Buffer;
  constructor(options = null) {
    super(options);
    this._buff = Buffer.alloc(0);
    this._SOI = Buffer.from([0xff, 0xd8]); // Start of Image
    this._EOI = Buffer.from([0xff, 0xd9]); // End of Image
  }

  _transform(chunk, encoding, callback) {
    this._buff = Buffer.concat([this._buff, chunk]);
    while (true) {
      const start = this._buff.indexOf(this._SOI);
      const end = this._buff.indexOf(this._EOI);
      if (start !== -1 && end !== -1 && start < end) {
        const image = this._buff.slice(start, end + 2);
        this.push(image); // Got a new image, push it out
        this._buff = this._buff.slice(end + 2); // Remove the image from the buffer
      } else {
        break;
      }
    }
    callback();
  }
}

export default function (args) {
  const jpegTransform = new JPEGTransform();

  const params = [
    '-i',
    'rtsp://admin:dmai2022@192.168.2.38:554/h265/ch1/main/av_stream',
    '-f',
    'image2pipe',
    '-vcodec',
    'mjpeg',
    '-q:v',
    '5',
    '-vsync',
    'drop',
    '-vf',
    'fps=15',
    '-',
  ];
  console.log(['ffmepg'].concat(params).join(' '));
  const ffmpeg = spawn('ffmpeg', params);

  ffmpeg.stdout.pipe(jpegTransform);

  let index = 0;
  jpegTransform.on('data', (data) => {
    // 'data' is a Buffer containing a complete JPEG image
    // Handle the image here, e.g., save to disk or send over network
    sharp(data).toFile(`.output/output${index}.jpg`);
    index++;
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}
