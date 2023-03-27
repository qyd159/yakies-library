<template>
  <Modal
    v-model:visible="visible"
    :footer="null"
    centered
    :closable="false"
    :zIndex="10000"
    :width="860"
    :maskClosable="false"
    :bodyStyle="{ backgroundColor: '#f8f1e5', borderRadius: '4px', padding: '0' }"
  >
    <div class="content">
      <div class="title-wrap flex items-center">
        <img src="@/assets/images/error.png" alt="" />
        <span class="title">确定要离开吗?</span>
      </div>

      <div class="btn-wrap flex justify-end">
        <CommonButton
          type="minor"
          size="small"
          text="取消"
          @onClick="handleCancel"
          class="btn-cancel"
        />
        <CommonButton type="major" size="small" text="确定" @onClick="handleOk" />
        <!-- <Button key="back" class="btn btn-cancel" @click="handleCancel">取消</Button>
        <Button key="submit" type="primary" class="btn" @click="handleOk">确定</Button> -->
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { Modal, Button } from "ant-design-vue";
import CommonButton from "@/components/CommonButton/index.vue";
const emit = defineEmits(["cancel", "ok"]);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const visible = ref(false);
watch(
  () => props.show,
  (show) => {
    visible.value = show;
  }
);
const handleCancel = () => {
  emit("cancel");
};
const handleOk = async () => {
  emit("ok");
};
</script>
<style lang="less" scoped>
.content {
  padding: 60px 40px 40px 60px;
  background: #f8f1e5;
  .title-wrap {
    margin-bottom: 120px;
  }
  .title {
    margin-left: 40px;
    font-size: 40px;
    line-height: 40px;
    color: #512f1f;
  }
  .btn {
    width: 160px;
    height: 60px;
    font-size: 24px;
  }

  .btn-cancel {
    margin-right: 20px;
  }
}
</style>
