const path = require('path');

const exec = async args => {
  const data = require(path.join(process.cwd(), args.f)).data.data;
  if (!Array.isArray(data)) {
    console.error('必须是数组');
    return;
  }
  for (const item of data) {
    console.log(item.model + ',');
  }
};
module.exports = exec;
