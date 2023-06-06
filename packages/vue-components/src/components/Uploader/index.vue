<template>
  <Upload
    :custom-request="(e) => (auto ? customUpload(e, uploadFunc) : uploadFunc?.(e))"
    class="upload_box"
    :class="ghost?'ghost-uploader':''"
    list-type="picture"
    :disabled="uploading || disabled"
    name="file"
    :max-count="1"
    :file-list="fileList"
    :show-upload-list="!ghost"
    @remove="handleRemove"
    :before-upload="
      (file) => (auto ? beforeUpload(file, { extname, fileTypes, limitSize }) : false)
    "
    :accept="accept"
    v-bind="$attrs"
    @reject="() => handleReject(extname)"
    @change="handleChange"
    ref="uploader"
  >
    <slot>
      <p class="ant-upload-drag-icon">
        <LoadingOutlined v-if="uploading" />
        <InboxOutlined v-else />
      </p>
      <p class="ant-upload-text">
        点击或将文件拖拽到这里上传
      </p>
      <p class="ant-upload-hint">
        支持扩展名{{ extname }}
      </p>
      <p class="ant-upload-hint">
        &nbsp;
      </p>
    </slot>
  </Upload>
</template>

<script setup lang="ts">
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import Upload from 'ant-design-vue/es/upload/Upload';
import { useUploadFile } from './useUploadFile';
import { propTypes } from '../../utils/propTypes';

const props = defineProps({
  uploadFunc: propTypes.func,
  value: propTypes.any,
  fileTypes: propTypes.any.def([
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
  ]),
  extname: propTypes.string.def('.csv .xslx .xls'),
  extraDesc: propTypes.string.def(''),
  disabled: propTypes.bool.def(false),
  auto: propTypes.bool.def(true),
  savedFileList: propTypes.array.def([]),
  limitSize: propTypes.number.def(1024 * 1024 * 1000),
  ghost: propTypes.bool.def(false),
  accept: propTypes.string.def('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv'),
});
const emit = defineEmits(['update:value', 'change']);
// 上传文件
const {
  fileList,
  uploading,
  handleRemove,
  beforeUpload,
  handleReject,
  customUpload,
  handleChange,
} = useUploadFile();
watch(
  fileList,
  () => {
    emit('update:value', unref(fileList)?.[0]);
    emit('change', unref(fileList)?.[0]);
  },
  { immediate: true },
);
watch(
  () => props.savedFileList,
  () => {
    fileList.value = props.savedFileList.filter((file: any) => file.name);
  },
  { immediate: true },
);

const uploader = ref();

defineExpose({
  async validate(file: File) {
    return await beforeUpload(file, {
      extname: props.extname,
      fileTypes: props.fileTypes,
      limitSize: props.limitSize,
    });
  },
  onProgress(e: any, file: File) {
    console.log(e)
    unref(uploader).onProgress?.({percent: Math.round(e.loaded * 100 / e.total) }, file);
  },
});
</script>
<style scoped lang="less">
  .file-upload-item {
    border: 1px solid #303030;
    height: 48px;
    margin: 10px 0;
  }
  :deep(.ghost-uploader .ant-upload-btn) {
        padding: 0 0 !important;
  }
</style>
