<!--
 * @Author: qinyadong
 * @Date: 2022-05-19 11:36:59
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-19 09:32:31
 * @FilePath: \vue-components\src\components\AlgoClient\index.vue
-->
<template>
  <div class="camera-wrap" ref="container">
    <ImageSnapshot v-if="cameraLoaded && !cameraError" :streamHost="streamHost" :streamPort="streamPort" />
    <!-- 可能需要在画布上加点东西，譬如站位框 -->
    <slot />
    <!--  预加载子组件 -->
    <slot name="preload" />
    <div class="camera-loading" v-if="!cameraLoaded && !cameraError">
      <VLottiePlayer :source="cameraLoading" loop style="width: 94px; height: 115px; margin-bottom: 36px" />
      AI摄像头开启中..
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import VLottiePlayer from '@/components/VLottiePlayer/index.vue';
import ImageSnapshot from '@/components/ImageSnapShot/index.vue';
import { useAlgoData } from '@/hooks/algo';
import { propTypes } from '@/utils/propTypes';
const { cameraLoaded, cameraError } = useAlgoData();
const cameraLoading = new URL(
  '../../assets/animations/camera-loading.json',
  import.meta.url
).href;
const container = ref();

defineProps({
  streamHost: propTypes.string.def('127.0.0.1'),
  streamPort: propTypes.string.def('8081')
})

onMounted(() => {
  nextTick(() => {
    const width = container.value.getBoundingClientRect().width
    container.value.style.height = width * 1080 / 1920 + 'px';
  })
})
defineExpose({
  container
})
</script>

<style lang="less" scoped>
.camera-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .camera-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(73, 73, 73, 1);
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 24px;
  }
}
</style>
