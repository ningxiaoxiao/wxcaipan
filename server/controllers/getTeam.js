DB=require('../db')

module.exports = async ctx => {
  var id = ctx.query.id;
  var mid = ctx.query.matchid;
  var rid = ctx.query.roundid;
  var retData = {};



  //找出队伍和选手
  await DB.select(
      'players.id as pid',
      'teams.name as tname',
      'players.name as pname',
      'teams.id as tid'
    )
    .from('teams').leftJoin('players', 'teams.id', 'players.teamid')
    .where('teams.id', id)
    .then(function (data) {
      retData['players'] = data
    })
  //找出这场比赛这个队的rank
  await DB('rank').where({
    teamid: id,
    matchid: mid,
    roundid: rid
  }).then(function (d) {
    if (d.length > 0) {
      retData['rank'] = d[0].rank
    }
  })
  //找出这场比赛所有这个队的击杀
  await DB('kills').where({
    matchid: mid,
    teamid: id,
    roundid: rid
  }).then(function (d) {
    retData['kills'] = d
    ctx.state.data = retData
  })
  



}