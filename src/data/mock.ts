import type { Post, Match, Venue, User } from '../types'

import tennisCourt1 from '../assets/images/tennis-court-1.jpg'
import tennisCourt2 from '../assets/images/tennis-court-2.jpg'
import tennisPlayer1 from '../assets/images/tennis-player-1.jpg'
import tennisBall from '../assets/images/tennis-ball.jpg'
import tennisRacket from '../assets/images/tennis-racket.jpg'
import tennisDoubles from '../assets/images/tennis-doubles.jpg'
import venue1 from '../assets/images/venue-1.jpg'
import venue2 from '../assets/images/venue-2.jpg'
import venue3 from '../assets/images/venue-3.jpg'

export const MOCK_POSTS: Post[] = [
  {
    id: '1', image: tennisCourt1,
    title: '周末约球｜奥体中心，中级水平求搭子',
    author: '网球少年', avatar: '🎾', likes: 1280,
    content: '这周六下午奥体有场地，想找个中级水平的搭子练练。最近正手进步很大，想多打比赛巩固一下。有兴趣的球友评论区留言～',
    createdAt: '2小时前',
    comments: [
      { id: 'c1', author: '老张', avatar: '🏃', content: '我可以！4.0水平', createdAt: '1小时前' },
      { id: 'c2', author: 'Lucy', avatar: '🌟', content: '周六几点呀？', createdAt: '30分钟前' },
    ],
  },
  {
    id: '2', image: tennisRacket,
    title: '入门球拍怎么选？新手必看攻略',
    author: 'Coach王', avatar: '🏆', likes: 856,
    content: '很多新手问我球拍怎么选，今天统一回答一下：\n\n1. 预算1000以内推荐百宝力PD\n2. 手感优先选威尔胜Clash\n3. 力量不足选Head Radical\n\n最重要的是去实体店试打，手感因人而异。',
    createdAt: '5小时前',
    comments: [
      { id: 'c3', author: '小白', avatar: '🎾', content: '终于有人讲清楚了！', createdAt: '3小时前' },
    ],
  },
  {
    id: '3', image: tennisCourt2,
    title: '藏在城市里的宝藏球场，人少灯光好',
    author: '场馆探店', avatar: '📍', likes: 562,
    content: '今天发现一个超棒的室内球场，在朝阳区望京附近。6片场地，LED灯光，地面刚翻新过，最关键是人少！周中基本不用排队。',
    createdAt: '昨天',
    comments: [],
  },
  {
    id: '4', image: tennisPlayer1,
    title: '正手击球发力技巧，三个月从3.0到4.0',
    author: '职业教练李', avatar: '⭐', likes: 3024,
    content: '分享一下我教学中最有效的正手提升方法：\n\n核心要点：转体发力，不是手臂发力。想象你在甩毛巾，力量从脚开始，经过腰，最后到拍头。\n\n每天对墙练习30分钟，坚持三个月你会看到明显进步。',
    createdAt: '3天前',
    comments: [
      { id: 'c4', author: '进步中', avatar: '💪', content: '照着练了一周，确实有感觉！', createdAt: '2天前' },
      { id: 'c5', author: '网球迷', avatar: '🎾', content: '教练说得对，转体是关键', createdAt: '1天前' },
    ],
  },
  {
    id: '5', image: tennisBall,
    title: '今日战绩 6-3 6-4 连胜第五场！',
    author: '老张打球记', avatar: '🔥', likes: 456,
    content: '今天状态爆棚！发球局全保，对手是4.5的水平，能赢真的太开心了。赛后一起喝了杯咖啡，约了下周再战。这就是网球的魅力吧！',
    createdAt: '6小时前',
    comments: [],
  },
  {
    id: '6', image: tennisDoubles,
    title: '双打配合默契度训练，找到你的最佳搭档',
    author: '双打俱乐部', avatar: '👥', likes: 728,
    content: '双打不仅是技术，更是默契。今天分享几个提升搭档配合度的方法：\n\n1. 赛前沟通站位策略\n2. 用手势示意发球方向\n3. 网前截击要果断\n4. 多鼓励，少埋怨',
    createdAt: '2天前',
    comments: [
      { id: 'c6', author: '搭子', avatar: '🤝', content: '第4点最重要！', createdAt: '1天前' },
    ],
  },
  {
    id: '7', image: tennisCourt1,
    title: '雨后球场超美，分享几张照片',
    author: '摄影爱好者', avatar: '📸', likes: 932,
    content: '昨天雨后去球场，夕阳洒在球场上太美了。分享几张随手拍，网球和摄影两个爱好完美结合。',
    createdAt: '4天前',
    comments: [],
  },
  {
    id: '8', image: tennisPlayer1,
    title: '从零开始学网球，一年的心路历程',
    author: '网球新人', avatar: '🌱', likes: 1567,
    content: '一年前完全不会打球，现在能和4.0的球友对打了。最大的感悟是：找一个好教练比自己瞎练有效10倍。',
    createdAt: '5天前',
    comments: [
      { id: 'c7', author: '同路人', avatar: '🎾', content: '太励志了！', createdAt: '4天前' },
    ],
  },
  {
    id: '9', image: tennisRacket,
    title: '球线选择指南：硬线vs软线到底选哪个？',
    author: '装备达人', avatar: '🔧', likes: 673,
    content: '很多球友纠结球线选择。简单说：力量大选硬线（聚酯线），控制手感为主选软线（天然肠线或仿肠线）。预算有限就选聚酯线，耐用且便宜。',
    createdAt: '1周前',
    comments: [],
  },
  {
    id: '10', image: tennisDoubles,
    title: '公司团建打网球，意外发现好多隐藏高手',
    author: '职场球友', avatar: '💼', likes: 445,
    content: '公司组织网球团建，没想到CTO打了二十年球，水平超高。现在每周五下班后一起约球，工作关系都变好了。',
    createdAt: '1周前',
    comments: [],
  },
  {
    id: '11', image: tennisBall,
    title: '比赛心态调整：输球不可怕，怕的是放弃',
    author: '心理教练', avatar: '🧠', likes: 891,
    content: '很多业余选手比赛时容易崩溃。分享一个小技巧：每一分都是新的开始，不要想上一分的失误。深呼吸，专注当下这一拍。',
    createdAt: '3天前',
    comments: [],
  },
  {
    id: '12', image: tennisCourt2,
    title: '测评：五家球馆的夜场体验对比',
    author: '场馆测评师', avatar: '🔦', likes: 1203,
    content: '花了两周时间，测评了北京五家主流球馆的夜场体验。从灯光、场地、服务、性价比四个维度打分，最终推荐奥体中心和望京网球馆。',
    createdAt: '4天前',
    comments: [
      { id: 'c8', author: '夜猫子', avatar: '🦉', content: '求具体地址！', createdAt: '3天前' },
    ],
  },
]

export const MOCK_MATCHES: Match[] = [
  {
    id: '1', image: tennisCourt1,
    title: '周六下午奥体约球', level: '中级',
    host: '网球少年', hostLevel: '4.0',
    location: '奥体中心网球馆', time: '周六 14:00-16:00',
    spots: { current: 2, total: 4 }, fee: 50,
    tags: ['双打', '可教学'],
    description: '老地方老时间，欢迎中级水平的球友加入。场地已预约，AA制分摊费用。自带球拍和水，场馆有更衣室可以洗澡。',
    participants: [
      { id: 'p1', name: '网球少年', avatar: '🎾', level: '4.0' },
      { id: 'p2', name: 'Lucy', avatar: '🌟', level: '3.5' },
    ],
  },
  {
    id: '2', image: tennisDoubles,
    title: '工作日晚间畅打', level: '初级',
    host: '新手小王', hostLevel: '2.5',
    location: '朝阳公园网球场', time: '周三 19:00-21:00',
    spots: { current: 1, total: 2 }, fee: 40,
    tags: ['单打', '新手友好'],
    description: '刚学球半年，想找同水平的球友一起练习。不追求竞技，开心为主。场地在朝阳公园东门进去右手边。',
    participants: [
      { id: 'p3', name: '新手小王', avatar: '🌱', level: '2.5' },
    ],
  },
  {
    id: '3', image: tennisCourt2,
    title: '周末双打约战！高手来', level: '高级',
    host: 'Coach李', hostLevel: '5.0',
    location: '国家网球中心', time: '周日 09:00-12:00',
    spots: { current: 3, total: 4 }, fee: 80,
    tags: ['双打', '竞技'],
    description: '周末三小时高水平双打对抗赛。要求4.5以上水平，有比赛经验优先。场地费AA，赛后聚餐自愿参加。',
    participants: [
      { id: 'p4', name: 'Coach李', avatar: '⭐', level: '5.0' },
      { id: 'p5', name: '老张', avatar: '🏃', level: '4.5' },
      { id: 'p6', name: '王教练', avatar: '🏆', level: '4.8' },
    ],
  },
  {
    id: '4', image: venue1,
    title: '周五下班后来一局', level: '中级',
    host: '职场球友', hostLevel: '3.5',
    location: '望京网球馆', time: '周五 18:30-20:30',
    spots: { current: 1, total: 4 }, fee: 45,
    tags: ['双打', '下班约球'],
    description: '每周五固定约球，下班后直接过来。场馆离望京地铁站5分钟路程，交通方便。',
    participants: [
      { id: 'p7', name: '职场球友', avatar: '💼', level: '3.5' },
    ],
  },
  {
    id: '5', image: venue2,
    title: '亲子网球体验课', level: '初级',
    host: '教练Amy', hostLevel: '4.0',
    location: '朝阳公园网球场', time: '周六 10:00-11:30',
    spots: { current: 4, total: 6 }, fee: 30,
    tags: ['亲子', '体验课', '新手友好'],
    status: 'completed',
    description: '专为家长和孩子设计的网球体验课，教练全程指导。适合5-12岁儿童，家长可一起参与。装备可借用。',
    participants: [
      { id: 'p8', name: '教练Amy', avatar: '👩‍🏫', level: '4.0', openid: 'mock_openid_1' },
      { id: 'p9', name: '球爸', avatar: '👨', level: '3.0', openid: 'mock_openid_2' },
      { id: 'p10', name: '小明妈', avatar: '👩', level: '2.5', openid: 'mock_openid_3' },
      { id: 'p11', name: '运动家庭', avatar: '👨‍👩‍👧', level: '3.0', openid: 'mock_openid_4' },
    ],
  },
  {
    id: '6', image: venue3,
    title: '周日清晨拉练', level: '高级',
    host: '铁人老赵', hostLevel: '4.5',
    location: '国家网球中心', time: '周日 07:00-09:00',
    spots: { current: 2, total: 2 }, fee: 60,
    tags: ['单打', '体能训练'],
    status: 'completed',
    description: '早起拉练，先跑步热身再打球。适合想提升体能和技术的球友，强度较大，请做好心理准备。',
    participants: [
      { id: 'p12', name: '铁人老赵', avatar: '🏋️', level: '4.5', openid: 'mock_openid_5' },
      { id: 'p13', name: '跑步达人', avatar: '🏃', level: '4.0', openid: 'mock_openid_6' },
    ],
  },
]

export const MOCK_VENUES: Venue[] = [
  {
    id: '1', name: '奥体中心网球馆', image: venue1,
    rating: 8.7, reviews: 128, distance: '2.3km', price: 80,
    tags: ['室内', '灯光好', '停车方便'],
    scores: { env: 8.9, service: 8.5, value: 8.8 },
    address: '朝阳区北四环中路7号',
    phone: '010-64912233',
    openHours: '06:00-22:00',
    facilities: ['淋浴', '更衣室', '停车场', '球拍租赁', '教练服务'],
    images: [venue1, venue2, venue3],
    latitude: 39.9929, longitude: 116.3889,
  },
  {
    id: '2', name: '朝阳公园网球场', image: venue2,
    rating: 8.2, reviews: 86, distance: '1.5km', price: 60,
    tags: ['室外', '风景好', '新翻修'],
    scores: { env: 8.5, service: 7.8, value: 8.3 },
    address: '朝阳区朝阳公园南路1号',
    phone: '010-65953603',
    openHours: '07:00-21:00',
    facilities: ['更衣室', '饮水机', '教练服务'],
    images: [venue2, venue1],
    latitude: 39.9340, longitude: 116.4737,
  },
  {
    id: '3', name: '国家网球中心', image: venue3,
    rating: 9.1, reviews: 256, distance: '5.8km', price: 120,
    tags: ['专业', '硬地', '国际标准'],
    scores: { env: 9.3, service: 9.0, value: 8.9 },
    address: '朝阳区林萃路2号',
    phone: '010-84376699',
    openHours: '08:00-22:00',
    facilities: ['淋浴', '更衣室', '停车场', '球拍租赁', '教练服务', '餐厅', 'Pro Shop'],
    images: [venue3, venue1, venue2],
    latitude: 40.0190, longitude: 116.3847,
  },
  {
    id: '4', name: '望京网球馆', image: venue1,
    rating: 8.4, reviews: 67, distance: '3.1km', price: 70,
    tags: ['室内', '新开业', '空调'],
    scores: { env: 8.6, service: 8.2, value: 8.5 },
    address: '朝阳区望京西路50号',
    phone: '010-64783322',
    openHours: '07:00-23:00',
    facilities: ['淋浴', '更衣室', '停车场', '空调'],
    images: [venue1, venue3],
    latitude: 39.9900, longitude: 116.4700,
  },
  {
    id: '5', name: '海淀网球公园', image: venue2,
    rating: 7.9, reviews: 45, distance: '8.2km', price: 50,
    tags: ['室外', '平价', '地铁直达'],
    scores: { env: 7.5, service: 7.8, value: 8.5 },
    address: '海淀区西三环北路105号',
    phone: '010-68456677',
    openHours: '06:30-21:30',
    facilities: ['更衣室', '饮水机'],
    images: [venue2],
    latitude: 39.9641, longitude: 116.3063,
  },
  {
    id: '6', name: '中网钻石球场', image: venue3,
    rating: 9.5, reviews: 312, distance: '6.5km', price: 200,
    tags: ['专业', '顶级', '国际赛事'],
    scores: { env: 9.8, service: 9.5, value: 8.2 },
    address: '朝阳区林萃路2号国家网球中心内',
    phone: '010-84376700',
    openHours: '09:00-21:00',
    facilities: ['淋浴', '更衣室', 'VIP休息室', '停车场', '球拍租赁', '教练服务', '餐厅', 'Pro Shop', '理疗室'],
    images: [venue3, venue2, venue1],
    latitude: 40.0195, longitude: 116.3852,
  },
]

export const MOCK_USER: User = {
  id: 'u1',
  name: '韩威',
  avatar: '',
  level: 'NTRP 4.0',
  bio: '热爱网球，享受每一次击球的快感 🎾',
  stats: { matches: 42, rating: 8.5, friends: 15, badges: 8 },
}

export function getPosts(page: number, pageSize = 6): Post[] {
  const start = (page - 1) * pageSize
  return MOCK_POSTS.slice(start, start + pageSize)
}

export function getPostById(id: string): Post | undefined {
  return MOCK_POSTS.find(p => p.id === id)
}

export function getMatchById(id: string): Match | undefined {
  return MOCK_MATCHES.find(m => m.id === id)
}

export function getVenueById(id: string): Venue | undefined {
  return MOCK_VENUES.find(v => v.id === id)
}
