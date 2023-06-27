<template>
  <div class="recorder-wrap disable-selection">
    <div class="py-10 flex justify-center">
      <div class="recorder-btn" ref="recordBtn" v-touch:press="startHandler" v-touch:release="stopHandler" @contextmenu.stop>
        <slot>
          <Button type="default" :size="buttonSize">按住说话</Button>
        </slot>
      </div>
    </div>
    <div class="wave-view-wrapper" v-show="recording">
      <div class="wave-view-content" ref="waveView"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { propTypes } from '@/utils/propTypes';
  import { useRecorder } from './hooks';
  import { Button, ButtonSize } from 'vant';
  import 'vant/es/button/style';

  const props = defineProps({
    aiVoiceReceived: propTypes.func,
    userVoiceParsed: propTypes.func,
    sessionId: propTypes.string,
    isMobile: propTypes.bool,
    getASRUrlParams: propTypes.func,
    waveColor: propTypes.string,
    buttonSize: propTypes.custom<ButtonSize>(() => true).def('normal'),
  });

  const waveView = ref();
  const recordBtn = ref();

  const { recording, recStop, recStart, rec, connect } = useRecorder({
    waveView,
    callMode: false,
    userVoiceParsed: props.userVoiceParsed,
    getUrlParams: props.getASRUrlParams,
    waveColor: props.waveColor,
  });
  const touching = ref(false);

  function mouseupHandler() {
    if (unref(touching)) {
      stopHandler();
    }
  }

  function stopHandler() {
    if (!unref(touching)) return;
    touching.value = false;
    if (!props.isMobile) {
      document.removeEventListener('mouseup', mouseupHandler);
    }
    recStop();
  }

  function startHandler() {
    touching.value = true;
    if (!unref(rec)) {
      document.addEventListener('mouseup', mouseupHandler);
    }
    nextTick(async () => {
      await connect();
      recStart(() => {
        recording.value = true;
      });
    });
  }
  function forbideContextmenu(e) {
    e.preventDefault();
  }
  onMounted(() => {
    unref(recordBtn).addEventListener('contextmenu', forbideContextmenu);
  });
  onBeforeUnmount(() => {
    unref(recordBtn).removeEventListener('contextmenu', forbideContextmenu);
  });
</script>

<style lang="less" scoped>
  .recorder-wrap {
    position: relative;
  }
  .record-container.active {
    background: rgba(0, 0, 0, 0.1);
    color: rgba(0, 0, 0, 0.25);
  }
  .wave-view-wrapper {
    position: absolute;
    margin-left: -70px;
    top: -5px;
    width: 72px;
    height: 53px;
  }
  .wave-view-content {
    height: 45px;
    width: 50px;
    margin: 0 auto;
  }

  /* 禁用长按弹出上下文菜单 */
  * {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
  }
</style>
