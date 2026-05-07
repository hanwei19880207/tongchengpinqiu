const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  const { data } = await db.collection('users').where({
    _openid: wxContext.OPENID,
  }).get()

  if (data.length === 0) {
    await db.collection('users').add({
      data: {
        _openid: wxContext.OPENID,
        nickName: '',
        avatarUrl: '',
        level: 'NTRP 2.5',
        bio: '',
        stats: { matches: 0, rating: 0, friends: 0, badges: 0 },
        createdAt: db.serverDate(),
      },
    })
  }

  return {
    openid: wxContext.OPENID,
    isNew: data.length === 0,
  }
}
