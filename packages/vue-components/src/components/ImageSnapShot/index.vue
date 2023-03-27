<!--
 * @Author: tan jia wen
 * @Date: 2022-04-28 10:49:12
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-08-09 09:48:04
 * @FilePath: \vue-components\src\components\ImageSnapShot\index.vue
-->
<template>
  <div id="img-containers" class="img-containers"></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
const props = defineProps({
  streamHost: {
    type: String,
    default: '127.0.0.1',
  },
  streamPort: {
    type: String,
    default: '8081',
  },
});
let webcam;
function createImgLayer() {
  const img = new Image();
  img.style.position = 'absolute';
  img.style.zIndex = '1';
  img.style.width = '100%';
  img.style.height = 'auto';
  img.style.objectFit = 'cover';
  img.src = `http://${props.streamHost}:${props.streamPort}?action=aea_stream`;
  img.onload = imageOnload;
  img.onerror = imgOnerror;

  webcam.insertBefore(img, webcam.firstChild);
}
function imageOnload() {}
function imgOnerror(error) {
  // TODO 错误处理
  console.log('error', error);
}
onMounted(() => {
  webcam = document.getElementById('img-containers');
  createImgLayer();
});
</script>
<style lang="less" scoped>
.img-containers {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
