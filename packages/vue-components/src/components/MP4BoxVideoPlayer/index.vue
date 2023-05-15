<template>
  <div class="video" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="responsive-video">
      <canvas ref="videoEl" :width="videoWidth" :height="videoHeight"
        style="background-color: #000; width: 100%; height: 100%"></canvas>
      <img v-show="progress === 0" :src="imgUrl"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%" />
    </div>
    <IconEffect v-if="isPaused" class="play-btn" name="video-play" size="94" type="svg" @click="start" />
    <IconEffect v-if="!isPaused && isHovered" class="play-btn" name="video-pause" size="94" type="svg" @click="pause" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, toRaw, nextTick, computed } from "vue";
import { propTypes } from "@/utils/propTypes";
import CanvasWorker from "./worker?raw";
import { IconEffect } from "@/components/Icon";

const videoWidth = ref(1920);
const videoHeight = ref(1080);
const videoInfo = ref();
const isHovered = ref(false);
const isPaused = ref(true);
const videoEl = ref();
const progress = ref(0);
const isStarted = ref(false);

const props = defineProps({
  // 骨骼、轨迹等的坐标数据
  dataEvent: String,
  startFrame: propTypes.number.def(0),
  maxFrames: propTypes.number.def(100),
  info: propTypes.object,
  bitmap: propTypes.any,
  paused: propTypes.bool.def(true),
});


const currentTime = computed(() => progress.value * (videoInfo.value?.duration || 0));

const emit = defineEmits(["progress", "ready", "started", "paused", "end", "precheck"]);

const imgUrl = ref(
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
);

let canvasWorker;

watch(
  () => props.bitmap,
  (newval, oldval) => {
    if (oldval) {
      window.URL.revokeObjectURL(imgUrl.value);
    }
    if (newval) {
      progress.value = 0;
      imgUrl.value = window.URL.createObjectURL(newval);
    }
  },
  { immediate: true }
);

onMounted(() => {
  watch(
    videoWidth,
    () => {
      const { width } = videoEl.value.getBoundingClientRect();
      videoEl.value.style.height = (videoHeight.value * width) / videoWidth.value + "px";
    },
    { immediate: true }
  );
  canvasWorker = new Worker(URL.createObjectURL(new Blob([CanvasWorker], { type: 'application/javascript' })));

  canvasWorker.addEventListener("message", async ({ data }) => {
    switch (data.type) {
      case "info":
        videoInfo.value = data.data;
        emit("ready", videoInfo.value);
        break;
      case "start":
        emit("started", data);
        isStarted.value = true;
        break;
      case "pause":
        isStarted.value = false;
        break;
      case "progress":
        if (isPaused.value && isStarted.value) {
          isPaused.value = false;
        }
        if (!isPaused.value && !isStarted.value) {
          isPaused.value = true;
        }
        progress.value = data.progress;
        emit("progress", data);
        break;
      case "end":
        isPaused.value = true;
        isStarted.value = false;
        emit("end", data);
        break;
    }
  });

});


function setTimestamps(timestamps) {
  canvasWorker.postMessage({ type: "timestamps", info: timestamps });
}

function init() {
  // @ts-ignore
  var offscreen = videoEl.value.transferControlToOffscreen();

  canvasWorker.postMessage({ canvas: offscreen, type: "init", info: toRaw(props.info) }, [
    offscreen,
  ]);
}
function updateInfo() {
  canvasWorker.postMessage({ type: "update-info", info: toRaw(props.info) });
}
function start() {
  emit("precheck");
  nextTick(() => {
    canvasWorker.postMessage({
      type: "start",
      startTime: currentTime.value / 1e2,
    });
  });
}

function pause() {
  canvasWorker.postMessage({ type: "pause" });
  isPaused.value = true;
  emit("paused");
}

function seek(progress: number) {
  pause();
  canvasWorker.postMessage({
    startTime: progress / 1e3,
    type: "seek",
  });
}

defineExpose({
  setTimestamps,
  init,
  updateInfo,
  start,
  seek,
  pause,
  videoEl
});
</script>
<style lang="less" scoped>
.video {
  position: relative;
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -48px;
  margin-left: -48px;
}

.responsive-video {
  position: relative;
}
</style>
