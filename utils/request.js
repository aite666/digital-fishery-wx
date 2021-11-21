// const API_BASE_URL = 'http://localhost:8080'
const API_BASE_URL = 'http://120.27.195.95:8080'
// const API_BASE_URL = 'https://www.qianhan.top'
const app = getApp();

const REQUEST = (url, method, data = {}, header) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_BASE_URL + url,
      method: method,
      data: data,
      header: header,
      success(res) {
        resolve(res.data)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

const HTTP = (url, method, data, isToken = true) => {
  //isToken请求是否自动带上token值，默认为true
  let header = {
    'Content-Type': 'application/json'
  }
  if (method == 'get' && app.globalData.userInfo.blockIds) {
    data['blockIds'] = app.globalData.userInfo.blockIds
  }
  return new Promise((resolve, reject) => {
    if (isToken) { 
      // 请求带token
      let token = wx.getStorageSync('token')
      if (token) { 
        // 缓存有token直接用
        header = Object.assign({
            Authorization: 'Bearer ' + token
        }, header)
        REQUEST(url, method, data, header).then(res => {
          resolve(res)
        })
      }
    } else { 
      // 请求不带token
      REQUEST(url, method, data, header).then(res => {
        resolve(res)
      })
    }
  })
}

module.exports = HTTP;