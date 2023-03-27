<script setup>
import Basic from './demo/LottiePlayer/Basic.vue'
</script>
# VLottiePlayer

lottie动画播放器,基于[@lottiefile/lottie-player](https://www.npmjs.com/package/@lottiefiles/lottie-player)  

作为gif的替代品，但提供了类似视频播放器一样的生命周期控制

## Example Usage

Click the buttons to change the count.

<DemoContainer>
  <Basic/>
</DemoContainer>

<<< @/components/demo/LottiePlayer/Basic.vue

## Reference
[lottie-player说明文档](https://docs.lottiefiles.com/lottie-player/components/lottie-player/usage)

### Properties

| Name        | Type     | Default  | Description     |
| ----------- | -------- | -------- | --------------- |
|    source     |  string  |          |       lottie  |

### Events

| Name        | Parameters   | Description     |
| ----------- | ----------   | --------------- |
| complete    |              |  一次动作循环的结束事件          |

### Slots

| Name        | Parameters   | Description     |
| ----------- | ----------   | --------------- |
|             |              |                 |
