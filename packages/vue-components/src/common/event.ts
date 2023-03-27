/*
 * @Author: qinyadong
 * @Date: 2022-01-05 18:52:49
 * @LastEditTime: 2022-05-23 18:27:19
 * @LastEditors: qinyadong
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \aea-client\src\common\constant\biz\event.ts
 */
/** 开始发送人脸模块测评视频流，由渲染进程触发 */
export const MODULE_FACE_START = '@moduleFace/start';
/** 停止接口人脸模块测评视频流，由渲染进程触发 */
export const MODULE_FACE_STOP = '@moduleFace/stop';
/** 发送人脸模块测评视频流，由主进程发送给渲染进程 */
export const MODULE_FACE_FRAME = '@moduleFace/frame';
/** 发送和接收人脸模块识别结果，由渲染进程发起 */
export const MODULE_FACE_RESULT = '@moduleFace/result';
// 人脸模块实时视频流
export const MODULE_FACE_REAL_VIDEO = '@moduleFace/real_video';
// 人脸模块实时音频流
export const MODULE_FACE_REAL_AUDIO = '@moduleFace/real_audio';
// 人脸模块实时算法数据
export const MODULE_FACE_REAL_DATA = '@moduleFace/real_data';
// 人脸模块抓拍jgeg
export const MODULE_FACE_CAPTURE = '@moduleFace/capture';

// 站位绑定
export const MODULE_FACE_BIND = '@moduleFace/bind'

/** 开始发送A模块测评视频流，由渲染进程触发 */
export const MODULE_A_START = '@moduleA/start';
/** 停止接口A模块测评视频流，由渲染进程触发 */
export const MODULE_A_STOP = '@moduleA/stop';
/** 发送A模块测评视频流，由主进程发送给渲染进程 */
export const MODULE_A_FRAME = '@moduleA/frame';
/** 发送和接收A模块测评算法轨迹、骨骼数据，主进程和渲染进程双向通信，由渲染进程发起 */
export const MODULE_A_RESULT = '@moduleA/result';
// A模块实时视频流
export const MODULE_A_REAL_VIDEO = '@moduleA/real_frame';
// A模块实时音频流
export const MODULE_A_REAL_AUDIO = '@moduleA/real_audio';
// A模块实时算法数据
export const MODULE_A_REAL_DATA = '@moduleA/real_data';
// A模块回放
export const MODULE_A_PLAYBACK = '@moduleA/playback';
// A模块动作评分，包含最佳动作
export const MODULE_A_ACTION_SCORE = '@moduleA/action_score';

/** 开始发送B模块测评视频流，由渲染进程触发 */
export const MODULE_B_START = '@moduleB/start';
/** 停止接口B模块测评视频流，由渲染进程触发 */
export const MODULE_B_STOP = '@moduleB/stop';
/** 发送B模块测评视频流，由主进程发送给渲染进程 */
export const MODULE_B_FRAME = '@moduleB/frame';
/** 发送和接收B模块测评拉班图数据，主进程和渲染进程双向通信，由渲染进程发起 */
export const MODULE_B_RESULT = '@moduleB/result';
// B模块实时视频流
export const MODULE_B_REAL_VIDEO = '@moduleB/real_video';
// B模块实时视音频流
export const MODULE_B_REAL_AUDIO = '@moduleB/real_audio';
// B模块实时算法数据
export const MODULE_B_REAL_DATA = '@moduleB/real_data';

// 获取测评本地mp4文件路径
export const PLAYBACK_FILEPAH = 'playback_filepath';
// 获取第一帧
export const PLAYBACK_FRAME = 'playback_frame';
export const CAMERAS = 'cameras';

export const SKELETON_DATA = 'skeletonData';
export const LABAN_DATA = 'labanData';

// B模块胸牌初始化
export const MODULE_B_RECORD_DEVICES_INIT = '@moduleB/record_devices_init';
// B模块获取胸牌
export const MODULE_B_RECORD_DEVICES_ACQUIRE =
  '@moduleB/record_devices_acquire';
// B模块回收胸牌
export const MODULE_B_RECORD_DEVICES_RECYCLE =
  '@moduleB/record_devices_recycle';
// B模块录音完成
export const MODULE_B_RECORD_FILE_ACQUIRE = '@moduleB/record_file_acquire';

/** 设置RTSP地址 */
export const SET_RTSP = 'set_rtsp';

/** 获取测试视频地址 **/
export const TEST_VIDEOS = 'test_videos';

/** 获取文件内容 */
export const READ_FILE = 'read_file';

// 以下是ipc通信事件
export const IPC_ALGO_CREATE = 'ipc_algo_create';
export const IPC_ALGO_STOP = 'ipc_algo_stop';
export const IPC_ALGO_CAPTURE = 'ipc_algo_capture';
export const IPC_ALGO_CACHE_PATH = 'ipc_algo_cache_path';
export const IPC_ALGO_SPLINE_ACTION_PATH = 'ipc_algo_spline_action_path';
