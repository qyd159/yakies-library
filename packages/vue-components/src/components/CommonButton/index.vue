<template>
  <div class="common-button" :class="{
    'button-major-large': type === 'major' && size === 'large',
    'button-major-small': type === 'major' && size === 'small',
    'button-minor-large': type === 'minor' && size === 'large',
    'button-minor-small': type === 'minor' && size === 'small',
  }">
    <div class="button-content" :class="{
      'button-disalbed': disabled,
    }" @click="handleClick">
      <ClientOnly>
        <LottiePlayer v-show="loading" class="button-loading" :source="loadingUri" loop />
      </ClientOnly>
      {{ text }}
      <!-- <Button
      type="primary"
      size="large"
      block
      :loading="loading"
      :disabled="disabled"
    >
      {{ text }}
    </Button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "ant-design-vue";
import LottiePlayer from "@/components/VLottiePlayer/index.vue";
const loadingUri = new URL("./loading.json", import.meta.url).href;
const emit = defineEmits(["onClick"]);
const props = defineProps({
  type: {
    type: String,
    default: "major",
    validator(value: string) {
      return ["major", "minor"].includes(value);
    },
  },
  text: {
    type: String,
    default: "确定",
  },
  size: {
    type: String,
    default: "large",
    validator(value: string) {
      return ["large", "small"].includes(value);
    },
  },
  onClick: {
    type: Function,
    default: () => { },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const handleClick = () => {
  if (props.disabled) return;
  emit("onClick");
};
</script>

<style lang="less" scoped>
.button-content {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  cursor: pointer;
  position: relative;
}

.button-loading {
  position: absolute;
  left: 20px;
  width: 40px;
  height: 40px;
}

.button-major-large {
  width: 346px;
  height: 90px;
  line-height: 90px;
  font-size: 28px;

  .button-content {
    background: url(@/assets/images/button-major-normal.png) 0 0 / cover no-repeat;

    &:active {
      background: url(@/assets/images/button-major-active.png) 0 0 / cover no-repeat;
    }
  }

  .button-disalbed,
  .button-disalbed:active {
    background: url(@/assets/images/button-major-disabled.png) 0 0 / cover no-repeat;
  }
}

.button-major-small {
  width: 200px;
  height: 60px;
  line-height: 60px;
  font-size: 24px;

  .button-content {
    background: url(@/assets/images/button-major-small-normal.png) 0 0 / cover no-repeat;

    &:active {
      background: url(@/assets/images/button-major-small-active.png) 0 0 / cover no-repeat;
    }
  }

  .button-disalbed,
  .button-disalbed:active {
    background: url(@/assets/images/button-major-small-disabled.png) 0 0 / cover no-repeat;
  }
}

.button-minor-large {
  width: 346px;
  height: 90px;
  line-height: 90px;
  font-size: 28px;

  .button-content {
    background: url(@/assets/images/button-minor-normal.png) 0 0 / cover no-repeat;

    &:active {
      background: url(@/assets/images/button-minor-active.png) 0 0 / cover no-repeat;
    }
  }

  .button-disalbed,
  .button-disalbed:active {
    background: url(@/assets/images/button-minor-disabled.png) 0 0 / cover no-repeat;
  }
}

.button-minor-small {
  width: 200px;
  height: 60px;
  line-height: 60px;
  font-size: 24px;

  .button-content {
    background: url(@/assets/images/button-minor-small-normal.png) 0 0 / cover no-repeat;

    &:active {
      background: url(@/assets/images/button-minor-small-active.png) 0 0 / cover no-repeat;
    }
  }

  .button-disalbed,
  .button-disalbed:active {
    background: url(@/assets/images/button-minor-small-disabled.png) 0 0 / cover no-repeat;
  }
}
</style>
