const cmd = require('node-cmd-promise');

export default function (args) {
  cmd(`gpt-crawler`).catch((e) => console.error(e));
}
