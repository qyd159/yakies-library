const childProcess = require('child_process');
module.exports = function (args) {
  childProcess.spawnSync(
    'docker',
    [
      'build',
      '.',
      '--build-arg',
      ' "HTTP_PROXY=http://192.168.31.121:1080/"',
      '--build-arg',
      '"HTTPS_PROXY=http://192.168.31.121:1080/"',
      '--build-arg',
      '"NO_PROXY=localhost,127.0.0.1,192.168.31.239"',
      '-t',
      args.t,
    ],
    { stdio: ['inherit', 'inherit', 'inherit'] }
  );
};
