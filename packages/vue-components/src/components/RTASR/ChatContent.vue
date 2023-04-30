<template>
  <div class="message-container" :style="{ maxHeight }">
    <div class="user-talk-item" v-if="message.type === 'user'">
      <span>{{ message.content }}</span>
    </div>
    <div class="ai-talk ai-talk-item" :class="liveStreaming ? 'live-stream' : ''" v-if="message.type === 'ai'" :style="aiItemStyle">
      <div v-for="(item, index) in message.content" :key="index">
        {{ item.content }}
      </div>
      <div class="bottom-mask" :class="{ 'show-all-mask': showAll }" @click="toggleShowAll" v-if="showMask">
        {{ showAll ? '收起' : '查看全文' }}
        <a-icon type="double-right" :class="{ 'show-all': showAll }" />
      </div>
    </div>
    <div class="ai-tips ai-talk-item" v-if="message.type === 'ai-tips'" :style="aiItemStyle">
      <div v-if="!message.inquiry">
        <div class="flex-wrap">
          <span class="indent"></span>
          {{ message.title }}
        </div>
        <div style="margin-top: 5px" class="tips-list clear-fix">
          <div class="tips-list-item" :show-arrow="false" v-for="(item, index) in message.qsList" :key="index" @click="$emit('talkToAI', item)">
            <div class="tag-div overflow-ellipse-text" :title="item">{{ item }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <div>
          <span>{{ message.content }}</span>
        </div>
      </div>
    </div>
    <div class="user-voice-item" v-if="message.type === 'user-voice'">
      <Audio
        style="background-color: transparent; margin: 0 0; color: #fff; padding: 0 0"
        :src="message.voice"
        type="question"
        @toggle-text="toggleText"
        :showTranslateIcon="!!message.content"
        :translated="showText ? message.content : ''"
      />
      <a-divider v-if="message.content && showText" style="margin: 0 -20px; width: calc(100% + 40px)" />
      <p style="color: #fff; padding: 18px 0; margin: 0 0" v-if="message.content && showText">{{ message.content }}</p>
    </div>
    <div class="ai-voice-item" v-if="message.type === 'ai-voice'">
      <Audio
        style="background-color: transparent; margin: 0 0; color: #406eff; padding: 0 0"
        :src="message.voice"
        type="answer"
        @toggle-text="toggleText"
        :autoPlay="true"
        :showTranslateIcon="!!message.content"
        :translated="showText ? message.content : ''"
      />
      <a-divider style="margin: 0 -20px; width: calc(100% + 40px)" v-if="message.content && showText" />
      <div :style="message.content && showText ? { padding: '10px 0' } : {}">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import Audio from './Audio.vue';
  import { propTypes } from '@/utils/propTypes';

  defineProps({
    message: propTypes.any,
  });

  const showText = ref(false);
  const maxHeight = ref('none');
  const showAll = ref(false);
  const showMask = ref(false);
  const liveStreaming = ref(false);
  const aiItemStyle = computed(() => {
    if (unref(showMask)) {
      return {
        padding: '12px 20px 46px 20px',
      };
    }
    return {
      padding: '12px 20px',
    };
  });

  function toggleText() {
    showText.value = !unref(showText);
  }
  function toggleShowAll() {
    if (unref(showAll)) {
      maxHeight.value = 607 * 0.85 + 'px';
    } else {
      maxHeight.value = 'none';
    }
    showAll.value = !unref(showAll);
  }
</script>
<style lang="less" scoped>
  @primary-color: #fff;
  .user-talk-item {
    padding: 12px 20px;
    margin: 15px 15px 15px 70px;
    float: right;
    font-size: 16px;
    border-bottom-right-radius: 0;
    min-width: 25%;
    background: @primary-color;
    border-radius: 24px 1px 20px 20px;
    color: #ffffff;
  }
  .user-voice-item {
    padding: 0 15px 0 20px;
    margin: 15px 15px 15px 70px;
    float: right;
    font-size: 16px;
    border-radius: 24px 1px 20px 20px;
    background: linear-gradient(90deg, #fd991b 0, #fd4608) !important;
  }
  .message-container {
    zoom: 1;
    overflow: hidden;
    position: relative;
    p {
      margin-top: 1em;
    }
  }
  .message-container:after {
    content: '';
    display: block;
    clear: both;
  }

  .ai-talk-item {
    background-color: #fff;
    border-radius: 15px;
    margin: 15px 70px 15px 15px;
    /* font-size: 16px; */
    &.live-stream {
      margin-right: 15px;
    }
  }

  .ai-voice-item {
    background-color: RGBA(236, 248, 255, 1);
    border-radius: 15px;
    margin: 15px 70px 15px 15px;
    padding: 0 20px;
    font-size: 16px;
    float: left;
    &.live-stream {
      margin-right: 15px;
    }
  }

  .ai-talk {
    border-top-left-radius: 0;
  }
  .bottom-mask {
    position: absolute;
    bottom: 0px;
    width: calc(100% - 85px);
    left: 15px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(248, 252, 255, 0.39) 26%, rgba(236, 248, 255, 1) 100%);
    height: 46px;
    line-height: 46px;
    text-align: center;
    cursor: pointer;
    color: @primary-color;
    &.show-all-mask {
      bottom: 15px;
    }
    > .anticon {
      transform: rotate(90deg);
    }
    > .anticon.show-all {
      transform: rotate(270deg);
    }
  }
  .indent {
    display: inline-block;
    margin-right: 6px;
    width: 4px;
    height: 16px;
    background: @primary-color;
    border-radius: 2px;
  }
  .flex-wrap {
    display: flex;
    align-items: center;
    color: rgba(156, 167, 181, 1);
  }
  .tips-list-item {
    color: @primary-color;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px dashed #cccccc;
    cursor: pointer;
    &:last-child {
      border: none;
    }
  }
</style>
