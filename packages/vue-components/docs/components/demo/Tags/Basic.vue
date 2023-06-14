<template>
  <Tags v-model:value="value"> </Tags>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, nextTick } from 'vue';
  const value = ref('');
</script>
