import { spawn } from 'child_process';

export default function (args) {
  const crawlerParams = [];
  crawlerParams.push('-u', args.u || 'https://docs.nvidia.com/metropolis/deepstream/dev-guide/');
  crawlerParams.push('-m', args.m || 'https://docs.nvidia.com/metropolis/deepstream/dev-guide/');
  crawlerParams.push('-s', args.s || 'body');
  spawn(`pnpm`, ['exec', 'gpt-crawler', ...crawlerParams], { stdio: 'inherit' });
}
