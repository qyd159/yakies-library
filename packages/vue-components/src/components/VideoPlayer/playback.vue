<!--
 * @Author: qinyadong
 * @Date: 2022-03-02 15:38:16
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-18 16:43:03
 * @FilePath: \vue-components\src\components\VideoPlayer\playback.vue
-->
<template>
  <div class="video" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="responsive-video">
      <video ref="videoEl" style="background-color: #000; width: 100%; height: 100%" @click="mouseClick"></video>
    </div>
    <IconEffect v-if="isPaused && isHovered && interactive" type="svg" class="play-btn" name="video-play" size="94"
      @click="toggle" style="cursor: pointer" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, watchEffect, Ref } from "vue";
import { IconEffect } from "@/components/Icon";
import { propTypes } from "@/utils/propTypes";
import { applicationDeps } from "../../preload";

const { createScopeLog } = applicationDeps;
const CONSOLE = createScopeLog("play-back");
const videoWidth = ref(1920);
const videoHeight = ref(1080);
const isHovered = ref(false);
const isPaused = ref(true);

const props = defineProps({
  source: String,
  interactive: propTypes.bool.def(true),
  loop: propTypes.bool.def(false),
  // 是否启用鼠标控制暂停和播放
  mouseControl: propTypes.bool.def(false),
  playbackRate: propTypes.number.def(1),
});

const totalTime = ref(100);

const emit = defineEmits(["start", "progress", "ready", "end", "paused", "played"]);

const videoEl = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>;

let action;

onMounted(() => {
  watch(
    () => props.interactive,
    () => {
      if (props.interactive) {
        document.addEventListener("keypress", handleKeyPress);
      } else {
        document.removeEventListener("keypress", handleKeyPress);
      }
    },
    { immediate: true }
  );

  watch(
    () => props.playbackRate,
    (rate) => {
      videoEl.value.playbackRate = rate;
      videoEl.value.muted = rate < 1;
    }
  );

  watchEffect(() => init());

  videoEl.value.oncontextmenu = function () {
    return false;
  };

  watch(
    videoWidth,
    () => {
      const { width } = videoEl.value.getBoundingClientRect();
      videoEl.value.style.height = (videoHeight.value * width) / videoWidth.value + "px";
    },
    { immediate: true }
  );
  // 监听元素尺寸变化
  var ro = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      videoEl.value &&
        (videoEl.value.style.height =
          (videoHeight.value * cr.width) / videoWidth.value + "px");
    }
  });

  // 观察一个或多个元素
  ro.observe(videoEl.value);

  action = requestFrameCallback();

});

onUnmounted(() => {
  document.removeEventListener("keypress", handleKeyPress);
});

function requestFrameCallback() {
  let prevFrameIndex = -1,
    stoppedCallback;
  function requestFrameAction() {
    requestAnimationFrame(() => {
      if (stoppedCallback) {
        stoppedCallback();
        return;
      }
      if (!isPaused.value && videoEl.value) {
        const curTime = videoEl.value.currentTime;
        const progress = curTime / totalTime.value;
        if (prevFrameIndex !== curTime) {
          emit("progress", { progress });
          prevFrameIndex = curTime;
        }
      }
      requestFrameAction();
    });
  }
  requestFrameAction();
  return {
    stop(cb: Function) {
      stoppedCallback = cb;
    },
    start() {
      stoppedCallback = null;
      requestFrameAction();
      emit("start");
    },
  };
}


function run() {
  action.start();
  isPaused.value = false;
}

async function init() {
  videoEl.value.src = props.source;
  // videoEl.value.addEventListener('timeupdate', (event) => {
  //   console.log('timeupdate' + videoEl.value.currentTime);
  // });
  videoEl.value.addEventListener("playing", () => {
    isPaused.value = true;
    // 上一次帧循环结束后再处理
    action.stop(run);
  });
  videoEl.value.addEventListener("pause", () => {
    isPaused.value = true;
  });
  videoEl.value.addEventListener("ended", () => {
    isPaused.value = true;
    emit("end");
    if (props.loop) {
      isPaused.value = false;
      videoEl.value.play();
    }
  });
  videoEl.value.addEventListener("canplaythrough", function () {
    CONSOLE(`视屏ready:--canplay${new Date()}`);
    emit("ready", { duration: videoEl.value.duration });
    totalTime.value = videoEl.value.duration;
  });
}
function start() {
  videoEl.value.play();
}
async function seek(progress: number, resume: boolean) {
  videoEl.value.currentTime = progress;
  if (resume) {
    if (videoEl.value.paused) {
      videoEl.value.play();
    }
  }
  isPaused.value = true;
}
function pause() {
  videoEl.value.pause();
  isPaused.value = true;
}

function toggle() {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    videoEl.value.pause();
    emit("paused");
  } else {
    videoEl.value.play();
    emit("played");
  }
}

function handleKeyPress(e) {
  e.stopPropagation();
  e.preventDefault();
  if (e.key === " ") {
    toggle();
  }
}

function mouseClick() {
  if (props.mouseControl) {
    toggle();
  }
}

defineExpose({
  start,
  seek,
  pause,
  toggle,
  videoEl
});
</script>
<style lang="less" scoped>
.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -48px;
  margin-left: -48px;
}
</style>
