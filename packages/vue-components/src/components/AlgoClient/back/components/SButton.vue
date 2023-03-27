<template>
  <div class="btn" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <slot name="icon" :actived="hovered"></slot>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const hovered = ref(false);
const props = defineProps({
  icons: {
    type: Array,
    default() {
      return [];
    },
  },
});
</script>

<style scoped></style>
