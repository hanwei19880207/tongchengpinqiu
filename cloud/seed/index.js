const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

const POSTS = [
  { title: '周末约球｜奥体中心，中级水平求搭子', author: '网球少年', avatar: '🎾', likes: 1280, content: '这周六下午奥体有场地，想找个中级水平的搭子练练。最近正手进步很大，想多打比赛巩固一下。有兴趣的球友评论区留言～', comments: [{ author: '老张', avatar: '🏃', content: '我可以！4.0水平', createdAt: '1小时前' }] },
  { title: '入门球拍怎么选？新手必看攻略', author: 'Coach王', avatar: '🏆', likes: 856, content: '很多新手问我球拍怎么选：\n1. 预算1000以内推荐百宝力PD\n2. 手感优先选威尔胜Clash\n3. 力量不足选Head Radical', comments: [] },
  { title: '藏在城市里的宝藏球场，人少灯光好', author: '场馆探店', avatar: '📍', likes: 562, content: '今天发现一个超棒的室内球场，在朝阳区望京附近。6片场地，LED灯光，地面刚翻新过，最关键是人少！', comments: [] },
  { title: '正手击球发力技巧，三个月从3.0到4.0', author: '职业教练李', avatar: '⭐', likes: 3024, content: '核心要点：转体发力，不是手臂发力。想象你在甩毛巾，力量从脚开始，经过腰，最后到拍头。每天对墙练习30分钟，坚持三个月你会看到明显进步。', comments: [{ author: '进步中', avatar: '💪', content: '照着练了一周，确实有感觉！', createdAt: '2天前' }] },
  { title: '今日战绩 6-3 6-4 连胜第五场！', author: '老张打球记', avatar: '🔥', likes: 456, content: '今天状态爆棚！发球局全保，对手是4.5的水平，能赢真的太开心了。', comments: [] },
  { title: '双打配合默契度训练，找到你的最佳搭档', author: '双打俱乐部', avatar: '👥', likes: 728, content: '双打不仅是技术，更是默契。\n1. 赛前沟通站位策略\n2. 用手势示意发球方向\n3. 网前截击要果断\n4. 多鼓励，少埋怨', comments: [] },
  { title: '雨后球场超美，分享几张照片', author: '摄影爱好者', avatar: '📸', likes: 932, content: '昨天雨后去球场，夕阳洒在球场上太美了。网球和摄影两个爱好完美结合。', comments: [] },
  { title: '从零开始学网球，一年的心路历程', author: '网球新人', avatar: '🌱', likes: 1567, content: '一年前完全不会打球，现在能和4.0的球友对打了。最大的感悟是：找一个好教练比自己瞎练有效10倍。', comments: [] },
]

const MATCHES = [
  { title: '周六下午奥体约球', level: '中级', host: '网球少年', hostLevel: '4.0', location: '奥体中心网球馆', time: '周六 14:00-16:00', spots: { current: 2, total: 4 }, fee: 50, tags: ['双打', '可教学'], description: '老地方老时间，欢迎中级水平的球友加入。', participants: [{ name: '网球少年', avatar: '🎾', level: '4.0' }, { name: 'Lucy', avatar: '🌟', level: '3.5' }] },
  { title: '工作日晚间畅打', level: '初级', host: '新手小王', hostLevel: '2.5', location: '朝阳公园网球场', time: '周三 19:00-21:00', spots: { current: 1, total: 2 }, fee: 40, tags: ['单打', '新手友好'], description: '刚学球半年，想找同水平的球友一起练习。', participants: [{ name: '新手小王', avatar: '🌱', level: '2.5' }] },
  { title: '周末双打约战！高手来', level: '高级', host: 'Coach李', hostLevel: '5.0', location: '国家网球中心', time: '周日 09:00-12:00', spots: { current: 3, total: 4 }, fee: 80, tags: ['双打', '竞技'], description: '要求4.5以上水平，有比赛经验优先。', participants: [{ name: 'Coach李', avatar: '⭐', level: '5.0' }, { name: '老张', avatar: '🏃', level: '4.5' }, { name: '王教练', avatar: '🏆', level: '4.8' }] },
  { title: '周五下班后来一局', level: '中级', host: '职场球友', hostLevel: '3.5', location: '望京网球馆', time: '周五 18:30-20:30', spots: { current: 1, total: 4 }, fee: 45, tags: ['双打', '下班约球'], description: '每周五固定约球，下班后直接过来。', participants: [{ name: '职场球友', avatar: '💼', level: '3.5' }] },
  { title: '亲子网球体验课', level: '初级', host: '教练Amy', hostLevel: '4.0', location: '朝阳公园网球场', time: '周六 10:00-11:30', spots: { current: 4, total: 6 }, fee: 30, tags: ['亲子', '体验课', '新手友好'], description: '专为家长和孩子设计的网球体验课。', participants: [{ name: '教练Amy', avatar: '👩‍🏫', level: '4.0' }, { name: '球爸', avatar: '👨', level: '3.0' }] },
]

const VENUES = [
  { name: '奥体中心网球馆', rating: 8.7, reviews: 128, distance: '2.3km', price: 80, tags: ['室内', '灯光好', '停车方便'], scores: { env: 8.9, service: 8.5, value: 8.8 }, address: '朝阳区北四环中路7号', phone: '010-64912233', openHours: '06:00-22:00', facilities: ['淋浴', '更衣室', '停车场', '球拍租赁', '教练服务'] },
  { name: '朝阳公园网球场', rating: 8.2, reviews: 86, distance: '1.5km', price: 60, tags: ['室外', '风景好', '新翻修'], scores: { env: 8.5, service: 7.8, value: 8.3 }, address: '朝阳区朝阳公园南路1号', phone: '010-65953603', openHours: '07:00-21:00', facilities: ['更衣室', '饮水机', '教练服务'] },
  { name: '国家网球中心', rating: 9.1, reviews: 256, distance: '5.8km', price: 120, tags: ['专业', '硬地', '国际标准'], scores: { env: 9.3, service: 9.0, value: 8.9 }, address: '朝阳区林萃路2号', phone: '010-84376699', openHours: '08:00-22:00', facilities: ['淋浴', '更衣室', '停车场', '球拍租赁', '教练服务', '餐厅', 'Pro Shop'] },
  { name: '望京网球馆', rating: 8.4, reviews: 67, distance: '3.1km', price: 70, tags: ['室内', '新开业', '空调'], scores: { env: 8.6, service: 8.2, value: 8.5 }, address: '朝阳区望京西路50号', phone: '010-64783322', openHours: '07:00-23:00', facilities: ['淋浴', '更衣室', '停车场', '空调'] },
  { name: '海淀网球公园', rating: 7.9, reviews: 45, distance: '8.2km', price: 50, tags: ['室外', '平价', '地铁直达'], scores: { env: 7.5, service: 7.8, value: 8.5 }, address: '海淀区西三环北路105号', phone: '010-68456677', openHours: '06:30-21:30', facilities: ['更衣室', '饮水机'] },
  { name: '中网钻石球场', rating: 9.5, reviews: 312, distance: '6.5km', price: 200, tags: ['专业', '顶级', '国际赛事'], scores: { env: 9.8, service: 9.5, value: 8.2 }, address: '朝阳区林萃路2号国家网球中心内', phone: '010-84376700', openHours: '09:00-21:00', facilities: ['淋浴', '更衣室', 'VIP休息室', '停车场', '球拍租赁', '教练服务', '餐厅', 'Pro Shop', '理疗室'] },
]

exports.main = async (event, context) => {
  const results = { posts: 0, matches: 0, venues: 0 }

  for (const post of POSTS) {
    await db.collection('posts').add({
      data: { ...post, createdAt: db.serverDate(), image: '' },
    })
    results.posts++
  }

  for (const match of MATCHES) {
    await db.collection('matches').add({
      data: { ...match, createdAt: db.serverDate(), image: '' },
    })
    results.matches++
  }

  for (const venue of VENUES) {
    await db.collection('venues').add({
      data: { ...venue, images: [] },
    })
    results.venues++
  }

  return { success: true, inserted: results }
}
