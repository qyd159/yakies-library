const _ = require('../lib/util');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const inquirer = require('inquirer');

module.exports = async function (args) {
  let operation = await inquirer.prompt({
    type: 'list',
    message: '何种操作？',
    choices: ['创建工程', '更新xcode工程'],
    name: 'type'
  });

  if (operation.type === '创建工程') {
    if (fs.existsSync(path.join(process.cwd(), args.name))) {
      let confirm = await inquirer.prompt({
        type: 'confirm',
        message: '目录已存在，确实要删除目录：' + path.join(process.cwd(), args.name) + '?',
        name: 'rmOrNo'
      });
      confirm.rmOrNo && rimraf.sync(path.join(process.cwd(), args.name));
    }
    var spawn_server = require('child_process').spawn('cordova', ['create', args.name, 'com.test.' + args.name, args.name, '--link-to=../assets/' + args.name], {
      cwd: process.cwd()
    });
    spawn_server.on('close', function (code) {
      rimraf(path.join(process.cwd(), args.name, 'www'), function (err) {
        if (err) {
          console.log(err);
          return;
        }
        fs.symlink(path.join(process.cwd(), '..', 'assets', args.name), path.join('./' + args.name, 'www'), 'dir', function (err) {
          if (err) {
            console.log(err);
            return;
          }
          console.log('创建成功！')
          var build_Proc = require('child_process').exec('cordova platform rm ios && cordova platform add ios', {
            cwd: path.join(process.cwd(), args.name)
          });
          build_Proc.on('close', function (code) {
            console.log('成功生成xcode工程');
            require('child_process').exec('open '+ args.name + '.xcodeproj', {
              cwd: path.join(process.cwd(), args.name, 'platforms/ios')
            });
          })
        })
      })
    });
  }else {
    var build_Proc = require('child_process').exec('cordova platform rm ios && cordova platform add ios', {
        cwd: path.join(process.cwd(),args.name)
      });
      build_Proc.on('close', function (code) {
          console.log('成功更新xcode工程');
          require('child_process').exec('open ' + args.name + '.xcodeproj', {
            cwd: path.join(process.cwd(), args.name, 'platforms/ios')
          });
      })
  }
}
