module.exports = {
  ytt: [
    {
      serverUrl: 'https://user-center.yakies.cn/api/json',
      serverType: 'swagger',
      outputDir: 'src/api/generated/user-center',
      projects: [{
        token: '',
        categories: [{
          id: 0,
          prefix: /^\/admin\/(register|login)/,
          prefixReserve: false
        }]
        ,
      }]
    }
  ]

}
