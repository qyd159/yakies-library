<template>
  <canvas ref="el" class="canvas" :width="canvasWidth" :height="canvasHeight"
    style="background-color: transparent; width: 100%; height: 100%">
  </canvas>
</template>

<script lang="ts" setup>
import { watch, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { propTypes } from '@/utils/propTypes';
import { any } from 'vue-types';
import { eventBus } from '@/utils';
import { SKELETON_DATA } from '@/common';
import { skeletonDraw } from './skeleton';
import { parts, SkeletonType } from './settings';
const props = defineProps({
  canvasData: any().def([]),
  width: propTypes.number.def(1920),
  height: propTypes.number.def(1080),
  centered: propTypes.bool.def(true),
  canvasScale: propTypes.number.def(1),
  type: propTypes.custom<SkeletonType>((v) => true).def(SkeletonType.playback),
  keepDimension: propTypes.oneOf(['width', 'height']).def('width'),
  part: propTypes.custom<keyof typeof parts>((v) => true),
});

const canvasWidth = ref(props.width);
const canvasHeight = ref(props.height);

const instance = getCurrentInstance();
const canvasScale = ref(1);

onMounted(() => {
  const canvasEl = instance!.refs.el as HTMLCanvasElement;
  const ctx = canvasEl.getContext('2d');

  let draw = skeletonDraw({
    type: props.type,
    canvasWidth: canvasWidth.value,
    canvasHeight: canvasHeight.value,
    canvasScale: canvasScale.value,
    centered: props.centered,
  });

  watch(
    canvasWidth,
    () => {
      const { width: originWidth, height: originHeight } =
        canvasEl.getBoundingClientRect();
      const height = (canvasHeight.value * originWidth) / canvasWidth.value;
      const width = (canvasWidth.value * originHeight) / canvasHeight.value;
      if (props.keepDimension === 'width') {
        canvasEl.style.height = height + 'px';
        // canvasEl.parentElement.style.height = height + 'px';
      } else if (props.keepDimension === 'height') {
        canvasEl.style.width = width + 'px';
        canvasEl.style.marginLeft = (originWidth - width) / 2 + 'px';
      }

      if (props.centered) {
        canvasScale.value = originWidth / canvasWidth.value;
      }
      draw = skeletonDraw({
        type: props.type,
        canvasWidth: canvasWidth.value,
        canvasHeight: canvasHeight.value,
        centered: props.centered,
        canvasScale: canvasScale.value,
        maxScale:
          ['arms', 'body', 'legs'].indexOf(props.part!) !== -1 || !props.part
            ? 4
            : undefined,
      });
    },
    { immediate: true }
  );

  watch(
    props,
    ({
      canvasData: [skeletonData = [], trajectoryData = [], actionData = []],
    }) => {
      draw(ctx!, [skeletonData, trajectoryData, actionData]);
      canvasEl.style.transform = `scale(${props.canvasScale})`;
    },
    { immediate: true }
  );

  // @ts-ignore
  eventBus.on(SKELETON_DATA, ([skeletonData, trajectoryData, actionData]) => {
    draw(ctx!, [skeletonData, trajectoryData, actionData], props.part);
  });
});
onUnmounted(() => {
  eventBus.off(SKELETON_DATA)
})
</script>
