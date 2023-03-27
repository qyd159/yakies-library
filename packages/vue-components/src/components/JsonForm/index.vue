<template>
  <Form v-bind="formItemLayout" ref="form">
    <Node :tree="formTree" :node="formTree.root" v-if="formTree" :values="formValues" />
  </Form>
</template>

<script setup lang="ts">
import { ref, onMounted, toRaw, watch, onUnmounted } from 'vue';
import Node from './Node.vue';
import FormTree from './FormTree';
import { propTypes } from '@/utils/propTypes';
import { Form } from 'ant-design-vue';
import { cloneDeep } from 'lodash';
import { eventBus } from '@/utils'

const props = defineProps({
  data: propTypes.any.def(() => { }),
});

const emit = defineEmits(['update'])

const form = ref()

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const formTree = ref();

const formValues = ref();

watch(props, () => {
  const { schema, form, skipedFields, values } = cloneDeep(props.data);
  formValues.value = values
  formTree.value = new FormTree(form.value);
  formTree.value.initialize({
    schema,
    form: [
      ...form,
      '*'],
    skipedFields,
    value: values
  })
})

function formUpdateHandle({ key, value }) {
  emit('update', { key, value })
}

onMounted(() => {
  eventBus.on('formUpdate', formUpdateHandle)
})
onUnmounted(() => {
  eventBus.off('formUpdate', formUpdateHandle)
})
defineExpose({
  formValues
})
</script>

<style scoped>

</style>
