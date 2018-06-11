const {
    mysql: config
  } = require('./config')

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


module.exports=DB;