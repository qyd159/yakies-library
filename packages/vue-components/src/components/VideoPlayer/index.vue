<!--
 * @Author: qinyadong
 * @Date: 2022-03-02 15:37:37
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-18 10:08:03
 * @FilePath: \vue-components\src\components\VideoPlayer\index.vue
-->
<template>
  <div class="video-player">
    <Playback
      :class="playbackClass"
      ref="videoEl"
      :source="source"
      :interactive="interactive"
      :mouseControl="mouseControl"
      :loop="loop"
      :playbackRate="playbackRate"
      @progress="handleProgress"
      @ready="handleReady"
      @start="handleStart"
      @end="handleEnd"
      @paused="handlePaused"
      @played="handlePlayed"
      @click="playbackClick"
    />
    <slot name="content"></slot>
    <div class="loading" v-if="!loaded">
      <img :src="loadingBgImgUrl" />
      <LottiePlayer :source="loadingUri" style="width: 60px; height: 60px" loop />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
import Playback from "@/components/VideoPlayer/playback.vue";
import { propTypes } from "@/utils/propTypes";
import LottiePlayer from "@/components/VLottiePlayer/index.vue";
import {
  totalTime,
  currentTime,
  isPaused,
  setShareVideoEl,
  resetShareData,
} from "./shareData";
import loadingBgImgUrl from "@/assets/images/start-camera-bg.png";

const loadingUri = new URL("../../assets/animations/loading.json", import.meta.url).href;
const loaded = ref(false);
const progressEl = ref();
const videoEl = ref();
const emit = defineEmits(["progress", "paused", "played", "ready", "end", "toggle"]);

const props = defineProps({
  source: String,
  showProgress: propTypes.bool.def(false),
  bottomWidth: propTypes.number.def(480),
  bottomHeight: propTypes.number.def(200),
  // 半隐藏时的Y方向向下的偏移值
  halfOffsetY: propTypes.number.def(0),
  // 开启画中画,增加实时画面
  pictureInPicture: propTypes.bool.def(false),
  // 切换画中画模式，0表示实时在右下角，1表示实时全屏
  mode: propTypes.number.def(0),
  // 是否启用鼠标键盘事件
  interactive: propTypes.bool.def(true),
  // 循环播放
  loop: propTypes.bool.def(false),
  // 是否启用鼠标控制暂停和播放
  mouseControl: propTypes.bool.def(false),
  // 播放帧率
  playbackRate: propTypes.number.def(1),
});

const playbackClass = computed(() => {
  if (props.pictureInPicture) {
    return props.mode === 1 ? "bottom-video" : "full-video";
  }
  return "";
});

function handleReady(info) {
  totalTime.value = info.duration;
  setTimeout(() => {
    loaded.value = true;
  }, 200);
  emit("ready", info);
}
function handleStart() {
  isPaused.value = false;
}
function handleEnd() {
  emit("end");
}
function handlePaused() {
  isPaused.value = true;
  emit("paused");
}
function handlePlayed() {
  isPaused.value = false;
  emit("played");
}
function handleProgress({ progress }) {
  if (!isPaused.value) {
    currentTime.value = progress * totalTime.value;
  }
  emit("progress", { progress });
}
function progressMousedownHandler() {
  videoEl.value.pause();
  isPaused.value = true;
}

function realtimeClick() {
  if (props.mode === 0 && props.pictureInPicture) {
    emit("toggle");
  }
}
function playbackClick() {
  if (props.mode === 1 && props.pictureInPicture) {
    emit("toggle");
  }
}
onUnmounted(() => {
  resetShareData();
  progressEl.value &&
    progressEl.value.$el.removeEventListener("mousedown", progressMousedownHandler);
});

onMounted(() => {
  setShareVideoEl(videoEl);
  watch(
    () => progressEl.value,
    () => {
      if (progressEl.value && progressEl.value.$el) {
        progressEl.value.$el.addEventListener("mousedown", progressMousedownHandler);
      }
    },
    { immediate: true }
  );
});
defineExpose({
  seek(time, resume = false) {
    videoEl.value.seek(time, resume);
  },
  pause() {
    videoEl.value.pause();
  },
  play() {
    videoEl.value.start();
  },
  videoEl
});
</script>

<style lang="less" scoped>
.video-player {
  position: relative;
  height: 100%;
  overflow: hidden;
  left: -1px;
}

.bottom-video {
  position: absolute;
  bottom: 40px;
  right: 41px;
  width: 400px;
  height: 226px;
  z-index: 998;
  overflow: hidden;
}
.full-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  // background-color: #000;
}
.loading {
  // background: url(@/assets/images/start-camera-bg.png) 0 0 / cover no-repeat;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9999;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  > img {
    position: absolute;
    height: 100%;
    width: 100%;
  }
}
</style>
