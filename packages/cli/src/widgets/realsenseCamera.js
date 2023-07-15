const rs2 = require('@cza_li/node-librealsense');
// 创建一个pipeline实例，它会管理RealSense设备的生命周期
const pipeline = new rs2.Pipeline();
// 开始从设备采集数据
pipeline.start();
setInterval(() => {
    // 检查是否有新的帧
    const frameset = pipeline.waitForFrames();
    const depthFrame = frameset.depthFrame;
    const colorFrame = frameset.colorFrame;
    if (!depthFrame || !colorFrame) {
        return;
    }
    console.log(`Depth frame: width = ${depthFrame.width}, height = ${depthFrame.height}`);
    console.log(`Color frame: width = ${colorFrame.width}, height = ${colorFrame.height}`);
    // 这里可以添加更多处理逻辑...
}, 1000);  // 每秒检查一次
// 在程序结束时停止pipeline并释放资源
process.on('SIGINT', () => {
    pipeline.stop();
    pipeline.destroy();
    rs2.cleanup();
});
