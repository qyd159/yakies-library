<template>
  <AsyncComp>
  </AsyncComp>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
const AsyncComp = defineAsyncComponent(() =>
  import('./Lottie.vue')
)
</script>

<style scoped>

</style>
