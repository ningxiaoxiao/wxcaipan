const { mysql: config } = require('../config')

module.exports = async ctx => {
  var id = ctx.query.id;
  var mid = ctx.query.matchid;
  var retData = {};

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
  //找出队伍
  await DB.from('teams').innerJoin('players', 'teams.teamid', 'players.teamid')
    .where('teams.teamid',id)
    .then(function (data) {
      retData['players'] = data
    })
  //找出这场比赛这个队的rank
  await DB('rank').where({
    teamid: id,
    matchid: mid
  }).then(function (d) {

    if (d.length > 0) {
      retData['rank'] = d[0].rank
    }

  })
  //找出这场比赛所有这个队的击杀
  await DB('kills').where({
    matchid: mid,
    teamid: id
  }).then(function (d) {
    retData['kills'] = d
    ctx.state.data = retData
  })
}