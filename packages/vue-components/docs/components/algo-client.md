<script setup>
import Basic from './demo/AlgoClient/Basic.vue'
</script>

# AlgoClient

This is a video component consume a realtime algothme streaming service.


## Prerequisites
* windows10操作系统的电脑主机带一张Nvidia Geforce 2070 GPU和smtc摄像头（暗物之眼）一枚，具体环境配置可以参考[https://wiki.dm-ai.cn/x/FIGVHg](https://wiki.dm-ai.cn/x/FIGVHg)
* 请先运行build/Relase/下的`aea_service.exe`,可以从公司[gitlab](https://gitlab.dm-ai.cn/research-hardware/projects/aea/software/pmh-aea-client/-/tree/dev)克隆下载或者[点击此处](https://pan.dm-ai.com/s/K7z2x68igg7NzHs)(密码:dm123456)下载
* 运行程序
  ```
  ./build/Release/aea_service.exe
  ```

## Example Usage

<DemoContainer>
  <Basic/>
</DemoContainer>

<<< @/components/demo/AlgoClient/Basic.vue
