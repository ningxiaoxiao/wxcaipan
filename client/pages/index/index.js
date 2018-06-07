//index.js
var qcloud = require('../../node/wafer2-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    rankArray: new Array(100),
    rank: 0,
    teamId: 0,
    players: []
  },
  onShow: function () {
    //得到比赛场次
    //this.getMatchs();
  },
  changeKills(no, i) {
    var tno = parseInt(no);
    var tnostr = 'players[' + tno + '].matchkills';
    var cur = this.data.players[tno].matchkills;
    this.setData({
      [tnostr]: cur + i
    })
  },
  judgment: function (e) {
    //设置当前比赛
    console.log(e)
    this.setData({
      curmatch: e.target.dataset.id,
      showlist: true
    })
  },
  getMatchs() {
    //从服务器得到比赛
    var that = this;
    util.showBusy('拉取比赛中')
    qcloud.request({
      url: `${config.service.host}/weapp/getmatchs`,
      success(res) {
        util.showSuccess('成功')
        that.setData({
          matchs: res.data.data
        })
      },
      fail(err) {
        util.showModel('拉取失败', error);
        console.log('request fail', error);
      },

    })


  },
  matchkills: function (e) {
    this.changeKills(e.target.id, 1)
  },
  subkills: function (e) {
    this.changeKills(e.target.id, -1)
  },
  updateteamId: function (e) {
    console.log(e)
    this.setData({
      teamId: e.detail.value
    })
  },

  onLoad: function () {
    var tmp = new Array(100);

    for (var i = 1; i < 101; i++) {
      tmp[i] = i;
    }
    this.setData({
      rankArray: tmp
    })
    console.log(this.data.rankArray[22])
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    this.setData({
      rank: e.detail.value
    })
  },
  //发送分数
  send: function () {
    //组装信息

    //只要 playerno + matchkills
    var sendData = {
      rank: this.data.rank,
      matchid: this.data.curmatch,
      teamid: this.data.teamId,
      data: this.data.players,
      openid: this.data.userInfo.openId,
    }
    console.log(sendData)
    var that = this;
    util.showBusy('发送中')
    qcloud.request({
      url: `${config.service.host}/weapp/send`,
      method: 'POST',
      data: sendData,
      success(res) {
        util.showSuccess('发送成功')
        that.getPlayers()
      },
      fail(err) {
        util.showModel('发送失败', error);
        console.log('request fail', error);
      },
    })
  },
  getPlayers: function () {

    //得到队

    //先得到队伍.找出当场比赛 的信息
    util.showBusy('拉取中')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/getTeam`,
      login: false,
      //带的信息
      data: {
        id: this.data.teamId,
        matchid: this.data.curmatch
      },
      success(result) {
        util.showSuccess('请求成功完成')

        var players = result.data.data.players;
        var rank = result.data.data.rank;
        if (rank) {
          that.setData({
            rank: rank
          })
        } else {
          that.setData({
            rank: 0
          })
        }

        var kills = result.data.data.kills;

        //把击杀更新到players中

        players.forEach(function (i, index, input) {
          i['matchkills'] = 0;
          //在击杀中查找 有没有击杀,更新到击杀中
          kills.forEach(function (kitem, kindex, kinput) {
            if (kitem.playerid == i.playerid) {
              i['matchkills'] = kitem.kills;
            }
          })
          input[index] = i;
        })
        that.setData({
          players: players
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })

  },
  loginSucces() {

    util.showSuccess('登录成功')
    this.getMatchs();

  },
  onGotUserInfo: function (e) {
    this.setData({
      userResult: e,
    })
    this.login();
  },
  // 用户登录示例
  login: function () {

    if (this.data.logged) return


    util.showBusy('正在登录')
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        that.setData({
          userInfo: result,
          logged: true
        })
        that.loginSucces()
      },
      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },

  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) { // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else { // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  // 切换信道的按钮
  switchChange: function (e) {
    var checked = e.detail.value

    if (checked) {
      this.openTunnel()
    } else {
      this.closeTunnel()
    }
  },

  openTunnel: function () {
    util.showBusy('信道连接中...')
    // 创建信道，需要给定后台服务地址
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
      util.showSuccess('信道已连接')
      console.log('WebSocket 信道已连接')
      this.setData({
        tunnelStatus: 'connected'
      })
    })

    tunnel.on('close', () => {
      util.showSuccess('信道已断开')
      console.log('WebSocket 信道已断开')
      this.setData({
        tunnelStatus: 'closed'
      })
    })

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
      util.showBusy('正在重连')
    })

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      util.showSuccess('重连成功')
    })

    tunnel.on('error', error => {
      util.showModel('信道发生错误', error)
      console.error('信道发生错误：', error)
    })

    // 监听自定义消息（服务器进行推送）
    tunnel.on('speak', speak => {
      util.showModel('信道消息', speak)
      console.log('收到说话消息：', speak)
    })

    // 打开信道
    tunnel.open()

    this.setData({
      tunnelStatus: 'connecting'
    })
  },

  /**
   * 点击「发送消息」按钮，测试使用信道发送消息
   */
  sendMessage() {
    if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
    // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
    if (this.tunnel && this.tunnel.isActive()) {
      // 使用信道给服务器推送「speak」消息
      this.tunnel.emit('speak', {
        'word': 'I say something at ' + new Date(),
      });
    }
  },

  /**
   * 点击「关闭信道」按钮，关闭已经打开的信道
   */
  closeTunnel() {
    if (this.tunnel) {
      this.tunnel.close();
    }
    util.showBusy('信道连接中...')
    this.setData({
      tunnelStatus: 'closed'
    })
  }
})