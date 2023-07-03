import XLSX from 'xlsx';
import path from 'path';

function parseToTree(data, dirNames, index = 0, tree = {}) {
  const dirName = dirNames[index];
  data.forEach((item) => {
    if (item[dirName]) {
      if (!tree[item[dirName]]) {
        tree[item[dirName]] = {};
      }
      if (index + 1 < dirNames.length) {
        tree[item[dirName]] = {
          ...tree[item[dirName]],
          ...parseToTree([item], dirNames, index + 1, tree[item[dirName]]),
        };
      }
    }
  });
  return tree;
}

export default function (args) {
  // 读取Excel文件
  const workbook = XLSX.readFile(path.join(process.cwd(), args.f));

  // 获取工作表的名字列表，通常情况下，一个Excel文件有多个工作表
  const sheetNames = workbook.SheetNames;

  // 使用第一个工作表的名字来获取工作表
  const worksheet = workbook.Sheets[sheetNames[1]];

  // 将工作表转换为JSON
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  for (const item of jsonData) {
    delete item['一级目录'];
    delete item['二级目录'];
    delete item['三级目录'];
    // delete item['四级目录'];
  }

  console.log(JSON.stringify(jsonData));

  // const columns1 = ['一级目录', '二级目录', '三级目录', '四级目录'];
  // const columns2 = ['四级目录', '职能组织', '适用场景', '任务卡', '参数变量'];
  // // console.log(JSON.stringify(parseToTree(jsonData, columns1), null, 4));

  // function convertToTree(node, parent = null) {
  //   return Object.entries(node).map(([key, value]) => ({
  //     title: key,
  //     key: key,
  //     parent,
  //     children: convertToTree(value, key),
  //   }));
  // }

  // console.log(JSON.stringify(convertToTree(parseToTree(jsonData, columns2))));
}
