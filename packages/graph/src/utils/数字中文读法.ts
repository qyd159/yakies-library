const unit: string[] = ['', '十', '百', '千'];
const segmentUnit: string[] = ['', '万', '亿', '万亿', '亿亿'];
const num: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

// https://blog.csdn.net/ww694303720/article/details/47167595 将java代码转换为javascript代码
export function numberToChNumber(numberm: number) {
  let str = '';
  const numChar = numberm
    .toString()
    .split('')
    .reverse()
    .map((num) => num.charCodeAt(0));
  let segment = (numChar.length - 1) / 4 + 1;
  for (let segmentIndex = 1; segmentIndex <= segment; segmentIndex++) {
    str = segmentUnit[segmentIndex - 1] + str;
    let start = (segmentIndex - 1) * 4;
    for (let j = 0; j <= 3; j++) {
      let index = start + j;
      if (index < numChar.length) {
        if (numChar[index] == 48 && index == start) {
          continue;
        } else if (numChar[index] == 48 && numChar[index - 1] == 48) {
          continue;
        } else if (numChar[index] == 48 && numChar[index - 1] != 48) {
          str = num[numChar[index] - 48] + str;
        } else {
          str = num[numChar[index] - 48] + unit[j] + str;
        }
      }
    }
  }
  return str;
}
