<template>
  <div class="node-container">
    <span class="indent"></span>
    <div class="node-content" :style="calcStyle">
      <Collapse v-if="node.formElement && collapsableTypes.includes(node.formElement.type) " style="margin:5px 5px;"
        v-show="node.visible">
        <CollapsePanel :header="node.formElement && node.formElement.title">
          <NodeContent :node="node" :values="values" />
        </CollapsePanel>
      </Collapse>
      <NodeContent :node="node" v-else :values="values" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { propTypes } from "@/utils/propTypes";
import FormTree from './FormTree';
import FormNode from './FormNode';
import NodeContent from './NodeContent.vue';
import { Collapse, CollapsePanel } from 'ant-design-vue'

const props = defineProps({
  tree: propTypes.custom<FormTree>((v) => v instanceof FormTree),
  node: propTypes.custom<FormNode>((v) => v instanceof FormNode),
  values: propTypes.any
})

const collapsableTypes = ['fieldset', 'array']

const calcStyle = computed(() => {
  return props.node.schemaElement && props.node.schemaElement.hidden ? { display: 'none' } : {}
})

</script>
<script lang="ts">
export default {
  name: 'TreeNode'
}
</script>

<style scoped lang="less">
.node-container {
  display: flex;

  .indent {
    width: 20px;
  }

  .node-content {
    flex: 1;
  }
}
</style>
