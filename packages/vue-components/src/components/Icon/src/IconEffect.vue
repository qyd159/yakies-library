<template>
  <Icon
    :icon="getIcon"
    :size="size"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
    style="cursor: pointer;"
  ></Icon>
</template>
<script lang="ts" setup>
import { ref, computed, ComputedRef } from "vue";
import Icon from "./Icon.vue";
import { propTypes } from "@/utils/propTypes";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  highlight: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "iconify",
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  actived: {
    type: Boolean,
    default: false,
  },
  // icon color
  color: propTypes.string,
  spin: propTypes.bool.def(false),
  prefix: propTypes.string.def(""),
});

const getIcon = computed(() => {
  const suffix = props.type === "iconify" ? "" : "|" + props.type;
  return (isHovering.value || props.actived ? props.highlight : props.name) + suffix;
}) as ComputedRef<string>;

const isHovering = ref(false);
const hasHighlight = !!props.highlight;

function mouseEnter(e) {
  hasHighlight && (isHovering.value = true);
}
function mouseLeave(e) {
  hasHighlight && (isHovering.value = false);
}
</script>
