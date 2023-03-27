<script setup>
import Basic from './demo/Realtime/Basic.vue'
</script>
# Realtime
实时图像显示组件

## Prerequisites
* windows10操作系统的电脑主机带一张Nvidia Geforce 2070 GPU和smtc摄像头（暗物之眼）一枚，具体环境配置可以参考[https://wiki.dm-ai.cn/x/FIGVHg](https://wiki.dm-ai.cn/x/FIGVHg)
* 安装nodejs环境，建议使用lts版本
* clone [源代码](https://gitlab.dm-ai.cn/huangkaiyue/node_video_api/-/tree/algo-provider)，注意是algo-provider分支，运行如下命令：
```
npm i
node example.js
```

## Example Usage
<DemoContainer>
  <Basic/>
</DemoContainer>

<<< @/components/demo/Realtime/Basic.vue