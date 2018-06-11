DB=require('../db')
module.exports = async ctx => {
    var mid = ctx.query.matchid;


    //找出当前比赛的round
    await DB('round')
        .where('matchid', mid)
        .then(function (data) {
            ctx.state.data = data
        })
}