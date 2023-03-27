<!--
 * @Author: qinyadong
 * @Date: 2022-03-21 11:41:11
 * @LastEditors: qinyadong
 * @LastEditTime: 2022-09-11 11:30:13
 * @FilePath: /universal-vite-vue3/packages/vue-components/src/components/VLottiePlayer/index.vue
-->
<template>
  <lottie-player ref="player" autoplay mode="normal" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import "@lottiefiles/lottie-player";

const props = defineProps({
  source: String,
});
const emit = defineEmits(['complete']);
const player = ref();
onMounted(() => {
  player.value.addEventListener('rendered', () => {
    //Load via URL
    player.value.load(props.source);
  });
  player.value.addEventListener('complete', () => {
    emit('complete');
  });
});
defineExpose({
  player
})
</script>
<style scoped>
</style>
