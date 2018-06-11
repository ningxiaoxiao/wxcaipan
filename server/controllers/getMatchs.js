DB=require('../db')

module.exports = async ctx => {
  
  //找出比赛信息.发过去

  await DB.select().table('matchs').then(function(d){
    ctx.state.data = d
  })
}