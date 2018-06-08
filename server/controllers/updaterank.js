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