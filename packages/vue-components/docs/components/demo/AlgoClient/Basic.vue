<template>
  <ClientOnly>
    <AlgoClient style="width: 100%;" ref="video" />
  </ClientOnly>
  <button @click="Fullscreen" style="float:right;">全屏</button> &nbsp;&nbsp;&nbsp;
  <label for="algo-checkbox">开启算法</label><input id="algo-checkbox" type="checkbox" v-model="enableAlgo" />
</template>
<script setup lang="ts">
import { watch, unref, ref, onMounted, onUnmounted } from 'vue'
import {
  useAlgoData,
  EAlgoSendCommand,
  useSend,
  useAlgo
} from '@/hooks';
const video = ref()
const enableAlgo = ref(false)
const { startFace, startAlgo, stopStream } = useSend();
const { resetCamera, algoOn, cameraLoaded, cameraError } = useAlgoData();
let timer;
watch(
  () => unref(algoOn),
  (value) => {
    // 解决算法服务启动成功后，又断开websocket
    if (!value && cameraLoaded.value) {
      handleCameraError();
    }
  },
  {
    immediate: true,
  }
);
watch(
  () => unref(cameraError),
  (cameraStatus) => {
    if (cameraStatus) {
      handleCameraError();
      timer && clearTimeout(timer);
    }
  }
);

function handleCameraError() {
  console.error('摄像头加载失败，将在5s后重试');
  setTimeout(() => {
    resetCamera();
  }, 5000)
}

const start = async () => {
  unref(enableAlgo) ? startAlgo(EAlgoSendCommand.AlgoA1) : startFace(EAlgoSendCommand.FaceA1);
  // 解决首次启动服务慢的问题
  timer = setTimeout(() => {
    if (!cameraLoaded.value && !unref(cameraError)) {
      cameraError.value = true;
    }
    clearTimeout(timer);
  }, 10 * 1000);
};

watch(enableAlgo, (val) => {
  if (val) {
    startAlgo(EAlgoSendCommand.AlgoA1)
  } else {
    startFace(EAlgoSendCommand.FaceA1)
  }
})

onMounted(() => {
  cameraError.value = false;
  useAlgo();
  start();
});
onUnmounted(() => {
  timer && clearTimeout(timer);
});

function Fullscreen() {
  video.value.container['requestFullscreen'](); // 调用全屏
}

</script>
