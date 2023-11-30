export async function print(data: Record<string,any>,params:Record<string,any>,callFunc:(...args: any) => any) {
  data.loading = true
  try {
    const response: any = await callFunc(
    params,
      { dataKey: 'data', axiosOptions: { responseType: 'blob' }, isReturnNativeResponse: true },
    );
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
      // 创建一个隐藏的iframe元素
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';

    // 将PDF文件URL设置为iframe的src属性
    iframe.src = fileURL;

    // 将iframe添加到文档中
    document.body.appendChild(iframe);

        // 等待一段时间，使PDF文件加载完成
    await new Promise<void>(resolve => setTimeout(function() {
      // 调用iframe的打印方法
      iframe.contentWindow!.print();

      // 移除iframe元素
      // document.body.removeChild(iframe);
      resolve()
    }, 1000)); // 该延迟时间可根据需要进行调整
  } finally {
    data.loading = false
  }

}
