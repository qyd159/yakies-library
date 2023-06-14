<template>
  <template v-for="(tag, index) in state.tags" :key="tag">
    <template v-if="tag.length > 10">
      <Tag :closable="index !== 0" @close="handleClose(tag)">
        {{ `${tag.slice(0, 10)}...` }}
      </Tag>
    </template>
    <Tag v-else :closable="true" @close="handleClose(tag)">
      {{ tag }}
    </Tag>
  </template>
  <Input
    v-if="state.inputVisible"
    ref="inputRef"
    v-model:value="state.inputValue"
    type="text"
    size="small"
    :style="{ width: '78px', height: '22px', fontSize: '12px' }"
    @blur="handleInputBlur"
    @keyup.enter="handleInputConfirm"
    @change="changed"
  />
  <Tag v-else style="border-style: dashed; cursor: pointer" @click="showInput">
    <Icon icon="ant-design:plus-outlined" style="font-size: 10px" />
    新增
  </Tag>
</template>

<script setup lang="ts">
  import { Tag, Input } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  const props = defineProps({ value: propTypes.any });
  const emit = defineEmits(['update:value', 'change']);
  const state = reactive({
    tags: [] as string[],
    inputVisible: false,
    inputValue: '',
  });
  watch(
    () => props.value,
    () => {
      state.tags = props.value?.split('、').filter((item) => item) ?? [];
    },
    { immediate: true }
  );
  function changed() {
    const data = state.tags.join('、');
    emit('update:value', data);
    emit('change', data);
  }
  const inputRef = ref();

  const handleClose = (removedTag: string) => {
    const tags = state.tags.filter((tag) => tag !== removedTag);
    state.tags = tags;
    changed();
  };

  const showInput = () => {
    state.inputVisible = true;
    nextTick(() => {
      inputRef.value.focus();
    });
  };

  const handleInputConfirm = () => {
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    Object.assign(state, {
      tags,
      inputVisible: true,
      inputValue: '',
    });
    changed();
  };
  const handleInputBlur = () => {
    const inputValue = state.inputValue;
    if (!inputValue) {
      Object.assign(state, {
        inputVisible: false,
      });
    }
  };
</script>

<style scoped>
  .ant-tag {
    margin-right: 5px;
    margin-bottom: 5px;
    padding: 0 7px;
  }
</style>
