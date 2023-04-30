<template>
  <div class="audio-container" :style="containerStyle">
    <div class="audio-indicator" title="点击播放" @click="playAudio()">
      <span :style="textStyle">{{ timeDuration }}''</span>
      <Icon
        v-if="!currentAudioPlaying"
        :icon="type === 'answer' ? 'ant-design:audio-filled' : 'ant-design:audio-outlined'"
        style="margin-left: 9px"
      />
      <Progress
        class="audio-progress"
        :class="type === 'answer' ? '' : 'user-voice-progress'"
        v-else
        :percent="playProgress"
        style="margin: 0 6px"
        :showInfo="false"
        :strokeWidth="2"
        strokeColor="#fff"
      />
    </div>
    <Icon
      v-if="showTranslateIcon"
      :Icon="translateIcon"
      size="30"
      @click="
        () => {
          emit('toggle-text');
        }
      "
    />
  </div>
</template>

<script lang="ts" setup>
  import { Progress } from 'ant-design-vue';
  import { propTypes } from '@/utils/propTypes';
  import Icon from '@/components/Icon';

  const props = defineProps({
    type: propTypes.string.def('anser'),
    src: propTypes.string,
    showTranslateIcon: propTypes.bool.def(false),
    translated: propTypes.string.def(''),
    autoPlay: propTypes.bool.def(false),
  });

  const emit = defineEmits(['toggle-text']);

  const currentAudioPlaying = ref(false);
  const timeDuration = ref(0);
  const containerStyle = computed(() => {
    if (unref(timeDuration) > 3 && unref(timeDuration) < 40) {
      return {
        minWidth: 80 + (unref(timeDuration) - 3) * 4.5 + 'px',
      };
    }
    if (unref(timeDuration) >= 40) {
      return {
        minWidth: '250px',
      };
    }
    return {
      minWidth: '80px',
    };
  });

  const translateIcon = computed(() => {
    return props.type === 'answer'
      ? props.translated
        ? 'mdi:translate'
        : 'mdi:google-translate'
      : props.translated
      ? 'ant-design:translation-outlined'
      : 'ant-design:transaction-outlined';
  });
  const textStyle = computed(() => {
    if (props.type !== 'answer') {
      return {
        color: '#ffffff',
      };
    } else {
      return {};
    }
  });
  const audioRef = ref<HTMLAudioElement>();
  const playProgress = ref(0);
  const interval = ref();

  function setAudio(_audio: HTMLAudioElement) {
    removeAudio();

    audioRef.value = _audio;
    // if (audioRef.valueMuted) audioRef.value && (audioRef.value.muted = true);
    _audio.onloadedmetadata = (_e) => {
      // console.log(e);
    };
    _audio.oncanplay = () => {
      timeDuration.value = _audio.duration < 1 ? 1 : Math.round(_audio.duration);
      props.autoPlay && playAudio();
    };
    _audio.onended = () => {
      clearInterval(unref(interval));
      currentAudioPlaying.value = false;
      playProgress.value = 0;
      // this.removeAudio();
    };
    _audio.onerror = () => {
      // this.removeAudio();
    };
  }
  function removeAudio() {
    if (!audioRef.value) return;
    currentAudioPlaying.value = false;
    audioPause();
    audioRef.value.onended = null;
    audioRef.value.oncanplay = null;
    audioRef.value.onprogress = null;
    audioRef.value.onerror = null;
    audioRef.value.ontimeupdate = null;
    audioRef.value = undefined;
  }

  function audioPause() {
    if (!audioRef.value) return;
    // this.$store.commit('audioPlay', false);
    currentAudioPlaying.value = false;
    return audioRef.value.pause();
  }

  function playAudio() {
    const audio = audioRef.value;
    if (!audio) return;
    audio
      .play()
      .then(() => {
        // this.$store.commit('audioPlay', true);
        currentAudioPlaying.value = true;
        interval.value = setInterval(() => {
          playProgress.value = (audio.currentTime / audio.duration) * 100;
        }, 100);
      })
      .catch((_e) => {
        alert('语音播放失败，请手动点击播放');
      });
  }
  watch(
    () => props.src,
    () => {
      setAudio(new Audio(unescape(props.src)));
    },
    { immediate: true }
  );
  defineExpose({
    audioPlay() {
      if (!audioRef.value) return;
      // this.$store.commit('audioPlay', true);
      currentAudioPlaying.value = true;
      return audioRef.value.play();
    },
    reset() {
      removeAudio();
    },
  });
</script>

<style lang="less" scoped>
  .audio-container {
    margin: 14px 0;
    width: 100%;
    height: 46px;
    background: rgba(236, 248, 255, 1);
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 9px 0 16px;
  }
  .audio-indicator {
    display: flex;
    align-items: center;
    cursor: pointer;
    flex: 1;
  }
  .audio-progress {
    flex: 1;
    ::v-deep .ant-progress-inner {
      background-color: rgb(67.8%, 76.1%, 87.1%, 0.45);
    }
    &.user-voice-progress ::v-deep .ant-progress-inner {
      background-color: rgba(197, 53, 13, 1);
    }
  }
</style>
