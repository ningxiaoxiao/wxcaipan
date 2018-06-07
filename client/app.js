//app.js
var qcloud = require('./node/wafer2-client-sdk/index.js')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    }
})