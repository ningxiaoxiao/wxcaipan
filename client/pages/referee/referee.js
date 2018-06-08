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
    curTeamid: 0,
    matchid: 0,
    allTeams: {}

  },
  bindPickerTeamChange: function (e) {
    this.setData({
      curTeamid: e.detail.value
    })
  },
  goTeam: function () {
    //带上参数 
    wx.navigateTo({
      url: "../referee/team?teamid=" + this.data.allTeams[this.data.curTeamid].id + "&matchid=" + this.data.matchid,
    })
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


  getAllTeamsWithMatchid: function () {
    //得到所有的队

    //先得到队伍.找出当场比赛 的信息
    util.showBusy('拉取队伍中')
    var that = this
    qcloud.request({
      url: `${config.service.host}/weapp/getAllTeamsWithMatchid`,
      login: false,
      //带的信息
      data: {
        matchid: that.data.matchid
      },
      success(result) {
        util.showSuccess('拉取队伍成功')

        that.setData({
          allTeams: result.data.data
        })


      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })


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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})