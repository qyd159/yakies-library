import { ref } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';

export const useUploadFile = () => {
  // 文件列表
  const uploading = ref<boolean>(false);
  const fileList: any = ref([]);
  const fileInfo: any = ref({
    // 表头
    headersKey: [],
    // 表数据
    excelData: [],
    files: [],
  });
  function formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm)).toString()} ${sizes[i]}`;
  }
  // //表头
  // 上传时间拦截
  const beforeUpload = (
    file: File,
    { fileTypes, extname, limitSize } = {
      fileTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
      ],
      extname: '.xsl .xlsx .csv',
      limitSize: 1024 * 1024 * 1000,
    },
  ): Promise<File> => {
    const fileType = file.type;
    // fileType为空，表示浏览器无法识别文件类型
    const isCorrectFile = fileTypes.includes(fileType) || !fileType;
    return new Promise((resolve, reject) => {
      if (!isCorrectFile) {
        message.error(`只支持扩展名为${extname}的文件`);
        reject(file);
        return;
      }
      const isLt50M = file.size < limitSize;
      if (!isLt50M) {
        message.error(`文件大小不得超过${formatBytes(limitSize)}`);
        reject();
        return;
      }
      if (uploading.value) {
        reject(file);
        return;
      }
      resolve(file);
    });
  };

  const handleRemove = () => {
    fileList.value = [];
  };

  const handleReject = (extname = '.xsl .xlsx .csv') => {
    message.error(`只支持扩展名为${extname}的文件`);
  };

  async function customUpload(e: any, uploadFunc: any) {
    const { file } = e;
    // 上传接口  e.file 就是接口所用的 file
    const onUploadProgress = (ev: any) => {
      // ev - axios 上传进度实例，上传过程触发多次
      // ev.loaded 当前已上传内容的大小，ev.total - 本次上传请求内容总大小
      const percent = (ev.loaded / ev.total) * 100;
      // 计算出上传进度，调用组件进度条方法
      e.onProgress({ percent });
    };
    try {
      uploading.value = true;
      const data = await uploadFunc(
        {
          file,
        },
        onUploadProgress,
      );
      e.onSuccess(data?.data, e);
    } catch (err) {
      e.onError(err);
    } finally {
      uploading.value = false;
    }
  }

  const handleChange = (info: UploadChangeParam) => {
    const { file } = info;
    const { status } = file;
    if (status === 'done') {
      // message.success('上传成功');
      fileList.value = info.fileList;
    } else if (status === 'error') {
      console.log(file.error);
      // message.error(`上传失败`);
    } else {
      fileList.value = info.fileList;
    }
  };

  return {
    fileInfo,
    fileList,
    uploading,
    handleRemove,
    beforeUpload,
    handleReject,
    handleChange,
    customUpload,
  };
};
