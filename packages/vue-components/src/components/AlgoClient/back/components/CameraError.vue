<!--
 * @Author: tan jia wen
 * @Date: 2022-04-22 14:17:00
 * @LastEditors: tan jia wen
 * @LastEditTime: 2022-04-27 17:16:06
 * @FilePath: \aea-class-client\src\views\interClassroom\classroomShow\components\CameraError.vue
-->
<template>
  <div class="camera-error flex flex-col items-center">
    <IconEffect
      :name="errorUri"
      type="image"
      :style="{ width: 48 + 'px', height: '48px', marginBottom: '29px' }"
    />
    <div class="person-info">{{ title }}</div>
    <CommonButton size="small" @onClick="onClick" :text="btnText" />
  </div>
</template>
<script lang="ts" setup>
  import { IconEffect } from '@/components/Icon';
  import CommonButton from '@/components/CommonButton/index.vue';

  type EmitType = {
    (e: 'onClick'): void;
  };
  defineProps({
    title: String,
    btnText: String,
  });
  const emit = defineEmits<EmitType>();
  const errorUri = new URL('../../../../assets/images/error.png', import.meta.url).href;

  const onClick = () => emit('onClick');
</script>
<style lang="less" scoped>
  .camera-error {
    padding-top: 53px;

    .person-info {
      color: #512f1f;
      font-size: 40px;
      line-height: 40px;
      margin-bottom: 60px;
    }
  }
</style>
