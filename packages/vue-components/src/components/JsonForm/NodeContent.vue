<template>
  <FormItem :label="node.formElement.title"
    v-if="node.formElement && !noRenderNodeTypes.includes(node.formElement.type)"
    :colon="node.formElement.type !== 'array'">
    <Content :node="node" v-if="node.formElement && node.formElement.key" :values="values" />
  </FormItem>
  <TreeNode v-for="child in node.children" :node="child" :key="child.id" :tree="tree" :values="values"/>
  <Operations :node="node" v-if="node.formElement && node.formElement.type === 'array'" :values="values"/>
</template>

<script setup lang="ts">
import { propTypes } from "@/utils/propTypes";
import FormTree from './FormTree';
import FormNode from './FormNode';
import TreeNode from './Node.vue';
import { FormItem } from 'ant-design-vue';
import Operations from './Operations.vue';
import Content from './Content.vue';

const noRenderNodeTypes = ['fieldset', 'array', 'link']

const props = defineProps({
  tree: propTypes.custom<FormTree>((v) => v instanceof FormTree).isRequired,
  node: propTypes.custom<FormNode>((v) => v instanceof FormNode).isRequired,
  values: propTypes.any
})

</script>

<style scoped>

</style>
