<template>
  <div style="float: right;padding: 20px 0;">
    <Button shape="circle" @click="addItem(node)">
      <template #icon>
        <plus-outlined />
      </template>
    </Button> &nbsp;&nbsp;
    <Button shape="circle" @click="delItem(node)">
      <template #icon>
        <minus-outlined />
      </template>
    </Button>
  </div>
  <br class="clear" />
</template>

<script setup lang="ts">
import { Button } from 'ant-design-vue';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { propTypes } from "@/utils/propTypes";
import FormNode from './FormNode';
import { applyArrayPath, setObjKey, getObjKey } from './utils';
import { eventBus } from '@/utils'

const props = defineProps({
  node: propTypes.custom<FormNode>((v) => v instanceof FormNode).isRequired,
  values: propTypes.any
})

function getDefaultValue(schemaElement) {
  let defaultValue = schemaElement.default;
  if (schemaElement.type === 'object') {
    defaultValue = {}
    for (let key in schemaElement.properties) {
      defaultValue[key] = typeof schemaElement.properties[key].default === 'function' ? schemaElement.properties[key].default() : schemaElement.properties[key].default
    }
  }
  return defaultValue;
}

function addItem(node: FormNode) {
  const child = node.insertArrayItem(node.children.length)
  const key = applyArrayPath(child.key, child.arrayPath)
  const value = getDefaultValue(child.schemaElement)
  setObjKey(props.values, key, value)
  eventBus.emit('formUpdate', { key, value })
}

function delItem(node: FormNode) {
  const removedChild = node.deleteArrayItem(node.children.length - 1);
  const key = applyArrayPath(node.key, node.arrayPath)
  const value = getObjKey(props.values, key)
  if (value) {
    value.splice(removedChild!.childPos, 1)
  }
  eventBus.emit('formUpdate', { key, value })
}
</script>

<style scoped>

</style>
