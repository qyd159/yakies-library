const pm2 = require('pm2');
const crypto = require('crypto');
let settings = require('../conf/settings');

const md5 = function(data, len) {
  var md5sum = crypto.createHash('md5'),
    encoding = typeof data === 'string' ? 'utf8' : 'binary';
  md5sum.update(data, encoding);
  return md5sum.digest('hex').substring(0, len);
};

pm2.launchBus(function(err, bus) {
  bus.on('process:msg', function(packet) {
    // console.log(packet.toString(),'xxxxxxx');
  });
});

process.on('message', function(packet) {
  console.log(packet.toString());
});

console.log(new Date().toLocaleString()+'开始处理');

var execYA = async (command,list,debug) => {
  for (let i = 0; i < list.length; i++) {
    const listElement = list[i];
    let args = [command,listElement]
    debug&&(args = args.concat(['--debugMode']));
    await new Promise(function(resolve){
      pm2.start({
        name:'ya-'+ md5(listElement,7),
        script: 'ya',
        args:args
      }, (err, apps) => {
        if (err) {
          console.log(err);
        }
        setTimeout(function(){
          resolve();
        },10000);
      })
    })
  }
}

module.exports = function (argv) {
  require('./getPortFromArray').port3(function () {
    if(argv.debugMode){
      const inspector = require('inspector');
      inspector.open(settings.debugPort,'127.0.0.1',true);
      debugger;
    }
    pm2.connect(true,function (err) {
      if (err) {
        console.error(err);
        process.exit(2)
      }

      execYA(argv._[0],argv._.slice(1),argv.debugMode).then(function(err){
        console.log('执行成功');
      });

      process.on('exit',function(){
        pm2.disconnect();
      });
    })
  })
};
