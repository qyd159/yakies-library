<template>
  <component :is="component" v-if="node.formElement.type === 'checkbox'" :checked="fieldObj"
    @update:checked="setValue" />
  <component :is="component" v-else-if="node.formElement.type === 'select'" :options="selectOptions(node.formElement)"
    :value="fieldObj" @update:value="setValue($event)" />
  <component :is="component" v-else-if="node.formElement.type === 'selectfieldset'"
    :options="selectOptions(node.formElement)" :value="fieldObj" @update:value="setValue($event)" />
  <component :is="component" v-else :value="fieldObj" @update:value="setValue($event)" />
</template>

<script lang="ts">
import { computed, onMounted } from 'vue';
import { componentMap, elementTypes } from './elementTypes';
import { setObjKey, getObjKey } from './utils';
import { propTypes } from "@/utils/propTypes";
import FormNode from './FormNode';
import { applyArrayPath } from './utils';
import { useSelect } from './hooks/useSelect';
import { eventBus } from '@/utils'

export default ({
  name: 'Content',
  props: {
    node: propTypes.custom<FormNode>((v) => v instanceof FormNode).isRequired,
    values: propTypes.any
  },
  setup(props, context) {
    const component = computed(() => {
      const elementType = elementTypes[props.node.formElement.type];
      if (elementType.component) {
        return componentMap[elementType.component]
      } else if (elementType.array) {
        return false
      } else {
        return false
      }
    })

    const key = applyArrayPath(props.node.formElement.key, props.node.arrayPath);

    const fieldObj = computed(() => {
      return getObjKey(props.values, key)
    })


    function setValue(e) {
      setObjKey(props.values, key, e);
      eventBus.emit('formUpdate', { key, value: e })
    }

    const { selectOptions } = useSelect(fieldObj, props.node, props.values)


    onMounted(() => {
    })
    return {
      selectOptions,
      setValue,
      fieldObj,
      component
    }
  }
})


</script>

<style scoped>

</style>
