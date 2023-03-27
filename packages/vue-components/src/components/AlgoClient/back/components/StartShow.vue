<!--
 * @Author: tan jia wen
 * @Date: 2022-04-22 11:12:28
 * @LastEditors: tan jia wen
 * @LastEditTime: 2022-04-25 17:53:03
 * @FilePath: \aea-class-client\src\views\interClassroom\classroomShow\components\StartShow.vue
-->
<template>
  <div class="start-show flex flex-col items-center">
    <IconEffect
      v-if="!!personInfo.uri"
      :name="personInfo.uri"
      type="image"
      :style="{ width: personInfo.width + 'px', height: '38px', marginBottom: '29px' }"
    />
    <div class="person-info"
      >已识别到<span class="person-num">{{ person }}</span
      >人</div
    >
    <CommonButton size="small" @onClick="onStartShow" text="开始展示" />
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { IconEffect } from '@/components/Icon';
  import { Button } from 'ant-design-vue';
  import CommonButton from '@/components/CommonButton/index.vue';
  type EmitType = {
    (e: 'onClick'): void;
  };
  const emit = defineEmits<EmitType>();
  const props = defineProps({
    person: {
      type: Number,
      default: 0,
    },
  });
  const onePersonUri = new URL('../../../../assets/images/one-person.png', import.meta.url).href;
  const twoPersonUri = new URL('../../../../assets/images/two-person.png', import.meta.url).href;

  const personInfo = computed(() =>
    props.person > 1
      ? {
          uri: twoPersonUri,
          width: 49,
        }
      : props.person === 1
      ? {
          uri: onePersonUri,
          width: 35,
        }
      : {
          uri: '',
        },
  );
  const onStartShow = () => emit('onClick');
</script>
<style lang="less" scoped>
  .start-show {
    padding-top: 53px;

    .person-info {
      color: #512f1f;
      font-size: 40px;
      line-height: 40px;
      margin-bottom: 60px;

      .person-num {
        color: #92c4c4;
        margin: 0 10px;
      }
    }
  }
</style>
