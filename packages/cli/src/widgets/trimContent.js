const fs = require('fs');
const path = require('path');

module.exports = function (args) {
  require('../lib/parseLine')(path.join(process.cwd(), args.f), function (result) {
    let returnVal = '';
    for (let index = 0; index < result.length; index++) {
      returnVal += result[index];
      console.log(result[index]);
    }
    if (args.o) {
      fs.writeFileSync(path.join(process.cwd(), args.o), returnVal)
    } else {
      console.log(returnVal);
    }

  })
}
