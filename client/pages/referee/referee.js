var qcloud = require('../../node/wafer2-client-sdk/index.js')
var config = require('../../config')
var util = require('../../utils/util.js')
// referee.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allTeams: [],
    matchid: 0,
    teamindex: 0,
    rank: 0,
    round: [],
    roundindex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //得到当前比赛
    this.setData({
      matchid: options.matchid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //得到所有队伍
    this.getAllTeamsWithMatchid()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getAllTeamsWithMatchid: function () {
    //得到所有的队

    //先得到队伍.找出当场比赛 的信息
    util.showBusy('拉取所有队伍中')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/getAllTeamsWithMatchid`,
      login: false,
      //带的信息
      data: {
        matchid: that.data.matchid
      },
      success(result) {
        wx.hideToast()

        that.setData({
          allTeams: result.data.data
        })
        that.getRound()
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })


  },
  getRound: function () {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getRound`,
      login: false,
      //带的信息
      data: {
        matchid: this.data.matchid
      },
      success(result) {
       

        that.setData({
          round: result.data.data
        })
        that.getPlayers()
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  getPlayers: function () {

    //得到队

    //先得到队伍.找出当场比赛 的信息
    util.showBusy('拉取队伍信息中')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/getTeam`,
      login: false,
      //带的信息
      data: {
        id: this.data.allTeams[this.data.teamindex].id,
        matchid: this.data.matchid,
        roundid: this.data.round[this.data.roundindex].id
      },
      success(result) {
        wx.hideToast()

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
          i['kills'] = 0;
          //在击杀中查找 有没有击杀,更新到击杀中
          kills.forEach(function (kitem, kindex, kinput) {
            if (kitem.playerid == i.pid) {
              i['kills'] = kitem.kills;
              i['kid'] = kitem.id;
            }
          })
          input[index] = i;
        })
        that.setData({
          players: players,
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })

  },
  onrankinputchange: function (e) {
    this.setData({
      rank: e.detail.value
    })


  },
  bindPickerTeamChange: function (e) {
    this.setData({
      teamindex: e.detail.value,
    })
    this.getPlayers();
  },
  bindRoundIndexChange: function (e) {
    this.setData({
      roundindex: e.detail.value
    })
    //请求新的玩家信息
    this.getPlayers();

  },
  //增加击杀
  matchkills: function (e) {
    this.changeKills(e.target.id, 1)
  },
  //减少击杀
  subkills: function (e) {
    this.changeKills(e.target.id, -1)
  },
  changeKills(id, i) {
    var tno = parseInt(id);
    var tnostr = 'players[' + tno + '].kills';
    var cur = this.data.players[tno].kills;
    this.setData({
      [tnostr]: cur + i
    })
    //发送给服务器
    this.updateKills(tno)

  },

  updateKills: function (pindex) {
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/updatekills`,
      method: 'POST',
      login: false,
      //带的信息
      data: {
        pid: this.data.players[pindex].pid,
        mid: this.data.matchid,
        rid: this.data.round[this.data.roundindex].id,
        k: this.data.players[pindex].kills,
        tid: this.data.players[pindex].tid,
      },
      success(result) {
        util.showSuccess('请求成功完成')
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  updaterank: function () {


    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/updaterank`,
      method: 'POST',
      login: false,
      //带的信息
      data: {
        mid: this.data.matchid,
        rid: this.data.round[this.data.roundindex].id,
        rank: this.data.rank,
        tid: this.data.players[0].tid,
      },
      success(result) {
        util.showSuccess('请求成功完成')
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
})