DB=require('../db')

module.exports = async ctx => {


    var data = ctx.request.body

    //更新击杀
    //有没有这条记录
    var rows = await DB('kills').where({
        playerid: data.pid,
        matchid: data.mid,
        roundid: data.rid,
    }).update({
        kills: data.k
    })

    if (rows == 1) {

        ctx.state.data = 'updatesqlout:' + rows
        return
    }

    await DB('kills').insert({
        playerid: data.pid,
        matchid: data.mid,
        roundid: data.rid,
        kills: data.k,
        teamid: data.tid,
    }).then(function (e) {
        ctx.state.data = 'insertsqlout:' + e
    })





}