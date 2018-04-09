const { mysql: config } = require('../config')

module.exports = async ctx => {
  

  const DB = require('knex')({
    client: 'mysql',
    connection: {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.pass,
      database: 'caipan',
      charset: config.char,
      multipleStatements: true
    }
  })
  //找出比赛信息.发过去

  await DB.select().table('matchs').then(function(d){
    ctx.state.data = d
  })
}