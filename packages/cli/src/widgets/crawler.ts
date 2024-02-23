const cmd = require('node-cmd-promise');

export default function (args) {
  cmd(`pnpm exec gpt-crawler`).catch((e) => console.error(e));
}
