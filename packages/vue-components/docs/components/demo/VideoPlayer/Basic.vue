<template>
  <ClientOnly>
    <VideoPlayer ref="video" source="https://files.yakies.cn/static/4k-sample.mp4"> </VideoPlayer>
  </ClientOnly>
  <button @click="Fullscreen">全屏</button>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  const video = ref();
  /**
   * @description: 将传进来的元素全屏
   * @param {String} domName 要全屏的dom名称
   */
  function Fullscreen() {
    video.value.videoEl.videoEl['requestFullscreen'](); // 调用全屏
  }
  onMounted(() => {
    // video.value.start()
  });
</script>
