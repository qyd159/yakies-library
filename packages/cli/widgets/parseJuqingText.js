const _ = require('../lib/util');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

let talks = {};

const renwu = {
  "1": "鱼幼薇",
  "2": "南宫仆射",
  "3": "扛旗将军",
  "4": "李羡阳",
  "5": "武媚娘-猫",
  "6": "老道士",
  "7": "韩大娘",
  "8": "李槐",
  "9": "李二",
  "10": "小二",
  "11": "老黄",
  "12": "马"
}

let characterSelections = [];

for (var key in renwu) {
  characterSelections.push({
    key: key,
    name: renwu[key]
  })
}

function selectCharacter(name) {
  for (var key in renwu) {
    if (renwu[key] === name) {
      return key;
    }
  }
}

function promptSequence(keys, result, callback) {
  if (keys.length === 0) {
    callback && callback(result);
    return;
  }
  inquirer.prompt({
    type: 'list',
    message: '当前段落：' + talks[keys[0]],
    name: 'type',
    choices: [{
      "name": "对话"
    }, {
      "name": "旁白"
    }, {
      "name": "剧情分支"
    }, {
      "name": "其他（可忽略）"
    }, {
      "name": "结束"
    }],
  }).then(function (answer) {
    if (answer.type === "其他（可忽略）") {
      promptSequence(keys.slice(1, keys.length), result, callback)
    }

    if (answer.type === "对话") {
      inquirer.prompt({
        type: 'list',
        message: '请选择对话主角：',
        name: 'character',
        choices: characterSelections,
      }).then(function (answer) {
        result.push({
          "type": "talk",
          "audio": "",
          "content": keys[0],
          "bg": "",
          "charactor": selectCharacter(answer.character)
        })
        promptSequence(keys.slice(1, keys.length), result, callback)
      });
    }

    if (answer.type === "旁白") {
      result.push({
        "type": "intr",
        "audio": "",
        "content": keys[0],
        "bg": ""
      })
      promptSequence(keys.slice(1, keys.length), result, callback)
    }

    if (answer.type === "剧情分支") {

      inquirer.prompt({
        type: 'input',
        message: '剧情分支选项个数：',
        name: 'num',
        default: 2
      }).then(function (answer) {
        inquirer.prompt({
          type: 'list',
          message: '请选择对话主角：',
          name: 'character',
          choices: characterSelections,
        }).then(function (answer2) {
            var num = +answer.num;
            var branches = [];
            for (let index = 0; index < num; index++) {
              branches.push({
                "content": keys[1 + index]
              })
            }

            result.push({
              "type": "talk",
              "audio": "",
              "content": keys[0],
              "bg": "",
              "charactor": selectCharacter(answer2.charactor),
              "branches": branches
            })

            promptSequence(keys.slice(1 + num, keys.length), result, callback)
        });
      });
    }

    if (answer.type === "结束") {
      callback && callback(result);
    }
  });
}
module.exports = function (args) {
  require('../lib/parseLine')(path.join(process.cwd(), args.f), function (result) {
    var juqingArr = result.slice(args.sline, result.length)
    for (let index = 0; index < juqingArr.length; index++) {
      const talk = juqingArr[index];
      talks['talk' + args.num++] = talk;
    }
    console.log(JSON.stringify(talks));
    promptSequence(Object.keys(talks), [], function (result) {
      // console.log(JSON.stringify(result));
    });
  })
}
