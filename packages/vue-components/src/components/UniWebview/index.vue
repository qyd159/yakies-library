<template>
    <div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import './UniWebview'
import {eventBus} from '@/utils'

document.addEventListener('UniAppJSBridgeReady', function() {
    uni.webView.getEnv(function(res) {
    console.log('当前环境：' + JSON.stringify(res));
    });
    // uni.webView.navigateTo(...)
});

window.msgFromUniapp = function (data) { 
    eventBus.emit('msgFromUniapp', data)
}
export default defineComponent({
    setup () {
        return {}
    }
})
</script>

<style scoped>

</style>