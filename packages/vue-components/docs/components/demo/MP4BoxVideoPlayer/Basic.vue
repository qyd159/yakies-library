<template>
  <ClientOnly>
    <MP4BoxVideoPlayer ref="video" :info="{ url: 'https://files.yakies.cn/static/4k-sample.mp4' }"> </MP4BoxVideoPlayer>
  </ClientOnly>
  <button @click="Fullscreen">全屏</button>
</template>
<script lang="ts" setup>
  import { ref, onMounted, nextTick } from 'vue';

  const video = ref();
  function Fullscreen() {
    video.value.videoEl['requestFullscreen'](); // 调用全屏
  }
  onMounted(() => {
    nextTick(() => {
      video.value.init();
    });
  });
</script>
