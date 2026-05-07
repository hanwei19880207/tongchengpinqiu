import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { login, getProfile, isLoggedIn, getOpenid, updateProfile } from '../../services/user'
import { fetchRatingsForUser, computeAggregatedRating } from '../../services/rating'
import type { User, AggregatedRating } from '../../types'
import './index.scss'

import avatarImg from '../../assets/images/avatar.jpg'

const MENU_ITEMS = [
  { icon: '🎾', label: '我的约球', desc: '查看参与的活动', badge: 0 },
  { icon: '📍', label: '收藏场馆', desc: '收藏的场馆', badge: 0 },
  { icon: '⭐', label: '我的评价', desc: '评价记录', badge: 0 },
  { icon: '🏆', label: '运动成就', desc: '徽章和成就', badge: 0 },
  { icon: '📊', label: '运动数据', desc: '运动统计', badge: 0 },
  { icon: '⚙️', label: '设置', desc: '', badge: 0 },
]

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aggRating, setAggRating] = useState<AggregatedRating>({ skill: 0, punctuality: 0, friendliness: 0, count: 0 })

  const loadProfile = async () => {
    setLoading(true)
    if (isLoggedIn()) {
      setLoggedIn(true)
      const profile = await getProfile()
      if (profile) setUser(profile)
      try {
        const openid = getOpenid()
        if (openid) {
          const ratings = await fetchRatingsForUser(openid)
          setAggRating(computeAggregatedRating(ratings))
        }
      } catch {}
    }
    setLoading(false)
  }

  useDidShow(() => {
    loadProfile()
  })

  const handleLogin = async () => {
    try {
      Taro.showLoading({ title: '登录中...' })
      await login()
      setLoggedIn(true)

      try {
        const res = await Taro.getUserProfile({ desc: '用于完善用户资料' })
        await updateProfile({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      } catch {}

      await loadProfile()
      Taro.hideLoading()
      Taro.showToast({ title: '登录成功', icon: 'success' })
    } catch {
      Taro.hideLoading()
      Taro.showToast({ title: '登录失败', icon: 'none' })
    }
  }

  if (loading) {
    return (
      <View className="profile">
        <View className="loading"><Text>加载中...</Text></View>
      </View>
    )
  }

  if (!loggedIn) {
    return (
      <View className="profile">
        <View className="login-card">
          <View className="login-avatar-placeholder">
            <Text className="login-emoji">🎾</Text>
          </View>
          <Text className="login-title">登录约球吧</Text>
          <Text className="login-desc">登录后可发布约球、收藏场馆、记录运动数据</Text>
          <View className="login-btn" onClick={handleLogin}>
            <Text>微信一键登录</Text>
          </View>
        </View>
      </View>
    )
  }

  const stats = [
    { num: String(user?.stats.matches || 0), label: '约球', icon: '🎾' },
    { num: String(user?.stats.rating || 0), label: '球友评分', icon: '⭐' },
    { num: String(user?.stats.friends || 0), label: '球友', icon: '👥' },
    { num: String(user?.stats.badges || 0), label: '徽章', icon: '🏆' },
  ]

  return (
    <View className="profile">
      <View className="profile-card">
        <View className="profile-bg" />
        <View className="profile-info">
          <Image className="profile-avatar" src={user?.avatar || avatarImg} mode="aspectFill" />
          <View className="profile-detail">
            <Text className="profile-name">{user?.name || '球友'}</Text>
            <View className="profile-tags">
              <View className="p-tag p-tag--level"><Text>{user?.level || 'NTRP 2.5'}</Text></View>
              <View className="p-tag p-tag--active"><Text>活跃球友</Text></View>
            </View>
            <Text className="profile-bio">{user?.bio || '热爱网球，享受每一次击球的快感'}</Text>
          </View>
          <View className="edit-btn" onClick={() => Taro.navigateTo({ url: '/pages/edit-profile/index' })}><Text>编辑资料</Text></View>
        </View>

        <View className="stats-grid">
          {stats.map((s) => (
            <View key={s.label} className="stat-item">
              <Text className="stat-icon">{s.icon}</Text>
              <Text className="stat-num">{s.num}</Text>
              <Text className="stat-label">{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="rating-card">
        <View className="rating-header">
          <Text className="rating-title">球友对你的评价</Text>
          <Text className="rating-more" onClick={() => Taro.navigateTo({ url: '/pages/rating-history/index' })}>我的评价 ›</Text>
        </View>
        <View className="rating-body">
          <View className="rating-big">
            <Text className="rating-score">{aggRating.count > 0 ? ((aggRating.skill + aggRating.punctuality + aggRating.friendliness) / 3).toFixed(1) : '-'}</Text>
            <Text className="rating-stars">{aggRating.count > 0 ? '★'.repeat(Math.round((aggRating.skill + aggRating.punctuality + aggRating.friendliness) / 6)) + '☆'.repeat(5 - Math.round((aggRating.skill + aggRating.punctuality + aggRating.friendliness) / 6)) : '☆☆☆☆☆'}</Text>
            <Text className="rating-count">{aggRating.count}位球友评价</Text>
          </View>
          <View className="rating-dims">
            <View className="dim-row">
              <Text className="dim-label">技术水平</Text>
              <View className="dim-bar"><View className="dim-fill" style={{ width: `${aggRating.count > 0 ? aggRating.skill * 10 : 0}%` }} /></View>
              <Text className="dim-num">{aggRating.count > 0 ? aggRating.skill : '-'}</Text>
            </View>
            <View className="dim-row">
              <Text className="dim-label">守时靠谱</Text>
              <View className="dim-bar"><View className="dim-fill dim-fill--green" style={{ width: `${aggRating.count > 0 ? aggRating.punctuality * 10 : 0}%` }} /></View>
              <Text className="dim-num">{aggRating.count > 0 ? aggRating.punctuality : '-'}</Text>
            </View>
            <View className="dim-row">
              <Text className="dim-label">态度友好</Text>
              <View className="dim-bar"><View className="dim-fill dim-fill--blue" style={{ width: `${aggRating.count > 0 ? aggRating.friendliness * 10 : 0}%` }} /></View>
              <Text className="dim-num">{aggRating.count > 0 ? aggRating.friendliness : '-'}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="menu-card">
        {MENU_ITEMS.map((item) => (
          <View key={item.label} className="menu-item" onClick={() => {
            const routes: Record<string, string> = {
              '我的约球': '/pages/my-matches/index',
              '收藏场馆': '/pages/my-favorites/index',
              '我的评价': '/pages/rating-history/index',
              '运动成就': '/pages/achievements/index',
              '运动数据': '/pages/sports-data/index',
              '设置': '/pages/settings/index',
            }
            const url = routes[item.label]
            if (url) Taro.navigateTo({ url })
          }}>
            <Text className="menu-icon">{item.icon}</Text>
            <Text className="menu-label">{item.label}</Text>
            <Text className="menu-desc">{item.desc}</Text>
            {item.badge > 0 && <View className="menu-badge"><Text>{item.badge}</Text></View>}
            <Text className="menu-arrow">›</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
