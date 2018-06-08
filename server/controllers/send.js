const {
  mysql: config
} = require('../config')

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

  var data = ctx.request.body

  //更新所有增加的击杀
  //删除这场比赛 这队所有人记录

  await DB('kills').where({
    teamid: data.teamid,
    matchid: data.matchid
  }).del()

  //删除现有rank
  await DB('rank').where({
    teamid: data.teamid,
    matchid: data.matchid
  }).del()
  let wiiladdkillsdata = []
  //增加所有击杀记录
  data.data.map(function (i, index, input) {
    wiiladdkillsdata.push({
      playerid: i.playerid,
      kills: i.matchkills,
      matchid: data.matchid,
      teamid: data.teamid,
      openid: data.openid
    })
  })



  await DB('kills').insert(wiiladdkillsdata)



  //增加rank
  await DB('rank').insert({
    teamid: data.teamid,
    rank: data.rank,
    matchid: data.matchid,
    openid: data.openid
  })

  ctx.state.data = {
    sqlmsg: 'ok',
  }

}