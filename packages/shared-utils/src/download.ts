
export async function downloadFile(params:Record<string,any> , docType: 'doc'|'pdf', callFunc: (...args: any) => any) {
  const response: any = await callFunc(
    params,
    { dataKey: 'data', axiosOptions: { responseType: 'blob' }, isReturnNativeResponse: true },
  );

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'downloaded.doc'; // 默认的文件名
  // 尝试从 content-disposition 响应头获取文件名
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename=(.+)/);
    if (fileNameMatch.length === 2) filename = decodeURI(fileNameMatch[1]);
  }
  link.setAttribute('download', filename); // 设置文件名
  document.body.appendChild(link);

  link.click(); // 触发下载操作
}

