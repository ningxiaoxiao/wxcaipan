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
  //找出所有参加这个比赛的队
  await DB('team_with_match').leftJoin('teams','team_with_match.teamid','teams.id')
  .where('matchid',mid)
  .then(function(d){
    //找出对应的名字

    ctx.state.data = d
  })
}