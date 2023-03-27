<template>
  <ClientOnly>
    <VLottiePlayer :source="url" ref="lottie" style="background-color: var(--vp-code-block-bg);">
    </VLottiePlayer>
  </ClientOnly>
  <button @click="Fullscreen" style="float:right;">全屏</button>
  <button @click="replay">重放</button>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import url from '../../../assets/animations/countdown.json?url';

const lottie = ref()
function Fullscreen() {
  lottie.value.player['requestFullscreen'](); // 调用全屏
}
function replay() {
  lottie.value.player.seek(0)
  lottie.value.player.play()
}
</script>