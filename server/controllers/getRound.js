const {
    mysql: config
} = require('../config')

module.exports = async ctx => {
    var mid = ctx.query.matchid;

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

    //找出当前比赛的round
    await DB('round')
        .where('matchid', mid)
        .then(function (data) {
            ctx.state.data = data
        })
}