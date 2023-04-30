<!--
 * @Author: qinyadong
 * @Date: 2021-11-26 15:37:57
 * @LastEditTime: 2022-08-18 15:36:01
 * @LastEditors: qinyadong
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-components\src\components\Realtime\index.vue
-->
<template>
  <div class="video" ref="video">
    <div class="responsive-video">
      <canvas :width="videoWidth" ref="canvas" :height="videoHeight" style="width: 100%; height: 100%"></canvas>
      <Skeleton :canvasData="skeletonData" style="position: absolute; top: 0; left: 0" :width="videoWidth"
        :height="videoHeight" :centered="false" :type="SkeletonType.realtime"></Skeleton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, onUnmounted } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { initialCanvas } from './yuv';
import { eventBus } from '@/utils';
import { MediaType } from '@/common';
import Skeleton from '/@/components/Skeleton/index.vue';
import PCMPlayer from './PCMPlayer';
import { Uint8ArrayToString } from '@/utils';
import { SkeletonType } from '@/components/Skeleton/settings';

const props = defineProps({
  // 画面帧数据
  frameEvent: String,
  videoRef: propTypes.any,
  titleVideo: String,
  videoWidth: propTypes.number.def(1920),
  videoHeight: propTypes.number.def(1080),
});
const emit = defineEmits(['cameraLoaded']);
const instance = getCurrentInstance();
const scale = ref(1);
const skeletonData = ref();
const video = ref();
let cameraLoading = true,
  frameReceivedHandler;
onMounted(() => {
  const pcmOption = {
    encoding: '32bitFloat',
    channels: 1,
    sampleRate: 8000,
    flushingTime: 1000,
  };
  const pcmPlayer = new PCMPlayer(pcmOption);

  const { videoWidth, videoHeight, frameEvent } = props;
  const videoEl = instance!.refs.video as HTMLCanvasElement;
  const { width } = videoEl.getBoundingClientRect();
  videoEl.style.height = (videoHeight * width) / videoWidth + 'px';
  scale.value = width / videoWidth;
  const renderer = initialCanvas(instance!.refs.canvas, videoWidth, videoHeight);
  frameReceivedHandler = function ({
    type,
    data,
  }: {
    type: string;
    data: Uint8Array;
  }) {

    // 直接渲染yuv格式数据
    if (type === MediaType.video) {
       // 解码h264数据
      // player.decode(bytes);

      if (cameraLoading) {
        cameraLoading = false;
        emit('cameraLoaded');
      }
      renderer.renderImg(videoWidth, videoHeight, data);
    }

    // 音频的实时播放
    if (type === MediaType.audio) {
      pcmPlayer.feed(data);
    }

    if (type === MediaType.data) {
      let result = JSON.parse(Uint8ArrayToString(data)).data;
      skeletonData.value = [
        result.map((item) => item.keypoints2d),
        result.map((item) => {
          return {
            trajectory_left: item.trajectory_left,
            trajectory_right: item.trajectory_right,
          };
        }),
      ];
    }
  };

  eventBus.on(frameEvent!, frameReceivedHandler);
});
onUnmounted(() => {
  eventBus.off(props.frameEvent!, frameReceivedHandler);
});
defineExpose({
  video
})
</script>

<style scoped>
.responsive-video {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
</style>
