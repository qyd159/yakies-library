<template>
  <svg
    :class="[prefixCls, $attrs.class, spin && 'svg-icon-spin']"
    :style="getStyle"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts">
import type { CSSProperties } from "vue";
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "SvgIcon",
  props: {
    prefix: {
      type: String,
      default: "icon",
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 16,
    },
    spin: {
      type: Boolean,
      default: false,
    },
    prefixCls: {
      type: String,
      default: "xxxx",
    },
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`);

    const getStyle = computed(
      (): CSSProperties => {
        const { size } = props;
        let s = `${size}`.split(",");
        s = s.length > 1 ? [s[0], s[1]] : [s[0], s[0]];
        return {
          width: s[0] + "px",
          height: s[1] + "px",
        };
      }
    );
    return { symbolId, getStyle };
  },
});
</script>
<style lang="less" scoped>
@prefix-cls: ~"aea-svg-icon";

.@{prefix-cls} {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
  cursor: pointer;
}

.svg-icon-spin {
  animation: loadingCircle 1s infinite linear;
}
</style>
