DB=require('../db')

module.exports = async ctx => {

    var data = ctx.request.body


    var rows = await DB('rank').where({
        teamid: data.tid,
        matchid: data.mid,
        roundid: data.rid,
    }).update({
        rank: data.rank
    })

    if (rows == 1) {

        ctx.state.data = 'updatesqlout:' + rows
        return
    }

    await DB('rank').insert({
        matchid: data.mid,
        roundid: data.rid,
        rank: data.rank,
        teamid: data.tid,
    }).then(function (e) {
        ctx.state.data = 'insertsqlout:' + e
    })





}