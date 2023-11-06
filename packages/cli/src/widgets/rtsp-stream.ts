import Stream from 'node-rtsp-stream';

export default function (args) {
const stream = new Stream({
  name: 'name',
  streamUrl: 'rtsp://192.168.2.184:8554/talk_room.264',
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
  })
 }
// rtsp://10.13.3.15:554/rtp/44011500491187000103_34020000001320000003
