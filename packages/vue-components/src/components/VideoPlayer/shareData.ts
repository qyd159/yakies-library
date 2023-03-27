import { ref } from 'vue';

const totalTime = ref();
const currentTime = ref();
const shareVideoEl = ref();
const isPaused = ref(true);

const setShareVideoEl = (videoRef) => {
  shareVideoEl.value = videoRef.value;
};

const resetShareData = () => {
  totalTime.value = null;
  currentTime.value = null;
  shareVideoEl.value = null;
  isPaused.value = true;
};

export { totalTime, currentTime, isPaused, shareVideoEl, setShareVideoEl, resetShareData };
