const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

// ============ 图片资源 ============
const VENUE_IMAGES = [
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
  'https://images.unsplash.com/photo-1617083934551-ac1f1c920854?w=800&q=80',
  'https://images.unsplash.com/photo-1531315396756-905d68d21b56?w=800&q=80',
  'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
  'https://images.unsplash.com/photo-1544298621-35a764866ff0?w=800&q=80',
  'https://images.unsplash.com/photo-1627246939899-23e1e0cf0fa1?w=800&q=80',
]

const POST_IMAGES = [
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80',
  'https://images.unsplash.com/photo-1542144582-1ba00ace1038?w=800&q=80',
  'https://images.unsplash.com/photo-1551773188-d63e5d4d2f65?w=800&q=80',
  'https://images.unsplash.com/photo-1545809627-a4c4286af5b1?w=800&q=80',
  'https://images.unsplash.com/photo-1560012057-4372e14c5085?w=800&q=80',
  'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=800&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
  'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80',
  'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=800&q=80',
  'https://images.unsplash.com/photo-1530915534664-4ac6423816b7?w=800&q=80',
]

const MATCH_IMAGES = [
  'https://images.unsplash.com/photo-1596495717755-a862cabb7112?w=800&q=80',
  'https://images.unsplash.com/photo-1612458225454-41fc27750463?w=800&q=80',
  'https://images.unsplash.com/photo-1558743212-7edcea437c42?w=800&q=80',
  'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80',
  'https://images.unsplash.com/photo-1560012057-4372e14c5085?w=800&q=80',
  'https://images.unsplash.com/photo-1597913868106-40daff725b61?w=800&q=80',
  'https://images.unsplash.com/photo-1628779238951-be2c9f2a59f4?w=800&q=80',
  'https://images.unsplash.com/photo-1591491653056-4e9d6804ef65?w=800&q=80',
]

// ============ 模拟用户 ============
const USERS = [
  { _openid: 'sim_user_001', nickName: '张鹏飞', avatarUrl: '', level: 'NTRP 4.0', bio: '周末双打爱好者，正手暴力型选手', stats: { matches: 36, rating: 8.6, friends: 12, badges: 5 } },
  { _openid: 'sim_user_002', nickName: '李思远', avatarUrl: '', level: 'NTRP 3.5', bio: '刚从羽毛球转网球一年，进步中', stats: { matches: 18, rating: 7.8, friends: 8, badges: 2 } },
  { _openid: 'sim_user_003', nickName: '王晓琳', avatarUrl: '', level: 'NTRP 4.5', bio: '前省队退役，现做业余教练', stats: { matches: 128, rating: 9.3, friends: 45, badges: 12 } },
  { _openid: 'sim_user_004', nickName: '陈俊豪', avatarUrl: '', level: 'NTRP 3.0', bio: '互联网打工人，下班解压靠网球', stats: { matches: 22, rating: 7.5, friends: 6, badges: 3 } },
  { _openid: 'sim_user_005', nickName: '赵雨萱', avatarUrl: '', level: 'NTRP 2.5', bio: '网球小白，求带', stats: { matches: 8, rating: 0, friends: 3, badges: 1 } },
  { _openid: 'sim_user_006', nickName: '刘子轩', avatarUrl: '', level: 'NTRP 4.0', bio: '费德勒铁粉，单反选手', stats: { matches: 52, rating: 8.4, friends: 15, badges: 7 } },
  { _openid: 'sim_user_007', nickName: '孙婉清', avatarUrl: '', level: 'NTRP 3.5', bio: '喜欢打双打，找固定搭子', stats: { matches: 30, rating: 8.1, friends: 10, badges: 4 } },
  { _openid: 'sim_user_008', nickName: '周明远', avatarUrl: '', level: 'NTRP 5.0', bio: 'ITF注册教练，周末带课', stats: { matches: 200, rating: 9.6, friends: 68, badges: 15 } },
  { _openid: 'sim_user_009', nickName: '吴思涵', avatarUrl: '', level: 'NTRP 3.0', bio: '公司网球社团负责人', stats: { matches: 25, rating: 7.9, friends: 20, badges: 3 } },
  { _openid: 'sim_user_010', nickName: '林浩宇', avatarUrl: '', level: 'NTRP 4.5', bio: '打球10年，喜欢竞技对抗', stats: { matches: 96, rating: 9.0, friends: 28, badges: 10 } },
]

// ============ 真实场馆 ============
const VENUES = [
  {
    name: '国家网球中心',
    image: VENUE_IMAGES[0],
    images: [VENUE_IMAGES[0], VENUE_IMAGES[1], VENUE_IMAGES[2]],
    rating: 9.3, reviews: 386, distance: '5.8km', price: 150,
    tags: ['专业', '硬地', '国际标准'],
    scores: { env: 9.5, service: 9.2, value: 8.8 },
    address: '朝阳区林萃路2号',
    phone: '010-84376699',
    openHours: '08:00-22:00',
    facilities: ['淋浴', '更衣室', '停车场', '球拍租赁', '教练服务', '餐厅', 'Pro Shop', '理疗室'],
  },
  {
    name: '光彩体育馆网球场',
    image: VENUE_IMAGES[1],
    images: [VENUE_IMAGES[1], VENUE_IMAGES[3]],
    rating: 8.5, reviews: 142, distance: '4.2km', price: 100,
    tags: ['室内', '硬地', '灯光好'],
    scores: { env: 8.7, service: 8.3, value: 8.5 },
    address: '丰台区光彩路1号',
    phone: '010-67210011',
    openHours: '07:00-22:00',
    facilities: ['淋浴', '更衣室', '停车场', '教练服务'],
  },
  {
    name: '望京南湖网球馆',
    image: VENUE_IMAGES[2],
    images: [VENUE_IMAGES[2], VENUE_IMAGES[4]],
    rating: 8.2, reviews: 98, distance: '3.1km', price: 70,
    tags: ['室内', '新开业', '性价比高'],
    scores: { env: 8.4, service: 8.0, value: 8.6 },
    address: '朝阳区望京南湖西园216号',
    phone: '010-64783322',
    openHours: '07:00-23:00',
    facilities: ['淋浴', '更衣室', '空调', '球拍租赁'],
  },
  {
    name: '朝阳公园网球中心',
    image: VENUE_IMAGES[3],
    images: [VENUE_IMAGES[3], VENUE_IMAGES[5], VENUE_IMAGES[0]],
    rating: 8.7, reviews: 215, distance: '1.5km', price: 80,
    tags: ['室外', '红土', '风景好'],
    scores: { env: 9.0, service: 8.4, value: 8.7 },
    address: '朝阳区朝阳公园南路1号',
    phone: '010-65953603',
    openHours: '06:30-21:00',
    facilities: ['更衣室', '饮水机', '教练服务', '红土场'],
  },
  {
    name: '奥林匹克森林公园网球场',
    image: VENUE_IMAGES[4],
    images: [VENUE_IMAGES[4], VENUE_IMAGES[6]],
    rating: 8.4, reviews: 167, distance: '6.2km', price: 60,
    tags: ['室外', '环境好', '停车方便'],
    scores: { env: 9.1, service: 7.8, value: 8.8 },
    address: '朝阳区北辰东路15号',
    phone: '010-84376588',
    openHours: '06:00-21:30',
    facilities: ['更衣室', '停车场', '饮水机'],
  },
  {
    name: '天坛体育活动中心',
    image: VENUE_IMAGES[5],
    images: [VENUE_IMAGES[5], VENUE_IMAGES[7]],
    rating: 7.9, reviews: 76, distance: '7.5km', price: 55,
    tags: ['室外', '平价', '地铁直达'],
    scores: { env: 7.6, service: 7.8, value: 8.5 },
    address: '东城区天坛东路13号',
    phone: '010-67028088',
    openHours: '06:00-21:00',
    facilities: ['更衣室', '饮水机'],
  },
  {
    name: '匠心之轮网球俱乐部',
    image: VENUE_IMAGES[6],
    images: [VENUE_IMAGES[6], VENUE_IMAGES[0], VENUE_IMAGES[2]],
    rating: 9.6, reviews: 428, distance: '18km', price: 280,
    tags: ['顶级', '室内外', '教练团队'],
    scores: { env: 9.8, service: 9.7, value: 8.5 },
    address: '顺义区天竺镇府前一街28号',
    phone: '010-80467788',
    openHours: '08:00-22:00',
    facilities: ['淋浴', '更衣室', 'VIP休息室', '停车场', '球拍租赁', '教练服务', '餐厅', 'Pro Shop', '理疗室', '泳池'],
  },
  {
    name: '中关村网球场',
    image: VENUE_IMAGES[7],
    images: [VENUE_IMAGES[7], VENUE_IMAGES[1]],
    rating: 7.6, reviews: 53, distance: '8.8km', price: 45,
    tags: ['室外', '平价', '交通便利'],
    scores: { env: 7.2, service: 7.5, value: 8.8 },
    address: '海淀区丹棱街甲1号',
    phone: '010-62528899',
    openHours: '07:00-21:00',
    facilities: ['饮水机', '停车场'],
  },
]

// ============ 约球活动 ============
const MATCHES = [
  // --- 进行中/未来 5 场 ---
  {
    image: MATCH_IMAGES[0],
    title: '周六下午国网双打',
    level: '高级',
    host: '林浩宇', hostLevel: '4.5', hostOpenid: 'sim_user_010',
    location: '国家网球中心',
    time: '周六 14:00-17:00',
    spots: { current: 3, total: 4 }, fee: 75,
    tags: ['双打', '竞技', '4.0+'],
    status: 'upcoming',
    description: '周六下午国网中心3号场地，找一位4.0以上双打搭子。场地已预约，费用AA。赛后可以留下来自由练习。',
    participants: [
      { id: 'p1', name: '林浩宇', avatar: '🎾', level: '4.5', openid: 'sim_user_010' },
      { id: 'p2', name: '张鹏飞', avatar: '🔥', level: '4.0', openid: 'sim_user_001' },
      { id: 'p3', name: '刘子轩', avatar: '🎯', level: '4.0', openid: 'sim_user_006' },
    ],
  },
  {
    image: MATCH_IMAGES[1],
    title: '望京晚间练球',
    level: '中级',
    host: '孙婉清', hostLevel: '3.5', hostOpenid: 'sim_user_007',
    location: '望京南湖网球馆',
    time: '周三 19:30-21:30',
    spots: { current: 1, total: 2 }, fee: 45,
    tags: ['单打', '练球', '女生优先'],
    status: 'upcoming',
    description: '工作日晚上来望京南湖练球，中级水平，女生优先但不限性别。希望找到固定搭子每周练一次。',
    participants: [
      { id: 'p4', name: '孙婉清', avatar: '🌸', level: '3.5', openid: 'sim_user_007' },
    ],
  },
  {
    image: MATCH_IMAGES[2],
    title: '周末新手友好局',
    level: '初级',
    host: '吴思涵', hostLevel: '3.0', hostOpenid: 'sim_user_009',
    location: '朝阳公园网球中心',
    time: '周日 10:00-12:00',
    spots: { current: 3, total: 6 }, fee: 30,
    tags: ['新手友好', '双打', '社交'],
    status: 'upcoming',
    description: '公司网球社团活动，欢迎新手加入！会有高手带着打，氛围轻松。打完球一起吃午饭～',
    participants: [
      { id: 'p5', name: '吴思涵', avatar: '🏢', level: '3.0', openid: 'sim_user_009' },
      { id: 'p6', name: '赵雨萱', avatar: '🌈', level: '2.5', openid: 'sim_user_005' },
      { id: 'p7', name: '陈俊豪', avatar: '💻', level: '3.0', openid: 'sim_user_004' },
    ],
  },
  {
    image: MATCH_IMAGES[3],
    title: '教练带训小班课',
    level: '中级',
    host: '周明远', hostLevel: '5.0', hostOpenid: 'sim_user_008',
    location: '匠心之轮网球俱乐部',
    time: '周六 09:00-11:00',
    spots: { current: 2, total: 4 }, fee: 120,
    tags: ['教练带训', '提升技术', '小班'],
    status: 'upcoming',
    description: 'ITF注册教练带训，针对3.0-4.0水平球友的提升班。本次重点练习发球和网前截击，名额有限先到先得。',
    participants: [
      { id: 'p8', name: '周明远', avatar: '👨‍🏫', level: '5.0', openid: 'sim_user_008' },
      { id: 'p9', name: '李思远', avatar: '📈', level: '3.5', openid: 'sim_user_002' },
    ],
  },
  {
    image: MATCH_IMAGES[4],
    title: '奥森晨练跑步+网球',
    level: '中级',
    host: '张鹏飞', hostLevel: '4.0', hostOpenid: 'sim_user_001',
    location: '奥林匹克森林公园网球场',
    time: '周日 07:00-09:30',
    spots: { current: 2, total: 4 }, fee: 35,
    tags: ['晨练', '体能', '单打'],
    status: 'upcoming',
    description: '先绕奥森跑5公里热身，然后打1.5小时球。适合想提升体能的球友，强度中等偏上。',
    participants: [
      { id: 'p10', name: '张鹏飞', avatar: '🔥', level: '4.0', openid: 'sim_user_001' },
      { id: 'p11', name: '刘子轩', avatar: '🎯', level: '4.0', openid: 'sim_user_006' },
    ],
  },
  // --- 已完成 3 场 ---
  {
    image: MATCH_IMAGES[5],
    title: '光彩馆周三对抗赛',
    level: '高级',
    host: '王晓琳', hostLevel: '4.5', hostOpenid: 'sim_user_003',
    location: '光彩体育馆网球场',
    time: '上周三 19:00-21:00',
    spots: { current: 4, total: 4 }, fee: 60,
    tags: ['双打', '竞技', '对抗赛'],
    status: 'completed',
    description: '4人双打对抗赛，打满三盘，输了下场换人。',
    participants: [
      { id: 'p12', name: '王晓琳', avatar: '👑', level: '4.5', openid: 'sim_user_003' },
      { id: 'p13', name: '林浩宇', avatar: '🎾', level: '4.5', openid: 'sim_user_010' },
      { id: 'p14', name: '张鹏飞', avatar: '🔥', level: '4.0', openid: 'sim_user_001' },
      { id: 'p15', name: '刘子轩', avatar: '🎯', level: '4.0', openid: 'sim_user_006' },
    ],
  },
  {
    image: MATCH_IMAGES[6],
    title: '朝阳公园周末混双',
    level: '中级',
    host: '李思远', hostLevel: '3.5', hostOpenid: 'sim_user_002',
    location: '朝阳公园网球中心',
    time: '上周六 15:00-17:00',
    spots: { current: 4, total: 4 }, fee: 40,
    tags: ['混双', '社交', '轻松'],
    status: 'completed',
    description: '轻松的混双活动，打完球一起喝咖啡聊天。',
    participants: [
      { id: 'p16', name: '李思远', avatar: '📈', level: '3.5', openid: 'sim_user_002' },
      { id: 'p17', name: '孙婉清', avatar: '🌸', level: '3.5', openid: 'sim_user_007' },
      { id: 'p18', name: '陈俊豪', avatar: '💻', level: '3.0', openid: 'sim_user_004' },
      { id: 'p19', name: '赵雨萱', avatar: '🌈', level: '2.5', openid: 'sim_user_005' },
    ],
  },
  {
    image: MATCH_IMAGES[7],
    title: '天坛新手教学局',
    level: '初级',
    host: '周明远', hostLevel: '5.0', hostOpenid: 'sim_user_008',
    location: '天坛体育活动中心',
    time: '上周日 09:00-11:00',
    spots: { current: 3, total: 4 }, fee: 25,
    tags: ['教学', '新手友好', '耐心'],
    status: 'completed',
    description: '教练带新手入门，从握拍到正手挥拍，零基础也不怕。',
    participants: [
      { id: 'p20', name: '周明远', avatar: '👨‍🏫', level: '5.0', openid: 'sim_user_008' },
      { id: 'p21', name: '赵雨萱', avatar: '🌈', level: '2.5', openid: 'sim_user_005' },
      { id: 'p22', name: '吴思涵', avatar: '🏢', level: '3.0', openid: 'sim_user_009' },
    ],
  },
]

// ============ 动态帖子 ============
const POSTS = [
  {
    image: POST_IMAGES[0],
    title: '国网中心新翻修的5号场太棒了！',
    author: '张鹏飞', avatar: '🔥', likes: 328,
    content: '上周去国家网球中心打球，发现5号场刚翻修完，新的DecoTurf地面弹性很好，脚感比之前舒服很多。而且新装了LED灯光系统，晚上打球跟白天一样亮。推荐大家去体验一下！',
    createdAt: '3小时前',
    comments: [
      { id: 'c1', author: '林浩宇', avatar: '🎾', content: '确实！上次打完膝盖都没那么疼了', createdAt: '2小时前' },
      { id: 'c2', author: '王晓琳', avatar: '👑', content: '5号场我下周有课，可以去试试', createdAt: '1小时前' },
    ],
  },
  {
    image: POST_IMAGES[1],
    title: '单反终于找到感觉了！分享训练心得',
    author: '刘子轩', avatar: '🎯', likes: 562,
    content: '练单反三年了，最近终于有了突破。关键是：\n\n1. 引拍时左手一定要扶住拍喉\n2. 击球点比想象中靠前很多\n3. 转肩不是转腰！用肩膀带动\n\n费德勒说过"单反是一种艺术"，现在终于有点理解了。坚持练下去！',
    createdAt: '5小时前',
    comments: [
      { id: 'c3', author: '张鹏飞', avatar: '🔥', content: '单反太帅了，但我正手太暴力了改不过来😂', createdAt: '4小时前' },
      { id: 'c4', author: '周明远', avatar: '👨‍🏫', content: '第2点说得很对，很多学员都是击球点靠后', createdAt: '3小时前' },
    ],
  },
  {
    image: POST_IMAGES[2],
    title: '从3.0到4.0，我用了8个月',
    author: '李思远', avatar: '📈', likes: 1893,
    content: '去年3月开始认真练球，从3.0到现在稳定4.0。分享几个对我帮助最大的事：\n\n1. 每周固定2-3次上场，比每天对墙有效\n2. 找了王晓琳教练上了20节课，技术动作纠正很快\n3. 多打比赛！实战中学到的比练习多得多\n4. 录视频分析自己的动作，很多问题肉眼看不出来\n\n加油，球友们！',
    createdAt: '昨天',
    comments: [
      { id: 'c5', author: '赵雨萱', avatar: '🌈', content: '太励志了！我现在2.5，目标是今年到3.0', createdAt: '20小时前' },
      { id: 'c6', author: '王晓琳', avatar: '👑', content: '思远进步确实很快，关键是练习态度认真👍', createdAt: '18小时前' },
      { id: 'c7', author: '陈俊豪', avatar: '💻', content: '求推荐录视频的设备和角度', createdAt: '15小时前' },
    ],
  },
  {
    image: POST_IMAGES[3],
    title: '匠心之轮体验报告：贵但值得',
    author: '王晓琳', avatar: '👑', likes: 756,
    content: '昨天去匠心之轮上了一堂课，设施确实是北京顶级的。室内6片场地全部铺设的澳网同款材质，灯光、温度、湿度都可以精确控制。更衣室堪比五星酒店。\n\n唯一的缺点就是贵（280/h）和远（顺义），适合对品质有要求且不差钱的球友。教练团队水平很高，推荐试训一次。',
    createdAt: '2天前',
    comments: [
      { id: 'c8', author: '周明远', avatar: '👨‍🏫', content: '那边教练确实都是专业出身，我有几个同事在那儿', createdAt: '1天前' },
    ],
  },
  {
    image: POST_IMAGES[4],
    title: '公司团建组织了网球赛，冠军是我！',
    author: '吴思涵', avatar: '🏢', likes: 445,
    content: '作为公司网球社团负责人，终于说服HR把这次团建改成网球赛了。16人参赛，单淘汰制，我居然拿了冠军🏆\n\n决赛对手是产品部的老王（据说以前打过市队），最后抢七赢的，太刺激了！现在全公司都知道我打网球了，约球的人多了好多哈哈',
    createdAt: '3天前',
    comments: [
      { id: 'c9', author: '陈俊豪', avatar: '💻', content: '我就在你们公司楼下！下次叫上我', createdAt: '2天前' },
    ],
  },
  {
    image: POST_IMAGES[5],
    title: '雨后的朝阳公园红土场，美翻了',
    author: '孙婉清', avatar: '🌸', likes: 932,
    content: '今天雨后去朝阳公园网球中心，红土场被雨水洗过之后颜色特别正，配上周围的绿树，像是在欧洲打球一样。\n\n红土场打起来脚感很不一样，可以滑步，对膝盖也友好。唯一不好的是鞋子会变成红色的😂',
    createdAt: '4天前',
    comments: [
      { id: 'c10', author: '张鹏飞', avatar: '🔥', content: '红土滑步太爽了，感觉自己是纳达尔', createdAt: '3天前' },
      { id: 'c11', author: '李思远', avatar: '📈', content: '确实漂亮！下次约在红土场打', createdAt: '3天前' },
    ],
  },
  {
    image: POST_IMAGES[6],
    title: '新手第一次上场，紧张又开心',
    author: '赵雨萱', avatar: '🌈', likes: 267,
    content: '今天跟着周教练上了人生第一次网球课！之前一直在看视频学，真正上场才发现完全不一样。\n\n教练很耐心，从握拍教起，两小时下来能稳定回球了（虽然方向不太准😅）。网球真的好好玩！希望能坚持下去，目标是年底能打完一整盘比赛。',
    createdAt: '5天前',
    comments: [
      { id: 'c12', author: '周明远', avatar: '👨‍🏫', content: '第一次就能稳定回球已经很棒了！继续加油💪', createdAt: '4天前' },
      { id: 'c13', author: '吴思涵', avatar: '🏢', content: '欢迎加入我们公司社团周末活动，新手友好！', createdAt: '4天前' },
    ],
  },
  {
    image: POST_IMAGES[7],
    title: '球线测评：Luxilon ALU Power vs RPM Blast',
    author: '林浩宇', avatar: '🎾', likes: 673,
    content: '最近分别试了这两款顶级聚酯线各两周，分享一下体验：\n\nALU Power：控制极佳，击球清脆，旋转中等。适合平击多的选手。掉磅比较快，建议52-54磅。\n\nRPM Blast：旋转暴力，咬球感强，但手感偏硬。适合强上旋打法。48-50磅打起来最舒服。\n\n结论：我最终选了ALU Power，因为我单反平击多。你们呢？',
    createdAt: '1周前',
    comments: [
      { id: 'c14', author: '刘子轩', avatar: '🎯', content: 'ALU Power + 1！单反选手的标配', createdAt: '6天前' },
      { id: 'c15', author: '张鹏飞', avatar: '🔥', content: '我用RPM，暴力正手需要旋转兜住', createdAt: '5天前' },
    ],
  },
  {
    image: POST_IMAGES[8],
    title: '分享一个超实用的热身流程',
    author: '周明远', avatar: '👨‍🏫', likes: 1245,
    content: '很多球友到了球场直接就开打，容易受伤。分享一个我给学员用的10分钟热身流程：\n\n1. 慢跑2分钟提升心率\n2. 动态拉伸：弓步行走、侧弓步、高抬腿各10次\n3. 肩部绕环、手腕活动各30秒\n4. 短距离迷你网球（站发球线内）2分钟\n5. 逐渐退到底线，从轻打开始加力\n\n这样热身完再打，手感来得快还不容易伤。',
    createdAt: '1周前',
    comments: [
      { id: 'c16', author: '李思远', avatar: '📈', content: '收藏了！之前确实都是直接开打', createdAt: '6天前' },
      { id: 'c17', author: '孙婉清', avatar: '🌸', content: '迷你网球那步很有用，找球感特别快', createdAt: '5天前' },
    ],
  },
  {
    image: POST_IMAGES[9],
    title: '比赛心态崩了怎么办？聊聊我的经历',
    author: '张鹏飞', avatar: '🔥', likes: 891,
    content: '上周比赛5-2领先被翻盘了，当时心态完全崩了，连续双误送了三个破发点。赛后很沮丧，但冷静下来总结了一下：\n\n1. 领先时不要想"这盘稳了"，每一分独立对待\n2. 被追分时不要改变打法，坚持自己的节奏\n3. 关键分打自己最有把握的球，别冒险\n\n下次一定稳住！也请球友们分享你们的比赛心得。',
    createdAt: '4天前',
    comments: [
      { id: 'c18', author: '林浩宇', avatar: '🎾', content: '5-2领先最危险，我也被翻过好几次。关键是发球局的第一分', createdAt: '3天前' },
      { id: 'c19', author: '刘子轩', avatar: '🎯', content: '推荐一本书《The Inner Game of Tennis》，对比赛心态帮助很大', createdAt: '2天前' },
    ],
  },
]

// ============ 互评数据 ============
// 为3场已完成比赛生成互评（matchId 在插入时获取）
function generateRatings(matchIds) {
  const ratings = []
  const now = new Date()

  // 第一场：光彩馆对抗赛 (sim_user_003, 010, 001, 006)
  const m1Players = [
    { openid: 'sim_user_003', name: '王晓琳', avatar: '👑' },
    { openid: 'sim_user_010', name: '林浩宇', avatar: '🎾' },
    { openid: 'sim_user_001', name: '张鹏飞', avatar: '🔥' },
    { openid: 'sim_user_006', name: '刘子轩', avatar: '🎯' },
  ]
  // 每人评其他3人
  const m1Scores = [
    // 王晓琳评其他人
    { from: 0, to: 1, scores: { skill: 9, punctuality: 9, friendliness: 9 }, comment: '浩宇技术很全面，配合默契' },
    { from: 0, to: 2, scores: { skill: 8, punctuality: 8, friendliness: 9 }, comment: '鹏飞正手很暴力，双打意识还能再提升' },
    { from: 0, to: 3, scores: { skill: 8, punctuality: 9, friendliness: 8 }, comment: '子轩的单反很稳定' },
    // 林浩宇评其他人
    { from: 1, to: 0, scores: { skill: 10, punctuality: 10, friendliness: 9 }, comment: '教练级别的水平，学到很多' },
    { from: 1, to: 2, scores: { skill: 8, punctuality: 7, friendliness: 9 }, comment: '鹏飞打球很拼，就是有时候迟到几分钟' },
    { from: 1, to: 3, scores: { skill: 8, punctuality: 9, friendliness: 8 }, comment: '' },
    // 张鹏飞评其他人
    { from: 2, to: 0, scores: { skill: 10, punctuality: 9, friendliness: 10 }, comment: '晓琳姐太强了，以后多带带我' },
    { from: 2, to: 1, scores: { skill: 9, punctuality: 10, friendliness: 9 }, comment: '浩宇永远最早到，敬业！' },
    { from: 2, to: 3, scores: { skill: 8, punctuality: 9, friendliness: 7 }, comment: '子轩技术不错，但输球了有点情绪' },
    // 刘子轩评其他人
    { from: 3, to: 0, scores: { skill: 10, punctuality: 9, friendliness: 9 }, comment: '国内业余顶级水平' },
    { from: 3, to: 1, scores: { skill: 9, punctuality: 10, friendliness: 9 }, comment: '配合很好，打球很聪明' },
    { from: 3, to: 2, scores: { skill: 8, punctuality: 7, friendliness: 9 }, comment: '正手威力大，热情友好' },
  ]
  m1Scores.forEach(s => {
    ratings.push({
      _openid: m1Players[s.from].openid,
      matchId: matchIds[0],
      toOpenid: m1Players[s.to].openid,
      fromName: m1Players[s.from].name,
      fromAvatar: m1Players[s.from].avatar,
      toName: m1Players[s.to].name,
      toAvatar: m1Players[s.to].avatar,
      scores: s.scores,
      comment: s.comment,
      createdAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
    })
  })

  // 第二场：朝阳公园混双 (sim_user_002, 007, 004, 005)
  const m2Players = [
    { openid: 'sim_user_002', name: '李思远', avatar: '📈' },
    { openid: 'sim_user_007', name: '孙婉清', avatar: '🌸' },
    { openid: 'sim_user_004', name: '陈俊豪', avatar: '💻' },
    { openid: 'sim_user_005', name: '赵雨萱', avatar: '🌈' },
  ]
  const m2Scores = [
    { from: 0, to: 1, scores: { skill: 7, punctuality: 9, friendliness: 10 }, comment: '婉清双打意识很好，很会鼓励搭子' },
    { from: 0, to: 2, scores: { skill: 6, punctuality: 8, friendliness: 9 }, comment: '俊豪虽然水平一般但很努力' },
    { from: 0, to: 3, scores: { skill: 5, punctuality: 10, friendliness: 10 }, comment: '雨萱第一次打就很有天赋！' },
    { from: 1, to: 0, scores: { skill: 7, punctuality: 9, friendliness: 9 }, comment: '思远进步很快，打球很认真' },
    { from: 1, to: 2, scores: { skill: 6, punctuality: 7, friendliness: 8 }, comment: '' },
    { from: 1, to: 3, scores: { skill: 5, punctuality: 10, friendliness: 10 }, comment: '小萱好可爱，继续加油' },
    { from: 2, to: 0, scores: { skill: 7, punctuality: 9, friendliness: 9 }, comment: '思远是很好的搭子' },
    { from: 2, to: 1, scores: { skill: 8, punctuality: 9, friendliness: 10 }, comment: '婉清姐打球好温柔，技术又好' },
    { from: 2, to: 3, scores: { skill: 4, punctuality: 10, friendliness: 10 }, comment: '' },
    { from: 3, to: 0, scores: { skill: 8, punctuality: 9, friendliness: 9 }, comment: '思远哥很耐心教我' },
    { from: 3, to: 1, scores: { skill: 8, punctuality: 10, friendliness: 10 }, comment: '婉清姐特别友好，教了我很多' },
    { from: 3, to: 2, scores: { skill: 7, punctuality: 8, friendliness: 9 }, comment: '俊豪和我水平差不多，互相鼓励' },
  ]
  m2Scores.forEach(s => {
    ratings.push({
      _openid: m2Players[s.from].openid,
      matchId: matchIds[1],
      toOpenid: m2Players[s.to].openid,
      fromName: m2Players[s.from].name,
      fromAvatar: m2Players[s.from].avatar,
      toName: m2Players[s.to].name,
      toAvatar: m2Players[s.to].avatar,
      scores: s.scores,
      comment: s.comment,
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    })
  })

  // 第三场：天坛新手教学 (sim_user_008, 005, 009)
  const m3Players = [
    { openid: 'sim_user_008', name: '周明远', avatar: '👨‍🏫' },
    { openid: 'sim_user_005', name: '赵雨萱', avatar: '🌈' },
    { openid: 'sim_user_009', name: '吴思涵', avatar: '🏢' },
  ]
  const m3Scores = [
    { from: 0, to: 1, scores: { skill: 4, punctuality: 10, friendliness: 10 }, comment: '雨萱学习态度很好，有天赋' },
    { from: 0, to: 2, scores: { skill: 6, punctuality: 9, friendliness: 9 }, comment: '思涵基础不错，多练就能提升' },
    { from: 1, to: 0, scores: { skill: 10, punctuality: 10, friendliness: 10 }, comment: '周教练超级耐心！讲解很清楚' },
    { from: 1, to: 2, scores: { skill: 6, punctuality: 9, friendliness: 9 }, comment: '思涵哥很照顾新人' },
    { from: 2, to: 0, scores: { skill: 10, punctuality: 10, friendliness: 10 }, comment: '专业教练就是不一样，两小时学到很多' },
    { from: 2, to: 1, scores: { skill: 4, punctuality: 10, friendliness: 10 }, comment: '雨萱虽然刚入门但很有热情' },
  ]
  m3Scores.forEach(s => {
    ratings.push({
      _openid: m3Players[s.from].openid,
      matchId: matchIds[2],
      toOpenid: m3Players[s.to].openid,
      fromName: m3Players[s.from].name,
      fromAvatar: m3Players[s.from].avatar,
      toName: m3Players[s.to].name,
      toAvatar: m3Players[s.to].avatar,
      scores: s.scores,
      comment: s.comment,
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    })
  })

  return ratings
}

// ============ 工具函数 ============
async function clearCollection(name) {
  const col = db.collection(name)
  let deleted = 0
  while (true) {
    const { data } = await col.limit(100).get()
    if (data.length === 0) break
    for (const item of data) {
      await col.doc(item._id).remove()
      deleted++
    }
  }
  return deleted
}

// ============ 主函数 ============
exports.main = async (event, context) => {
  const results = { cleared: {}, inserted: {} }

  // 1. 清空旧数据
  const collections = ['posts', 'matches', 'venues', 'users', 'ratings', 'user_actions']
  for (const name of collections) {
    results.cleared[name] = await clearCollection(name)
  }

  // 2. 写入用户
  for (const user of USERS) {
    await db.collection('users').add({
      data: { ...user, createdAt: db.serverDate() },
    })
  }
  results.inserted.users = USERS.length

  // 3. 写入场馆
  for (const venue of VENUES) {
    await db.collection('venues').add({ data: venue })
  }
  results.inserted.venues = VENUES.length

  // 4. 写入约球活动，记录已完成场次的ID
  const completedMatchIds = []
  for (const match of MATCHES) {
    const res = await db.collection('matches').add({
      data: { ...match, createdAt: db.serverDate() },
    })
    if (match.status === 'completed') {
      completedMatchIds.push(res._id)
    }
  }
  results.inserted.matches = MATCHES.length

  // 5. 写入帖子
  for (const post of POSTS) {
    await db.collection('posts').add({
      data: { ...post, createdAt: db.serverDate() },
    })
  }
  results.inserted.posts = POSTS.length

  // 6. 写入互评数据
  const ratings = generateRatings(completedMatchIds)
  for (const rating of ratings) {
    await db.collection('ratings').add({ data: rating })
  }
  results.inserted.ratings = ratings.length

  // 7. 写入用户行为（点赞、加入等）
  const actions = [
    { _openid: 'sim_user_001', targetId: '', type: 'like', createdAt: db.serverDate() },
    { _openid: 'sim_user_003', targetId: '', type: 'like', createdAt: db.serverDate() },
    { _openid: 'sim_user_006', targetId: '', type: 'like', createdAt: db.serverDate() },
    { _openid: 'sim_user_007', targetId: '', type: 'like', createdAt: db.serverDate() },
    { _openid: 'sim_user_010', targetId: '', type: 'like', createdAt: db.serverDate() },
  ]
  for (const action of actions) {
    await db.collection('user_actions').add({ data: action })
  }
  results.inserted.user_actions = actions.length

  return { success: true, ...results }
}
