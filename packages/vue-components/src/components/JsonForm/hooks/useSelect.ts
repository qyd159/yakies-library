import { ref, Ref, watch } from 'vue';
import FormNode from '../FormNode';
export function useSelect(fieldVal: Ref<any>, node: FormNode, values) {
  const selectedField = ref()

  function selectOptions(formElement) {
    if (formElement.type === 'select') {
      return formElement.options?.map((value, key) => {
        return { label: value, value: value }
      })
    }
    if (formElement.type === 'selectfieldset') {
      return formElement.items?.map((item) => {
        return { label: item.title, value: item.key }
      })
    }
    return false
  }

  watch(fieldVal, (val) => {
    node.children.forEach(child => {
      if (val === child.key) {
        child.visible = true;
      } else {
        child.visible = false;
      }
    })
  }, { immediate: true })

  return {
    selectedField,
    selectOptions
  }
}
