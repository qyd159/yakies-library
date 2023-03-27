<template>
    <Realtime frameEvent="algo" ref="video" />
    <button @click="Fullscreen">全屏</button>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { eventBus } from '@/utils';
import SocketClient from '@yakies/rx-socket-client';
import { MediaType } from '@/common';

const video = ref();
const socketClient = new SocketClient(
    `http://127.0.0.1:3202`
);
socketClient.on('video_frame', (data) => {
    eventBus.emit('algo', { type: MediaType.video, data: new Uint8Array(data) });
})
socketClient.on('data_frame', (data) => {
    eventBus.emit('algo', { type: MediaType.data, data: new Uint8Array(data) });
})
onMounted(() => {
    socketClient.emit(['start', { enable_algo: 1 }])
})
function Fullscreen() {
    video.value.video['requestFullscreen'](); // 调用全屏
}
</script>